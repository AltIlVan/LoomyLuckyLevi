import { useState, useEffect } from 'react';
import { OpeningSequence } from './components/OpeningSequence';
import { ClawMachine } from './components/ClawMachine';
import { CollectionBook } from './components/CollectionBook';
import { CapsuleOpeningModal } from './components/CapsuleOpeningModal';
import { Header } from './components/Header';
import { InfoModal } from './components/InfoModal';
import { DEFAULT_SETTINGS } from './data/defaultConfig';
import { REWARDS } from './data/rewardsData';
import { storage } from './services/storageService';
import type { Reward } from './types';

export function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem('loomy_has_started') === 'true';
  });
  const [currentTab, setCurrentTab] = useState<'arcade' | 'book'>('arcade');
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    return storage.getClaimedRewardIds();
  });
  const [activeRewardModal, setActiveRewardModal] = useState<Reward | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync unlocked list periodically or on claim
  const refreshUnlocked = () => {
    setUnlockedIds(storage.getClaimedRewardIds());
  };

  useEffect(() => {
    refreshUnlocked();
  }, []);

  const handleStartGame = () => {
    setHasStarted(true);
    localStorage.setItem('loomy_has_started', 'true');
  };

  const handleRewardUnlocked = (reward: Reward) => {
    refreshUnlocked();
    setActiveRewardModal(reward);
  };

  const handleReset = () => {
    refreshUnlocked();
    setCurrentTab('arcade');
  };

  // 1. Opening sequence (Animated shifting gradient, fade lines, 3D flip ticket)
  if (!hasStarted) {
    return (
      <OpeningSequence
        onStartGame={handleStartGame}
        personalNote={DEFAULT_SETTINGS.personalNote}
      />
    );
  }

  // 2. Main Arcade Experience
  return (
    <div className="min-h-screen bg-[#F4EBDD] text-[#171717] px-3 py-4 flex flex-col items-center">
      
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        unlockedCount={unlockedIds.length}
        totalCount={REWARDS.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="w-full flex-1 flex flex-col items-center">
        {currentTab === 'arcade' ? (
          <ClawMachine
            onRewardUnlocked={handleRewardUnlocked}
            onOpenBook={() => setCurrentTab('book')}
            unlockedCount={unlockedIds.length}
            totalRewards={REWARDS.length}
          />
        ) : (
          <CollectionBook
            unlockedIds={unlockedIds}
            onBackToArcade={() => setCurrentTab('arcade')}
            onOpenRewardModal={(reward) => setActiveRewardModal(reward)}
          />
        )}
      </main>

      {/* Capsule Opening Celebration Modal */}
      {activeRewardModal && (
        <CapsuleOpeningModal
          reward={activeRewardModal}
          onClose={() => setActiveRewardModal(null)}
          onViewInBook={() => {
            setActiveRewardModal(null);
            setCurrentTab('book');
          }}
        />
      )}

      {/* Settings & Supabase Cloud Sync Modal */}
      <InfoModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetProgress={handleReset}
        playerToken={storage.getPlayerToken()}
      />

      {/* Footer Scrapbook Watermark */}
      <footer className="w-full max-w-md text-center py-4 mt-6 border-t border-[#171717]/15">
        <p className="font-mono text-[10px] text-[#171717]/60 font-bold uppercase tracking-wider">
          LOOMY'S LUCKY LOOT • CRAFTED WITH LOVE FOR LEVINA
        </p>
      </footer>
    </div>
  );
}

export default App;
