import React, { useState } from 'react';
import { sound } from '../services/soundService';
import { Volume2, VolumeX, Sparkles, BookOpen, Settings } from 'lucide-react';

interface HeaderProps {
  currentTab: 'arcade' | 'book';
  onTabChange: (tab: 'arcade' | 'book') => void;
  unlockedCount: number;
  totalCount: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  unlockedCount,
  totalCount,
  onOpenSettings,
}) => {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="w-full max-w-md mx-auto mb-3 select-none">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between gap-2 px-1 py-1">
        
        {/* Arcade Badge / Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#FF572E] border-2 border-[#171717] flex items-center justify-center text-xs font-arcade text-[#171717] neo-shadow-sm">
            L
          </div>
          <div className="flex flex-col">
            <span className="font-arcade text-xs text-[#171717] tracking-wider leading-none">
              LOOMY'S LOOT
            </span>
            <span className="font-mono text-[9px] text-[#FF572E] font-bold tracking-widest leading-none mt-0.5">
              FOR LEVINA ★ 2026
            </span>
          </div>
        </div>

        {/* Action icons: Audio + Settings */}
        <div className="flex items-center gap-1.5">
          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            className={`neo-btn p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1 ${
              muted ? 'bg-[#FAF4EB] text-[#888]' : 'bg-[#00C974] text-[#171717]'
            }`}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle sound effects"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-[#888]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#171717]" />
            )}
            <span className="text-[10px] hidden sm:inline">
              {muted ? 'MUTED' : 'AUDIO'}
            </span>
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="neo-btn bg-[#FAF4EB] hover:bg-white text-[#171717] p-2 rounded-xl"
            title="Arcade Settings & Sync"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => {
            sound.playClick();
            onTabChange('arcade');
          }}
          className={`neo-btn py-2.5 px-3 rounded-xl font-arcade text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
            currentTab === 'arcade'
              ? 'bg-[#FF572E] text-[#171717] neo-shadow'
              : 'bg-[#FAF4EB] text-[#555] opacity-80'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#171717]" />
          <span>CLAW MACHINE</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onTabChange('book');
          }}
          className={`neo-btn py-2.5 px-3 rounded-xl font-arcade text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
            currentTab === 'book'
              ? 'bg-[#315BFF] text-white neo-shadow'
              : 'bg-[#FAF4EB] text-[#555] opacity-80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            LOOT BOOK ({unlockedCount}/{totalCount})
          </span>
        </button>
      </div>
    </header>
  );
};
