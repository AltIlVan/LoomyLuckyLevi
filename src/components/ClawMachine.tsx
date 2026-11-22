import React, { useEffect, useRef, useState, useCallback } from 'react';
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

interface PhysicsBall {
  id: string;
  category: CapsuleCategory;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  radius: number;
  topColor: string;
  bottomColor: string;
}

const CAPSULE_PALETTE: Record<CapsuleCategory, { top: string; bottom: string; accent: string; label: string }> = {
  blue: { top: '#2563EB', bottom: '#93C5FD', accent: '#EFF6FF', label: 'Cloudy Days' },
  yellow: { top: '#EAB308', bottom: '#FEF08A', accent: '#FEFCE8', label: 'Happy Pills' },
  pink: { top: '#EC4899', bottom: '#FBCFE8', accent: '#FDF2F8', label: 'Sweet Nothings' },
  green: { top: '#10B981', bottom: '#A7F3D0', accent: '#ECFDF5', label: 'Lucky Charms' },
  purple: { top: '#8B5CF6', bottom: '#DDD6FE', accent: '#F5F3FF', label: 'Mystery Meat' },
  gold: { top: '#F59E0B', bottom: '#FDE68A', accent: '#FFFBEB', label: 'Special Drop' },
};

export const ClawMachine: React.FC<ClawMachineProps> = ({
  onRewardUnlocked,
  onOpenBook,
  unlockedCount,
  totalRewards,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gantry & Claw Coordinates (0 to 360 width, 0 to 380 height)
  const [clawX, setClawX] = useState<number>(180);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const [dispenserReady, setDispenserReady] = useState<boolean>(false);
  const [dispenserReward, setDispenserReward] = useState<Reward | null>(null);

  // Real pool of remaining physical balls
  const ballsRef = useRef<PhysicsBall[]>([]);
  const [remainingBallsCount, setRemainingBallsCount] = useState<number>(0);

  const clawAnimRef = useRef({
    x: 180,
    cableLength: 25,
    targetCable: 25,
    prongOpen: 0.5, // 0.5 = open, 0.08 = tightly clamped
    carriedBall: null as PhysicsBall | null,
  });

  const isAllCollected = unlockedCount >= totalRewards && totalRewards > 0;

  // Initialize or synchronize physical ball pit based on remaining unclaimed rewards
  useEffect(() => {
    const unclaimed = Math.max(0, totalRewards - unlockedCount);
    setRemainingBallsCount(unclaimed);

    const categoriesPool: CapsuleCategory[] = ['blue', 'yellow', 'pink', 'green', 'purple', 'gold'];
    const newBalls: PhysicsBall[] = [];

    // Seed balls in a settled natural cluster
    const width = 360;
    const height = 380;
    const startX = 85;
    const cols = 7;

    for (let i = 0; i < unclaimed; i++) {
      const cat = categoriesPool[i % categoriesPool.length];
      const pal = CAPSULE_PALETTE[cat];
      const col = i % cols;
      const row = Math.floor(i / cols);

      const radius = 17;
      const bx = startX + col * 34 + (row % 2 === 1 ? 16 : 0) + (Math.random() * 6 - 3);
      const by = height - 35 - row * 30 - (Math.random() * 8);

      newBalls.push({
        id: `ball-${i}-${Date.now()}`,
        category: cat,
        x: Math.min(width - 25, Math.max(75, bx)),
        y: by,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        radius,
        topColor: pal.top,
        bottomColor: pal.bottom,
      });
    }

    ballsRef.current = newBalls;
  }, [unlockedCount, totalRewards]);

  // High-performance Canvas Render & Real Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 360;
    const height = 380;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gravity = 0.35;
    const floorY = height - 16;
    const leftWall = 72; // Left side of pit (chute barrier)
    const rightWall = width - 16;

    const updatePhysics = () => {
      const balls = ballsRef.current;
      const claw = clawAnimRef.current;

      // Update balls motion & collisions
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        // If currently carried by claw
        if (claw.carriedBall && claw.carriedBall.id === b.id) {
          b.x = claw.x;
          b.y = 15 + claw.cableLength + 22;
          b.vx = 0;
          b.vy = 0;
          continue;
        }

        b.vy += gravity;
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.vRot;
        b.vx *= 0.96;
        b.vy *= 0.98;
        b.vRot *= 0.95;

        // Floor collision
        if (b.y + b.radius > floorY) {
          b.y = floorY - b.radius;
          b.vy = -b.vy * 0.3;
          if (Math.abs(b.vy) < 0.2) b.vy = 0;
        }

        // Walls
        if (b.x - b.radius < leftWall) {
          b.x = leftWall + b.radius;
          b.vx = -b.vx * 0.4;
        }
        if (b.x + b.radius > rightWall) {
          b.x = rightWall - b.radius;
          b.vx = -b.vx * 0.4;
        }

        // Ball-to-ball elastic collision
        for (let j = i + 1; j < balls.length; j++) {
          const b2 = balls[j];
          if (claw.carriedBall?.id === b2.id) continue;

          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b.radius + b2.radius;

          if (dist < minDist && dist > 0.001) {
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;

            b.x -= nx * overlap;
            b.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const p = 1.2 * (nx * kx + ny * ky);

            b.vx -= p * nx * 0.5;
            b.vy -= p * ny * 0.5;
            b2.vx += p * nx * 0.5;
            b2.vy += p * ny * 0.5;
          }
        }
      }
    };

    const render = () => {
      updatePhysics();

      // 1. Draw Pit Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Chute hole on bottom-left
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, height - 90, 68, 90);
      ctx.strokeStyle = '#FF572E';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(6, height - 84, 56, 84);
      ctx.setLineDash([]);
      ctx.fillStyle = '#FF572E';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('PRIZE', 18, height - 50);
      ctx.fillText('CHUTE', 18, height - 38);

      // Chute Divider Bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(66, height - 90, 6, 90);

      // 2. Draw Every Real Physical Capsule Ball
      const balls = ballsRef.current;
      for (const b of balls) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);

        const r = b.radius;

        // Subtle floor shadow
        ctx.beginPath();
        ctx.ellipse(0, 3, r * 0.85, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fill();

        // Top Colored Plastic Half
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI, 0, false);
        ctx.fillStyle = b.topColor;
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#171717';
        ctx.stroke();

        // Bottom Clear / Pastel Plastic Half
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI, false);
        ctx.fillStyle = b.bottomColor;
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#171717';
        ctx.stroke();

        // Waist Seam Belt Line
        ctx.beginPath();
        ctx.rect(-r - 0.5, -2, (r * 2) + 1, 4);
        ctx.fillStyle = '#171717';
        ctx.fill();

        // Realistic Gloss Highlight Specular
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.35, r * 0.2, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();

        ctx.restore();
      }

      // 3. Draw Mechanical Claw Assembly
      const claw = clawAnimRef.current;
      const clawHeadY = 15 + claw.cableLength;

      // Top Gantry Rail
      ctx.fillStyle = '#334155';
      ctx.fillRect(10, 6, width - 20, 8);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 6, width - 20, 8);

      // Trolley Motor Cart
      ctx.fillStyle = '#FF572E';
      ctx.fillRect(claw.x - 16, 3, 32, 14);
      ctx.strokeStyle = '#171717';
      ctx.strokeRect(claw.x - 16, 3, 32, 14);

      // Cable Wire
      ctx.beginPath();
      ctx.moveTo(claw.x, 17);
      ctx.lineTo(claw.x, clawHeadY);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Pivot Hub
      ctx.beginPath();
      ctx.arc(claw.x, clawHeadY, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#EAB308';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#171717';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(claw.x, clawHeadY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#171717';
      ctx.fill();

      // Left Articulated Prong
      ctx.save();
      ctx.translate(claw.x - 6, clawHeadY + 4);
      ctx.rotate(-claw.prongOpen);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-7, 24);
      ctx.lineTo(4, 32);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Right Articulated Prong
      ctx.save();
      ctx.translate(claw.x + 6, clawHeadY + 4);
      ctx.rotate(claw.prongOpen);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(7, 24);
      ctx.lineTo(-4, 32);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Glass Reflections
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Move Claw Horizontal
  const moveClaw = useCallback((delta: number) => {
    if (isGrabbing || dispenserReady) return;
    setClawX((prev) => {
      const next = Math.max(90, Math.min(320, prev + delta));
      clawAnimRef.current.x = next;
      if (Math.abs(next - prev) > 0.5) {
        sound.playClawMove();
      }
      return next;
    });
  }, [isGrabbing, dispenserReady]);

  // Real Grab Sequence
  const triggerGrab = async () => {
    if (isGrabbing || dispenserReady || isAllCollected) return;
    const balls = ballsRef.current;
    if (balls.length === 0) return;

    setIsGrabbing(true);
    sound.playMotor(1.4);

    const claw = clawAnimRef.current;

    // 1. Identify actual physical ball closest under the claw
    let targetBall: PhysicsBall | null = null;
    let minDistance = 9999;

    for (const b of balls) {
      const dist = Math.hypot(b.x - claw.x, b.y - 280);
      if (dist < minDistance) {
        minDistance = dist;
        targetBall = b;
      }
    }

    if (!targetBall) {
      setIsGrabbing(false);
      return;
    }

    const caughtBall = targetBall;
    const targetY = Math.min(290, Math.max(140, caughtBall.y - 15));

    // Phase 1: Descent
    const descentStart = performance.now();
    const descentDur = 900;
    while (performance.now() - descentStart < descentDur) {
      const p = (performance.now() - descentStart) / descentDur;
      claw.cableLength = 25 + (targetY - 25) * p;
      claw.prongOpen = 0.5; // open wide
      await new Promise((r) => setTimeout(r, 16));
    }
    claw.cableLength = targetY;

    // Phase 2: Clamp onto that exact ball!
    sound.playClawGrab();
    for (let p = 0.5; p >= 0.08; p -= 0.05) {
      claw.prongOpen = p;
      await new Promise((r) => setTimeout(r, 20));
    }
    claw.carriedBall = caughtBall;

    // Nudge surrounding balls physically away when grabbed
    balls.forEach((other) => {
      if (other.id !== caughtBall.id) {
        const dx = other.x - caughtBall.x;
        const dy = other.y - caughtBall.y;
        const d = Math.hypot(dx, dy);
        if (d < 50 && d > 0.01) {
          other.vx += (dx / d) * 2;
          other.vy -= 1.5;
        }
      }
    });

    await new Promise((r) => setTimeout(r, 250));

    // Phase 3: Ascent with the caught ball
    sound.playMotor(1.1);
    const ascendStart = performance.now();
    const ascendDur = 850;
    while (performance.now() - ascendStart < ascendDur) {
      const p = (performance.now() - ascendStart) / ascendDur;
      claw.cableLength = targetY - (targetY - 25) * p;
      await new Promise((r) => setTimeout(r, 16));
    }
    claw.cableLength = 25;

    // Phase 4: Horizontal Traverse directly over the Chute (x = 35)
    sound.playMotor(0.8);
    const travStart = performance.now();
    const startX = claw.x;
    const travDur = 750;
    while (performance.now() - travStart < travDur) {
      const p = (performance.now() - travStart) / travDur;
      claw.x = startX - (startX - 35) * p;
      setClawX(claw.x);
      await new Promise((r) => setTimeout(r, 16));
    }
    claw.x = 35;
    setClawX(35);

    // Phase 5: Prongs Open & Drop into Prize Chute
    sound.playClawGrab();
    claw.prongOpen = 0.5;
    caughtBall.vx = 0;
    caughtBall.vy = 4;
    claw.carriedBall = null;

    await new Promise((r) => setTimeout(r, 300));
    sound.playDropChute();

    // REMOVE THIS SPECIFIC BALL PERMANENTLY FROM THE PIT!
    ballsRef.current = ballsRef.current.filter((b) => b.id !== caughtBall.id);
    setRemainingBallsCount(ballsRef.current.length);

    // Claim next valid reward matching category
    const claimResult = await storage.claimNextReward(caughtBall.category);
    if (claimResult.status === 'SUCCESS' && claimResult.reward) {
      setDispenserReward(claimResult.reward);
      setDispenserReady(true);
    }

    // Smoothly return claw to center
    await new Promise((r) => setTimeout(r, 350));
    claw.x = 180;
    setClawX(180);
    setIsGrabbing(false);
  };

  const handleOpenDispenser = () => {
    if (!dispenserReward) return;
    sound.playCapsulePop();
    const reward = dispenserReward;
    setDispenserReady(false);
    setDispenserReward(null);
    onRewardUnlocked(reward);
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* Brutalist Arcade Frame */}
      <div className="w-full bg-[#171717] rounded-3xl p-3 sm:p-4 neo-border neo-shadow-lg flex flex-col overflow-hidden relative">
        
        {/* Machine Top Marquee */}
        <div className="relative w-full bg-gradient-to-r from-[#FF572E] via-[#FFD027] to-[#FF572E] rounded-2xl p-2.5 sm:p-3 neo-border-sm mb-3 flex items-center justify-between shadow-inner">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] border border-[#171717] animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#171717]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] border border-[#171717]" />
          </div>

          <div className="text-center">
            <h2 className="font-arcade text-lg sm:text-xl text-[#171717] tracking-wider leading-none drop-shadow-[1px_1px_0_#FFF]">
              LOOMY'S LUCKY LOOT
            </h2>
            <p className="font-mono text-[9px] sm:text-[10px] font-black text-[#171717] uppercase tracking-widest mt-0.5">
              PHYSICS CLAW MACHINE ★ {remainingBallsCount} KAPSUL TERSISA
            </p>
          </div>

          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] border border-[#171717]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#171717]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] border border-[#171717] animate-ping" />
          </div>
        </div>

        {/* Real Physics 2D Canvas */}
        <div
          className="relative w-full rounded-2xl border-4 border-[#334155] overflow-hidden bg-[#0f172a] flex items-center justify-center"
          style={{ height: '380px' }}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* All Collected Overlay */}
          {isAllCollected && (
            <div className="absolute inset-0 bg-[#171717]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-40">
              <span className="text-4xl mb-2 animate-bounce">👑</span>
              <h3 className="font-arcade text-xl text-[#FFD027] mb-1">
                ALL LOOT COLLECTED!
              </h3>
              <p className="font-mono text-xs text-[#F4EBDD] mb-4">
                Semua kapsul sudah berhasil diambil oleh Levina!
              </p>
              <button
                onClick={onOpenBook}
                className="neo-btn bg-[#FF572E] text-[#171717] px-4 py-2 font-arcade text-xs rounded-xl cursor-pointer"
              >
                BUKA THE LOOT BOOK 📖
              </button>
            </div>
          )}
        </div>

        {/* Lower Controls & Dispenser Hatch */}
        <div className="w-full mt-3 bg-[#242424] rounded-2xl p-3 neo-border-sm flex flex-col gap-3">
          
          {/* Row 1: Left / Slider / Right */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => moveClaw(-25)}
              disabled={isGrabbing || dispenserReady || isAllCollected}
              className="neo-btn bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 text-white p-3 rounded-xl flex items-center justify-center flex-1 cursor-pointer"
              aria-label="Move Claw Left"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
            </button>

            <div className="flex-[2] flex flex-col items-center px-1">
              <span className="font-mono text-[9px] text-[#A0A0A0] font-bold uppercase tracking-wider mb-1">
                POSISI CAPIT ({Math.round(clawX)}px)
              </span>
              <input
                type="range"
                min="90"
                max="320"
                value={clawX}
                onChange={(e) => {
                  if (!isGrabbing && !dispenserReady) {
                    const val = Number(e.target.value);
                    setClawX(val);
                    clawAnimRef.current.x = val;
                    sound.playClawMove();
                  }
                }}
                disabled={isGrabbing || dispenserReady || isAllCollected}
                className="w-full accent-[#FF572E] cursor-pointer h-3 rounded-lg bg-[#171717] border border-[#444]"
              />
            </div>

            <button
              onClick={() => moveClaw(25)}
              disabled={isGrabbing || dispenserReady || isAllCollected}
              className="neo-btn bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 text-white p-3 rounded-xl flex items-center justify-center flex-1 cursor-pointer"
              aria-label="Move Claw Right"
            >
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Row 2: Big GRAB Button */}
          <button
            onClick={triggerGrab}
            disabled={isGrabbing || dispenserReady || isAllCollected || remainingBallsCount === 0}
            className={`w-full neo-btn py-3.5 px-4 rounded-xl font-arcade text-lg sm:text-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isGrabbing
                ? 'bg-amber-500 text-[#171717] animate-pulse cursor-wait'
                : 'bg-[#FF572E] hover:bg-[#ff4314] text-[#171717]'
            } disabled:opacity-50`}
          >
            {isGrabbing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>MENGAMBIL KAPSUL...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>AMBIL KAPSUL! ({remainingBallsCount} TERSISA)</span>
              </>
            )}
          </button>

          {/* Row 3: Physical Dispenser Hatch */}
          <div className="w-full bg-[#171717] border-2 border-[#333] rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#888] font-bold uppercase tracking-wider">
                LOOT DISPENSER HATCH
              </span>
              <span className="font-mono text-xs font-bold text-[#F4EBDD]">
                {dispenserReady ? '🎉 1 KAPSUL SIAP DIBUKA!' : 'KAPSUL AKAN JATUH KE SINI...'}
              </span>
            </div>

            {dispenserReady ? (
              <button
                onClick={handleOpenDispenser}
                className="neo-btn bg-[#10B981] hover:bg-[#059669] text-[#171717] font-arcade text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 animate-bounce shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#171717]" />
                <span>BUKA KAPSUL!</span>
              </button>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center">
                <span className="font-mono text-xs text-[#555]">🔒</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-xs text-[#A0A0A0]">
            TERKUMPUL: <strong className="text-[#10B981]">{unlockedCount}</strong> / {totalRewards}
          </span>
          <button
            onClick={onOpenBook}
            className="font-mono text-xs font-bold text-[#FFD027] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>THE LOOT BOOK</span>
            <span className="text-[10px] bg-[#333] px-1.5 py-0.5 rounded text-white">📖</span>
          </button>
        </div>
      </div>
    </div>
  );
};
