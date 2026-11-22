export type CapsuleCategory = 'blue' | 'yellow' | 'pink' | 'green' | 'purple' | 'gold';

export type Rarity = 'COMMON' | 'RARE' | 'LEGENDARY' | 'SPECIAL';

export interface Reward {
  id: string;
  category: CapsuleCategory;
  categoryName: string;
  rarity: Rarity;
  title: string;
  content: string;
  sticker: string;
  quote?: string;
  tagline?: string;
  badgeLabel?: string;
}

export interface PlayerRewardClaim {
  rewardId: string;
  claimedAt: string;
}

export interface PlayerData {
  token: string;
  name: string;
  claimedRewardIds: string[];
  claimHistory: PlayerRewardClaim[];
  createdAt: string;
  lastActiveAt: string;
}

export interface GameSettings {
  recipientName: string;
  giverName: string;
  personalNote: string;
  ticketNumber: string;
  subtitle: string;
}
