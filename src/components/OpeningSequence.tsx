import React, { useState, useEffect } from 'react';
import { INTRO_LINES } from '../data/defaultConfig';
import { sound } from '../services/soundService';
import { Sparkles, ArrowRight, RotateCw, Heart } from 'lucide-react';

interface OpeningSequenceProps {
  onStartGame: () => void;
  personalNote: string;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onStartGame, personalNote }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showTicket, setShowTicket] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Cycle through intro lines
  useEffect(() => {
    if (showTicket) return;

    if (currentLineIndex < INTRO_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
      }, 2400);
      return () => clearTimeout(timer);
    } else {
      const ticketTimer = setTimeout(() => {
        setShowTicket(true);
      }, 400);
      return () => clearTimeout(ticketTimer);
    }
  }, [currentLineIndex, showTicket]);

  const handleFlip = () => {
    sound.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleSkip = () => {
    sound.playClick();
    setShowTicket(true);
  };

  const handlePlayClick = () => {
    sound.playCoin();
    onStartGame();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden animate-shifting-gradient select-none">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />

      {/* Top small badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-[#171717] text-[#F4EBDD] border-2 border-[#171717] rounded-full text-xs font-mono tracking-widest neo-shadow-sm z-20">
        <span className="w-2 h-2 rounded-full bg-[#FF572E] animate-ping" />
        LOOMY'S LUCKY LOOT • B-DAY EDITION
      </div>

      {/* Skip button if in intro sequence */}
      {!showTicket && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-6 z-30 px-3 py-1.5 bg-[#F4EBDD]/90 hover:bg-[#F4EBDD] text-[#171717] border-2 border-[#171717] neo-shadow-sm rounded text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
        >
          Skip Intro →
        </button>
      )}

      {/* Phase 1: Sequential Intro Text */}
      {!showTicket && (
        <div className="relative z-10 max-w-md w-full px-6 text-center">
          {INTRO_LINES.map((line, idx) => {
            const isVisible = idx === currentLineIndex;
            return (
              <div
                key={idx}
                className={`transition-all duration-1000 transform ${
                  isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-4 scale-95 pointer-events-none hidden'
                }`}
              >
                <div className="inline-block bg-[#171717] text-[#F4EBDD] px-4 py-3 neo-border neo-shadow-lg rounded-lg">
                  <p className="font-display font-black text-lg sm:text-xl md:text-2xl tracking-wide uppercase leading-snug">
                    {line}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 2: Scrapbook Vintage Theater Ticket */}
      {showTicket && (
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
          <div className="mb-3 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD027] text-[#171717] border-2 border-[#171717] neo-shadow-sm text-xs font-mono font-black uppercase tracking-wider rounded">
              <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
              SPECIAL ADMISSION PASS
            </span>
          </div>

          <div className="perspective-1000 w-full cursor-pointer" onClick={handleFlip}>
            <div
              className={`relative w-full transition-transform duration-700 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ minHeight: '450px' }}
            >
              {/* === TICKET FRONT === */}
              <div
                className={`absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-[#801B1B] via-[#611313] to-[#400B0B] text-[#F4EBDD] neo-border neo-shadow-lg rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="absolute -top-3 left-6 w-16 h-6 bg-[#FFD027]/85 border border-[#171717] -rotate-6 z-20 shadow-xs" />
                <div className="absolute -top-3 right-6 w-14 h-6 bg-[#00C974]/80 border border-[#171717] rotate-6 z-20 shadow-xs" />

                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#171717] border-2 border-[#171717]" />
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#171717] border-2 border-[#171717]" />

                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 border-t-2 border-dashed border-[#F4EBDD]/40 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-[#F4EBDD]/30 pb-2 mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#FFD027] font-bold">
                      ★ ADMIT ONE ★
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#F4EBDD]/70">
                      NO. 001 — BIRTHDAY EDITION
                    </span>
                  </div>

                  <h1 className="font-arcade text-2xl tracking-wider text-[#FF572E] drop-shadow-[2px_2px_0_#171717] leading-none mb-1">
                    LOOMY'S
                  </h1>
                  <h2 className="font-arcade text-3xl tracking-wider text-[#FFD027] drop-shadow-[2px_2px_0_#171717] leading-none mb-2">
                    LUCKY LOOT
                  </h2>
                  <div className="inline-block bg-[#171717] text-[#00C974] px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-widest border border-[#00C974]">
                    OFFICIAL LIFETIME PASS
                  </div>
                </div>

                <div className="relative z-10 my-auto py-2">
                  <div className="bg-[#171717]/40 border border-[#F4EBDD]/30 rounded-lg p-3 backdrop-blur-xs space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#F4EBDD]/70">ISSUED TO:</span>
                      <span className="font-bold text-[#FFD027] text-sm">LEVINA</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#F4EBDD]/70">ACCESS:</span>
                      <span className="font-bold text-[#00C974]">UNLIMITED CLAW</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#F4EBDD]/70">VALID UNTIL:</span>
                      <span className="font-bold text-[#F4EBDD]">FOREVER</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFD027] animate-pulse">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>TAP TO FLIP ↺</span>
                  </div>
                  <div className="px-2 py-1 bg-[#FF572E] text-[#171717] text-[10px] font-mono font-black border border-[#171717] rounded shadow-xs">
                    VERIFIED TICKET
                  </div>
                </div>
              </div>

              {/* === TICKET BACK === */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-[#FAF4EB] text-[#171717] neo-border neo-shadow-lg rounded-2xl p-6 flex flex-col justify-between overflow-hidden bg-dot-paper transition-opacity duration-300 ${
                  isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#FF4F87]/80 border border-[#171717] rotate-1 z-20 flex items-center justify-center">
                  <span className="text-[10px] font-mono font-black tracking-widest text-white uppercase">
                    NOTE FOR LEVI
                  </span>
                </div>

                <div className="relative z-10 pt-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between border-b-2 border-[#171717] pb-1.5 mb-2">
                    <span className="font-mono text-xs font-bold text-[#FF572E] uppercase">
                      FROM: LOOMY
                    </span>
                    <span className="font-mono text-xs text-[#171717]/60 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#FF4F87] fill-[#FF4F87]" /> SPECIAL NOTE
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-52 pr-1">
                    <p className="font-hand text-xl md:text-2xl text-[#171717] leading-relaxed whitespace-pre-line font-bold">
                      {personalNote}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t-2 border-[#171717]" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={handlePlayClick}
                    className="w-full neo-btn bg-[#FF572E] hover:bg-[#ff4514] text-[#171717] font-arcade text-lg tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform shadow-md cursor-pointer"
                  >
                    <span>LET'S PLAY!</span>
                    <ArrowRight className="w-5 h-5 text-[#171717]" />
                  </button>
                  <p className="text-center font-mono text-[10px] text-[#171717]/70 mt-1.5 font-bold uppercase tracking-wider">
                    CLICK TO ENTER ARCADE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick direct play option & flip hint */}
          <div className="mt-3 flex flex-col items-center gap-2">
            <button
              onClick={handleFlip}
              className="font-mono text-xs text-[#171717] font-bold bg-[#FFD027] hover:bg-[#ffc70f] px-3.5 py-1.5 rounded-lg border-2 border-[#171717] neo-shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Lihat Depan Tiket' : 'Balik Tiket (Baca Note)'}</span>
            </button>
            
            {!isFlipped && (
              <button
                onClick={handlePlayClick}
                className="font-mono text-[11px] text-[#171717]/80 hover:text-[#171717] underline font-bold cursor-pointer"
              >
                Langsung main tanpa balik tiket →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
