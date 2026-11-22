import { REWARDS } from '../data/rewardsData';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { CapsuleCategory, PlayerData, Reward } from '../types';

const STORAGE_KEY_PREFIX = 'loomy_loot_';

export class StorageService {
  private playerToken: string;
  private playerData: PlayerData;

  constructor() {
    this.playerToken = this.resolvePlayerToken();
    this.playerData = this.loadLocalPlayerData();
    this.syncFromSupabase();
  }

  // Resolve token from URL query or localStorage
  private resolvePlayerToken(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl && tokenFromUrl.trim()) {
      const cleanToken = tokenFromUrl.trim();
      localStorage.setItem('loomy_active_token', cleanToken);
      return cleanToken;
    }

    const savedToken = localStorage.getItem('loomy_active_token');
    if (savedToken) {
      return savedToken;
    }

    // Default birthday edition token for Levina
    const defaultToken = 'levina-birthday-no001';
    localStorage.setItem('loomy_active_token', defaultToken);
    return defaultToken;
  }

  public getPlayerToken(): string {
    return this.playerToken;
  }

  public setPlayerToken(newToken: string) {
    if (!newToken.trim()) return;
    this.playerToken = newToken.trim();
    localStorage.setItem('loomy_active_token', this.playerToken);
    this.playerData = this.loadLocalPlayerData();
    this.syncFromSupabase();
  }

  // Load player data from local storage
  private loadLocalPlayerData(): PlayerData {
    const key = `${STORAGE_KEY_PREFIX}${this.playerToken}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PlayerData;
        return {
          token: this.playerToken,
          name: parsed.name || 'Levina',
          claimedRewardIds: parsed.claimedRewardIds || [],
          claimHistory: parsed.claimHistory || [],
          createdAt: parsed.createdAt || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error('Error parsing local player data', e);
      }
    }

    const initial: PlayerData = {
      token: this.playerToken,
      name: 'Levina',
      claimedRewardIds: [],
      claimHistory: [],
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    this.saveLocalPlayerData(initial);
    return initial;
  }

  private saveLocalPlayerData(data: PlayerData) {
    const key = `${STORAGE_KEY_PREFIX}${this.playerToken}`;
    data.lastActiveAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Sync with Supabase in background if credentials exist
  private async syncFromSupabase() {
    if (!isSupabaseConfigured()) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { data: player } = await client
        .from('players')
        .select('id, token, name')
        .eq('token', this.playerToken)
        .maybeSingle();

      if (player) {
        const { data: claims } = await client
          .from('player_rewards')
          .select('reward_id, claimed_at')
          .eq('player_id', player.id);

        if (claims && claims.length > 0) {
          const supabaseIds = claims.map((c) => c.reward_id);
          const mergedSet = new Set([...this.playerData.claimedRewardIds, ...supabaseIds]);
          this.playerData.claimedRewardIds = Array.from(mergedSet);
          this.saveLocalPlayerData(this.playerData);
        }
      }
    } catch (err) {
      console.warn('Supabase background sync notice:', err);
    }
  }

  public getClaimedRewardIds(): string[] {
    return [...this.playerData.claimedRewardIds];
  }

  public getProgress(): { claimed: number; total: number; percentage: number } {
    const total = REWARDS.length;
    const claimed = this.playerData.claimedRewardIds.length;
    const percentage = Math.round((claimed / total) * 100);
    return { claimed, total, percentage };
  }

  public isClaimed(rewardId: string): boolean {
    return this.playerData.claimedRewardIds.includes(rewardId);
  }

  public async claimNextReward(preferredCategory?: CapsuleCategory): Promise<{
    status: 'SUCCESS' | 'ALL_COLLECTED';
    reward?: Reward;
    isNew: boolean;
  }> {
    const claimedSet = new Set(this.playerData.claimedRewardIds);
    const unclaimed = REWARDS.filter((r) => !claimedSet.has(r.id));

    if (unclaimed.length === 0) {
      return { status: 'ALL_COLLECTED', isNew: false };
    }

    let candidatePool = unclaimed;
    if (preferredCategory) {
      const categoryMatches = unclaimed.filter((r) => r.category === preferredCategory);
      if (categoryMatches.length > 0) {
        candidatePool = categoryMatches;
      }
    }

    const selectedReward = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    this.playerData.claimedRewardIds.push(selectedReward.id);
    const nowIso = new Date().toISOString();
    this.playerData.claimHistory.push({
      rewardId: selectedReward.id,
      claimedAt: nowIso,
    });
    this.saveLocalPlayerData(this.playerData);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: player } = await client
            .from('players')
            .upsert({ token: this.playerToken, name: 'Levina' }, { onConflict: 'token' })
            .select('id')
            .single();

          if (player) {
            await client.from('player_rewards').upsert({
              player_id: player.id,
              reward_id: selectedReward.id,
              claimed_at: nowIso,
            });
          }
        } catch (err) {
          console.warn('Supabase remote claim logging notice:', err);
        }
      }
    }

    return {
      status: 'SUCCESS',
      reward: selectedReward,
      isNew: true,
    };
  }

  public resetProgress() {
    this.playerData.claimedRewardIds = [];
    this.playerData.claimHistory = [];
    this.saveLocalPlayerData(this.playerData);
  }
}

export const storage = new StorageService();
