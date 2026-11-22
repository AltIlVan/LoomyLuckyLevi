import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CapsuleCategory, Reward } from '../types';
import { sound } from '../services/soundService';
import { storage } from '../services/storageService';
import { ArrowLeft, ArrowRight, Play, Sparkles } from 'lucide-react';

interface ClawMachineProps {
  onRewardUnlocked: (reward: Reward) => void;
  onOpenBook: () => void;
  unlockedCount: number;
  totalRewards: number;
}

interface ChamberCapsule {
  id: number;
  category: CapsuleCategory;
  xPercent: number;
  yPercent: number;
  rotation: number;
  scale: number;
}

const CAPSULE_PALETTE: Record<CapsuleCategory, { top: string; bottom: string; accent: string; label: string }> = {
  blue: { top: '#315BFF', bottom: '#90CAF9', accent: '#EBF0FF', label: 'Cloudy Days' },
  yellow: { top: '#FFD027', bottom: '#FFF59D', accent: '#FFFDE7', label: 'Happy Pills' },
  pink: { top: '#FF4F87', bottom: '#F48FB1', accent: '#FCE4EC', label: 'Sweet Nothings' },
  green: { top: '#00C974', bottom: '#A5D6A7', accent: '#E8F5E9', label: 'Lucky Charms' },
  purple: { top: '#8A3FFC', bottom: '#CE93D8', accent: '#F3E5F5', label: 'Mystery Meat' },
  gold: { top: '#FFB800', bottom: '#FFE082', accent: '#FFF8E1', label: 'Special Drop' },
};

const INITIAL_CAPSULES: ChamberCapsule[] = [
  { id: 1, category: 'gold', xPercent: 48, yPercent: 78, rotation: 12, scale: 1.1 },
  { id: 2, category: 'blue', xPercent: 22, yPercent: 82, rotation: -18, scale: 1.0 },
  { id: 3, category: 'yellow', xPercent: 35, yPercent: 86, rotation: 8, scale: 1.05 },
  { id: 4, category: 'pink', xPercent: 62, yPercent: 84, rotation: -12, scale: 1.0 },
  { id: 5, category: 'green', xPercent: 78, yPercent: 80, rotation: 24, scale: 0.98 },
  { id: 6, category: 'purple', xPercent: 15, yPercent: 76, rotation: -28, scale: 0.95 },
  { id: 7, category: 'pink', xPercent: 30, yPercent: 74, rotation: 15, scale: 1.0 },
  { id: 8, category: 'blue', xPercent: 42, yPercent: 88, rotation: -6, scale: 0.96 },
  { id: 9, category: 'yellow', xPercent: 55, yPercent: 72, rotation: -16, scale: 1.02 },
  { id: 10, category: 'green', xPercent: 70, yPercent: 74, rotation: 10, scale: 1.0 },
  { id: 11, category: 'purple', xPercent: 85, yPercent: 86, rotation: 32, scale: 0.94 },
  { id: 12, category: 'gold', xPercent: 60, yPercent: 88, rotation: -10, scale: 1.08 },
  { id: 13, category: 'blue', xPercent: 18, yPercent: 88, rotation: 14, scale: 0.97 },
  { id: 14, category: 'pink', xPercent: 75, yPercent: 88, rotation: -22, scale: 1.0 },
  { id: 15, category: 'yellow', xPercent: 88, yPercent: 76, rotation: 18, scale: 0.95 },
];

export const ClawMachine: React.FC<ClawMachineProps> = ({
  onRewardUnlocked,
  onOpenBook,
  unlockedCount,
  totalRewards,
}) => {
  const [clawX, setClawX] = useState<number>(50);
  const [clawDepth, setClawDepth] = useState<number>(0);
  const [isProngClosed, setIsProngClosed] = useState<boolean>(false);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const [caughtCapsule, setCaughtCapsule] = useState<CapsuleCategory | null>(null);

  const [dispenserReady, setDispenserReady] = useState<boolean>(false);
  const [dispenserCapsule, setDispenserCapsule] = useState<Reward | null>(null);

  const isAllCollected = unlockedCount >= totalRewards && totalRewards > 0;
  const moveIntervalRef = useRef<number | null>(null);

  const moveClaw = useCallback((delta: number) => {
    if (isGrabbing || dispenserReady) return;
    setClawX((prev) => {
      const next = Math.max(12, Math.min(88, prev + delta));
      if (Math.abs(next - prev) > 0.1) {
        sound.playClawMove();
      }
      return next;
    });
  }, [isGrabbing, dispenserReady]);

  const startMoving = (delta: number) => {
    moveClaw(delta);
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = window.setInterval(() => {
      moveClaw(delta);
    }, 60);
  };

  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGrabbing || dispenserReady) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveClaw(-4);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        moveClaw(4);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerGrab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveClaw, isGrabbing, dispenserReady]);

  const triggerGrab = async () => {
    if (isGrabbing || dispenserReady) return;

    if (isAllCollected) {
      sound.playFanfare('SPECIAL');
      return;
    }

    setIsGrabbing(true);
    sound.playMotor(1.2);

    let closestCapsule = INITIAL_CAPSULES[0];
    let minDiff = 999;
    INITIAL_CAPSULES.forEach((c) => {
      const diff = Math.abs(c.xPercent - clawX);
      if (diff < minDiff) {
        minDiff = diff;
        closestCapsule = c;
      }
    });

    const targetCategory = closestCapsule.category;

    setClawDepth(76);
    await new Promise((r) => setTimeout(r, 900));

    sound.playClawGrab();
    setIsProngClosed(true);
    setCaughtCapsule(targetCategory);
    await new Promise((r) => setTimeout(r, 450));

    sound.playMotor(1.0);
    setClawDepth(0);
    await new Promise((r) => setTimeout(r, 900));

    setClawX(14);
    sound.playMotor(0.6);
    await new Promise((r) => setTimeout(r, 700));

    sound.playClawGrab();
    setIsProngClosed(false);
    setCaughtCapsule(null);
    await new Promise((r) => setTimeout(r, 300));

    sound.playDropChute();

    const claimResult = await storage.claimNextReward(targetCategory);

    if (claimResult.status === 'SUCCESS' && claimResult.reward) {
      setDispenserCapsule(claimResult.reward);
      setDispenserReady(true);
    } else {
      setIsGrabbing(false);
      setClawX(50);
    }

    setIsGrabbing(false);
  };

  const handleOpenDispenser = () => {
    if (!dispenserCapsule) return;
    sound.playCapsulePop();
    const rewardToOpen = dispenserCapsule;
    setDispenserReady(false);
    setDispenserCapsule(null);
    setClawX(50);
    onRewardUnlocked(rewardToOpen);
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      <div className="w-full bg-[#171717] rounded-3xl p-3 sm:p-4 neo-border neo-shadow-lg flex flex-col overflow-hidden relative">
        
        {/* Top Marquee Header */}
        <div className="relative w-full bg-gradient-to-r from-[#FF572E] via-[#FFD027] to-[#FF572E] rounded-2xl p-2.5 sm:p-3 neo-border-sm mb-3 flex items-center justify-between shadow-inner">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#315BFF] border border-[#171717] animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C974] border border-[#171717]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4F87] border border-[#171717]" />
          </div>

          <div className="text-center">
            <h2 className="font-arcade text-lg sm:text-xl text-[#171717] tracking-wider leading-none drop-shadow-[1px_1px_0_#FFF]">
              LOOMY'S LUCKY LOOT
            </h2>
            <p className="font-mono text-[9px] sm:text-[10px] font-black text-[#171717] uppercase tracking-widest mt-0.5">
              100% BIRTHDAY WIN RATE ★ LEVINA
            </p>
          </div>

          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4F87] border border-[#171717]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C974] border border-[#171717]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#315BFF] border border-[#171717] animate-ping" />
          </div>
        </div>

        {/* Acrylic / Glass Capsule Chamber */}
        <div
          className="relative w-full rounded-2xl border-4 border-[#333] overflow-hidden bg-gradient-to-b from-[#1c2438] via-[#10141f] to-[#0a0d14]"
          style={{ height: '340px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-cyan-400/20 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

          {/* Left Side: Prize Drop Chute Funnel */}
          <div className="absolute bottom-0 left-2 w-16 h-36 bg-[#171717]/80 border-2 border-dashed border-[#FF572E]/70 rounded-t-xl flex flex-col items-center justify-start pt-2 z-10">
            <span className="text-[9px] font-mono font-bold text-[#FF572E] tracking-widest uppercase">
              CHUTE
            </span>
            <span className="text-sm mt-1 animate-bounce">↓</span>
          </div>

          {/* Top Claw Rail */}
          <div className="absolute top-1 left-2 right-2 h-4 bg-[#2b2b2b] border border-[#444] rounded flex items-center z-20">
            <div className="w-full h-1 bg-[#111] mx-2" />
          </div>

          {/* Claw Assembly */}
          <div
            className="absolute top-3 transition-all ease-linear z-30"
            style={{
              left: `${clawX}%`,
              transform: 'translateX(-50%)',
              transitionDuration: isGrabbing ? '0.4s' : '0.08s',
            }}
          >
            <div className="w-8 h-3 bg-[#FF572E] border-2 border-[#171717] rounded -mt-1 mx-auto neo-shadow-sm" />
            <div
              className="w-1 bg-[#888] mx-auto border-x border-[#333] transition-all duration-700 ease-in-out"
              style={{
                height: `${24 + clawDepth * 1.8}px`,
              }}
            />

            <div className="relative -mt-1">
              <div className="w-6 h-5 bg-[#FFD027] border-2 border-[#171717] rounded-full mx-auto flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#171717]" />
              </div>

              <div className="relative flex justify-center items-start -mt-1">
                <div
                  className={`w-2.5 h-6 bg-[#E0E0E0] border border-[#171717] rounded-b-full origin-top transition-transform duration-300 ${
                    isProngClosed ? 'rotate-25 translate-x-1' : '-rotate-35 -translate-x-1.5'
                  }`}
                />
                <div
                  className={`w-2.5 h-6 bg-[#E0E0E0] border border-[#171717] rounded-b-full origin-top transition-transform duration-300 ${
                    isProngClosed ? '-rotate-25 -translate-x-1' : 'rotate-35 translate-x-1.5'
                  }`}
                />
              </div>

              {caughtCapsule && (
                <div
                  className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-[#171717] shadow-lg animate-pulse"
                  style={{
                    background: `linear-gradient(135deg, ${CAPSULE_PALETTE[caughtCapsule].top} 0%, ${CAPSULE_PALETTE[caughtCapsule].bottom} 100%)`,
                  }}
                >
                  <div className="w-full h-1 bg-[#171717] mt-4" />
                  <div className="w-3 h-3 rounded-full bg-white/60 absolute top-1.5 left-2" />
                </div>
              )}
            </div>
          </div>

          {/* Capsule Ball Pit Floor */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {INITIAL_CAPSULES.map((cap) => {
              const pal = CAPSULE_PALETTE[cap.category];
              return (
                <div
                  key={cap.id}
                  className="absolute rounded-full border-2 border-[#171717] neo-shadow-sm flex flex-col overflow-hidden"
                  style={{
                    left: `${cap.xPercent}%`,
                    top: `${cap.yPercent}%`,
                    width: '38px',
                    height: '38px',
                    transform: `translate(-50%, -50%) rotate(${cap.rotation}deg) scale(${cap.scale})`,
                    background: `linear-gradient(145deg, ${pal.top} 0%, ${pal.bottom} 100%)`,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white/70 absolute top-1 left-2 pointer-events-none" />
                  <div className="w-full h-1 bg-[#171717] mt-4 opacity-90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40 mx-auto mt-0.5" />
                </div>
              );
            })}
          </div>

          {/* Completion overlay inside chamber if all rewards unlocked */}
          {isAllCollected && (
            <div className="absolute inset-0 bg-[#171717]/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-40">
              <span className="text-4xl mb-2 animate-bounce">👑</span>
              <h3 className="font-arcade text-xl text-[#FFD027] mb-1">
                ALL LOOT COLLECTED!
              </h3>
              <p className="font-mono text-xs text-[#F4EBDD] mb-4">
                Levina has gathered all {totalRewards} birthday treasures!
              </p>
              <button
                onClick={onOpenBook}
                className="neo-btn bg-[#FF572E] text-[#171717] px-4 py-2 font-arcade text-xs rounded-xl"
              >
                BROWSE THE LOOT BOOK 📖
              </button>
            </div>
          )}
        </div>

        {/* Lower Machine Console */}
        <div className="w-full mt-3 bg-[#242424] rounded-2xl p-3 neo-border-sm flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onMouseDown={() => startMoving(-5)}
              onMouseUp={stopMoving}
              onTouchStart={() => startMoving(-5)}
              onTouchEnd={stopMoving}
              disabled={isGrabbing || dispenserReady || isAllCollected}
              className="neo-btn bg-[#315BFF] hover:bg-[#2546c7] disabled:opacity-40 text-white p-3 rounded-xl flex items-center justify-center flex-1"
              aria-label="Move Claw Left"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
            </button>

            <div className="flex-[2] flex flex-col items-center px-1">
              <span className="font-mono text-[9px] text-[#A0A0A0] font-bold uppercase tracking-wider mb-1">
                AIM POSITION ({Math.round(clawX)}%)
              </span>
              <input
                type="range"
                min="12"
                max="88"
                value={clawX}
                onChange={(e) => {
                  if (!isGrabbing && !dispenserReady) {
                    setClawX(Number(e.target.value));
                    sound.playClawMove();
                  }
                }}
                disabled={isGrabbing || dispenserReady || isAllCollected}
                className="w-full accent-[#FF572E] cursor-pointer h-3 rounded-lg bg-[#171717] border border-[#444]"
              />
            </div>

            <button
              onMouseDown={() => startMoving(5)}
              onMouseUp={stopMoving}
              onTouchStart={() => startMoving(5)}
              onTouchEnd={stopMoving}
              disabled={isGrabbing || dispenserReady || isAllCollected}
              className="neo-btn bg-[#315BFF] hover:bg-[#2546c7] disabled:opacity-40 text-white p-3 rounded-xl flex items-center justify-center flex-1"
              aria-label="Move Claw Right"
            >
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Grab Button */}
          <button
            onClick={triggerGrab}
            disabled={isGrabbing || dispenserReady || isAllCollected}
            className={`w-full neo-btn py-3.5 px-4 rounded-xl font-arcade text-lg sm:text-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              isGrabbing
                ? 'bg-amber-500 text-[#171717] animate-pulse cursor-wait'
                : 'bg-[#FF572E] hover:bg-[#ff4314] text-[#171717]'
            } disabled:opacity-50`}
          >
            {isGrabbing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>GRABBING...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>GRAB CAPSULE!</span>
              </>
            )}
          </button>

          {/* Prize Dispenser */}
          <div className="w-full bg-[#171717] border-2 border-[#333] rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#888] font-bold uppercase tracking-wider">
                LOOT DISPENSER HATCH
              </span>
              <span className="font-mono text-xs font-bold text-[#F4EBDD]">
                {dispenserReady ? '🎉 1 CAPSULE READY!' : 'WAITING FOR DROP...'}
              </span>
            </div>

            {dispenserReady ? (
              <button
                onClick={handleOpenDispenser}
                className="neo-btn bg-[#00C974] hover:bg-[#00ad64] text-[#171717] font-arcade text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 animate-bounce shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#171717]" />
                <span>OPEN LOOT!</span>
              </button>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center">
                <span className="font-mono text-xs text-[#555]">🔒</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#A0A0A0]">
              PROGRESS: <strong className="text-[#00C974]">{unlockedCount}</strong> / {totalRewards}
            </span>
          </div>
          <button
            onClick={onOpenBook}
            className="font-mono text-xs font-bold text-[#FFD027] hover:underline flex items-center gap-1"
          >
            <span>THE LOOT BOOK</span>
            <span className="text-[10px] bg-[#333] px-1.5 py-0.5 rounded text-white">📖</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-3 grid grid-cols-3 sm:grid-cols-6 gap-1.5 px-1">
        {(Object.keys(CAPSULE_PALETTE) as CapsuleCategory[]).map((catKey) => {
          const item = CAPSULE_PALETTE[catKey];
          return (
            <div
              key={catKey}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#FAF4EB] border border-[#171717] neo-shadow-sm text-[10px] font-mono font-bold"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-[#171717] shrink-0"
                style={{ backgroundColor: item.top }}
              />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
