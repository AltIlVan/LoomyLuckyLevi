import React, { useState } from 'react';
import type { CapsuleCategory, Reward } from '../types';
import { CATEGORIES, REWARDS } from '../data/rewardsData';
import { sound } from '../services/soundService';
import { Lock, ArrowLeft, Trophy } from 'lucide-react';

interface CollectionBookProps {
  unlockedIds: string[];
  onBackToArcade: () => void;
  onOpenRewardModal?: (reward: Reward) => void;
}

export const CollectionBook: React.FC<CollectionBookProps> = ({
  unlockedIds,
  onBackToArcade,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [inspectingReward, setInspectingReward] = useState<Reward | null>(null);

  const unlockedSet = new Set(unlockedIds);
  const totalCount = REWARDS.length;
  const unlockedCount = unlockedIds.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredRewards = REWARDS.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category === activeFilter;
  });

  const handleCardClick = (reward: Reward, isUnlocked: boolean) => {
    sound.playClick();
    if (isUnlocked) {
      setInspectingReward(reward);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none pb-12">
      
      {/* Top Navigation & Back Button */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playClick();
            onBackToArcade();
          }}
          className="neo-btn bg-[#FAF4EB] hover:bg-white text-[#171717] px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>BACK TO CLAW MACHINE</span>
        </button>

        <div className="flex items-center gap-1.5 bg-[#FFD027] px-3 py-1.5 border-2 border-[#171717] neo-shadow-sm rounded-xl font-mono text-xs font-black">
          <Trophy className="w-4 h-4 text-[#171717]" />
          <span>{unlockedCount} / {totalCount} LOOT</span>
        </div>
      </div>

      {/* Album Binder Marquee Header */}
      <div className="w-full bg-[#FAF4EB] border-3 border-[#171717] neo-shadow-lg rounded-3xl p-5 mb-5 relative overflow-hidden bg-dot-paper">
        <div className="absolute -top-3 left-8 w-20 h-6 bg-[#315BFF]/80 border border-[#171717] -rotate-3 z-10" />
        <div className="absolute -top-3 right-8 w-20 h-6 bg-[#FF4F87]/80 border border-[#171717] rotate-3 z-10" />

        <div className="text-center pt-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FF572E] bg-[#FF572E]/10 px-2 py-0.5 rounded border border-[#FF572E]/30">
            LEVINA'S PRIVATE ARCHIVE
          </span>
          <h1 className="font-arcade text-2xl sm:text-3xl text-[#171717] tracking-wider mt-1 mb-2">
            THE LOOT BOOK
          </h1>
          <p className="font-display text-xs text-[#555] max-w-sm mx-auto">
            Your personal collectible birthday vault. Click any unlocked capsule to re-read your notes anytime.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t-2 border-[#171717]">
          <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
            <span>COLLECTION PROGRESS</span>
            <span className="text-[#00C974]">{progressPercent}% COMPLETED</span>
          </div>
          <div className="w-full h-4 bg-[#E0E0E0] border-2 border-[#171717] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#00C974] to-[#315BFF] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 100% Celebration */}
        {unlockedCount >= totalCount && (
          <div className="mt-4 p-3 bg-[#FFD027] border-2 border-[#171717] rounded-xl flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div>
              <h4 className="font-arcade text-xs text-[#171717]">
                ULTIMATE LOOT MASTER LEVINA!
              </h4>
              <p className="font-mono text-[11px] text-[#171717] font-medium">
                You have collected every single birthday capsule. Happy Birthday, Levi!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="w-full overflow-x-auto pb-2 mb-4 scrollbar-none flex items-center gap-1.5">
        <button
          onClick={() => {
            sound.playClick();
            setActiveFilter('all');
          }}
          className={`neo-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#171717] text-[#F4EBDD]'
              : 'bg-[#FAF4EB] text-[#171717]'
          }`}
        >
          ALL ({unlockedCount}/{totalCount})
        </button>

        {(Object.keys(CATEGORIES) as CapsuleCategory[]).map((catKey) => {
          const cat = CATEGORIES[catKey];
          const catTotal = REWARDS.filter((r) => r.category === catKey).length;
          const catUnlocked = REWARDS.filter((r) => r.category === catKey && unlockedSet.has(r.id)).length;
          const isSelected = activeFilter === catKey;

          return (
            <button
              key={catKey}
              onClick={() => {
                sound.playClick();
                setActiveFilter(catKey);
              }}
              className={`neo-btn px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-[#FAF4EB] text-[#171717]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-[#171717]"
                style={{ backgroundColor: cat.colorHex }}
              />
              <span>
                {cat.name} ({catUnlocked}/{catTotal})
              </span>
            </button>
          );
        })}
      </div>

      {/* Collectible Cards Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredRewards.map((reward) => {
          const isUnlocked = unlockedSet.has(reward.id);
          const cat = CATEGORIES[reward.category];

          return (
            <div
              key={reward.id}
              onClick={() => handleCardClick(reward, isUnlocked)}
              className={`relative rounded-2xl border-3 border-[#171717] p-3 flex flex-col justify-between transition-all duration-200 ${
                isUnlocked
                  ? 'bg-white neo-shadow cursor-pointer hover:-translate-y-1 hover:neo-shadow-lg'
                  : 'bg-[#EAE4D9]/80 opacity-75 border-dashed cursor-not-allowed'
              }`}
              style={{ minHeight: '170px' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-[#171717]"
                  style={{ backgroundColor: cat.colorHex }}
                />
                <span className="font-mono text-[9px] font-black uppercase text-[#666]">
                  {isUnlocked ? reward.rarity : 'LOCKED'}
                </span>
              </div>

              <div className="my-auto flex flex-col items-center justify-center text-center py-2">
                {isUnlocked ? (
                  <>
                    <span className="text-3xl mb-1 filter drop-shadow-sm">{reward.sticker}</span>
                    <h3 className="font-arcade text-xs text-[#171717] line-clamp-2 leading-tight">
                      {reward.title}
                    </h3>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-[#D6CEBF] border border-[#171717]/40 flex items-center justify-center text-[#888] mb-1">
                      <Lock className="w-5 h-5 text-[#888]" />
                    </div>
                    <span className="font-mono text-[10px] text-[#777] font-bold">
                      ???
                    </span>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-[#171717]/20 flex items-center justify-between text-[9px] font-mono">
                <span className="text-[#888] uppercase truncate">{cat.name}</span>
                {isUnlocked && (
                  <span className="text-[#315BFF] font-bold">READ →</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Card Modal */}
      {inspectingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#FAF4EB] border-3 border-[#171717] neo-shadow-lg rounded-3xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span
                className="px-2.5 py-1 rounded text-xs font-mono font-bold text-white border border-[#171717]"
                style={{ backgroundColor: CATEGORIES[inspectingReward.category].colorHex }}
              >
                {CATEGORIES[inspectingReward.category].name}
              </span>
              <span className="font-mono text-xs font-black uppercase px-2 py-0.5 border-2 border-[#171717] rounded bg-[#FFD027] text-[#171717]">
                ★ {inspectingReward.rarity}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#171717] flex items-center justify-center text-3xl shrink-0">
                {inspectingReward.sticker}
              </div>
              <div>
                <h3 className="font-arcade text-base text-[#171717] leading-tight">
                  {inspectingReward.title}
                </h3>
                {inspectingReward.tagline && (
                  <p className="font-mono text-[10px] text-[#777] font-bold mt-0.5">
                    {inspectingReward.tagline}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-[#171717] neo-shadow-sm mb-4">
              <p className="font-display text-sm text-[#171717] leading-relaxed">
                {inspectingReward.content}
              </p>
              {inspectingReward.quote && (
                <div className="mt-2.5 pt-2 border-t border-dashed border-[#171717]/30">
                  <p className="font-hand text-lg text-[#FF572E] font-bold">
                    {inspectingReward.quote}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setInspectingReward(null);
              }}
              className="neo-btn bg-[#171717] text-[#F4EBDD] font-arcade text-xs py-3 px-4 rounded-xl"
            >
              CLOSE CARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
