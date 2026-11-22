import React, { useEffect, useState } from 'react';
import type { Reward } from '../types';
import { CATEGORIES } from '../data/rewardsData';
import { sound } from '../services/soundService';
import confetti from 'canvas-confetti';
import { Sparkles, Check, Bookmark, Star } from 'lucide-react';

interface CapsuleOpeningModalProps {
  reward: Reward;
  onClose: () => void;
  onViewInBook: () => void;
}

export const CapsuleOpeningModal: React.FC<CapsuleOpeningModalProps> = ({
  reward,
  onClose,
  onViewInBook,
}) => {
  const [stage, setStage] = useState<'cracking' | 'revealed'>('cracking');
  const catMeta = CATEGORIES[reward.category];

  useEffect(() => {
    sound.playCapsulePop();

    const timer = setTimeout(() => {
      setStage('revealed');
      sound.playFanfare(reward.rarity);

      try {
        confetti({
          particleCount: reward.rarity === 'SPECIAL' || reward.rarity === 'LEGENDARY' ? 120 : 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF572E', '#315BFF', '#FFD027', '#00C974', '#FF4F87', '#8A3FFC'],
        });
      } catch (e) {
        console.warn('Confetti notice:', e);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [reward]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        
        {/* Stage 1: Capsule Splitting Animation */}
        {stage === 'cracking' && (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <div className="relative w-28 h-28 flex flex-col items-center justify-center">
              {/* Top Half */}
              <div
                className="w-24 h-12 rounded-t-full border-3 border-[#171717] animate-bounce"
                style={{ backgroundColor: catMeta.colorHex }}
              />
              {/* Seam crack spark */}
              <div className="w-28 h-2 bg-white rounded-full neo-shadow-sm my-0.5 animate-ping" />
              {/* Bottom Half */}
              <div className="w-24 h-12 rounded-b-full border-3 border-[#171717] bg-white/90" />
            </div>
            <p className="font-arcade text-lg text-[#FFD027] mt-4 tracking-wider">
              CRACKING OPEN...
            </p>
          </div>
        )}

        {/* Stage 2: Revealed Loot Card */}
        {stage === 'revealed' && (
          <div className="w-full bg-[#FAF4EB] border-3 border-[#171717] neo-shadow-lg rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-400 relative">
            
            {/* Scrapbook washi tape on top */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 border border-[#171717] -rotate-1 z-20 shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: catMeta.colorHex }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="font-mono text-[10px] font-black uppercase text-white tracking-widest">
                NEW LOOT UNLOCKED!
              </span>
            </div>

            {/* Header: Category Badge + Rarity Stamp */}
            <div className="flex items-center justify-between pt-2 mb-3">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold text-white border border-[#171717]"
                style={{ backgroundColor: catMeta.colorHex }}
              >
                {catMeta.name}
              </span>

              <span
                className={`font-mono text-xs font-black uppercase px-2 py-0.5 border-2 border-[#171717] rounded neo-shadow-sm ${
                  reward.rarity === 'SPECIAL'
                    ? 'bg-[#FFD027] text-[#171717]'
                    : reward.rarity === 'LEGENDARY'
                    ? 'bg-[#FF572E] text-white'
                    : reward.rarity === 'RARE'
                    ? 'bg-[#8A3FFC] text-white'
                    : 'bg-[#F4EBDD] text-[#171717]'
                }`}
              >
                ★ {reward.rarity}
              </span>
            </div>

            {/* Title & Big Sticker Symbol */}
            <div className="my-2 flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl border-2 border-[#171717] neo-shadow-sm bg-white flex items-center justify-center text-3xl shrink-0">
                {reward.sticker}
              </div>
              <div className="flex-1">
                <h3 className="font-arcade text-lg sm:text-xl text-[#171717] leading-tight">
                  {reward.title}
                </h3>
                {reward.tagline && (
                  <p className="font-mono text-[11px] text-[#666] font-bold mt-1">
                    {reward.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Personal Heartfelt Content */}
            <div className="my-3 p-4 rounded-xl bg-white border-2 border-[#171717] neo-shadow-sm">
              <p className="font-display text-sm sm:text-base text-[#171717] leading-relaxed font-medium">
                {reward.content}
              </p>
              {reward.quote && (
                <div className="mt-2.5 pt-2 border-t border-dashed border-[#171717]/30">
                  <p className="font-hand text-lg text-[#FF572E] font-bold">
                    {reward.quote}
                  </p>
                </div>
              )}
            </div>

            {/* Special Badge Label if present */}
            {reward.badgeLabel && (
              <div className="mb-3 flex items-center justify-center gap-1.5 py-1 px-3 bg-[#FFD027]/40 border border-[#FFD027] rounded-lg">
                <Star className="w-3.5 h-3.5 text-[#B88700] fill-current" />
                <span className="font-mono text-[11px] font-black text-[#B88700] uppercase tracking-wider">
                  {reward.badgeLabel}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={onClose}
                className="w-full neo-btn bg-[#00C974] hover:bg-[#00b367] text-[#171717] font-arcade text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>SAVE TO LOOT BOOK</span>
              </button>

              <button
                onClick={onViewInBook}
                className="w-full py-2 text-center font-mono text-xs text-[#171717]/80 hover:text-[#171717] font-bold hover:underline flex items-center justify-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>View Full Collection →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
