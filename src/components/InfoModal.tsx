import React, { useState } from 'react';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../lib/supabase';
import { storage } from '../services/storageService';
import { sound } from '../services/soundService';
import { Check, Database, RefreshCw, X, ShieldCheck, Globe } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
  playerToken: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
  playerToken,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('loomy_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('loomy_supabase_anon_key') || ''
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    updateSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    sound.playClick();
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    storage.resetProgress();
    onResetProgress();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF4EB] border-3 border-[#171717] neo-shadow-lg rounded-3xl p-6 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#171717] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="font-arcade text-base text-[#171717]">
              ARCADE SETTINGS & SYNC
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center neo-btn p-1"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Section 1: GitHub Pages & Persistence Status */}
        <div className="p-3 bg-white border-2 border-[#171717] neo-shadow-sm rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Globe className="w-4 h-4 text-[#171717]" />
            <span className="font-mono text-xs font-black uppercase text-[#171717]">
              GitHub Pages Static Mode
            </span>
            <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00C974]/20 text-[#008F52] border border-[#00C974]">
              ACTIVE ✓
            </span>
          </div>
          <p className="font-display text-xs text-[#555] leading-relaxed">
            Progress is automatically saved to your browser under player token:
          </p>
          <div className="mt-1 px-2 py-1 bg-[#F4EBDD] border border-[#171717] rounded text-xs font-mono font-bold text-[#FF572E] break-all">
            {playerToken}
          </div>
        </div>

        {/* Section 2: Optional Supabase Cloud Sync */}
        <div className="p-3 bg-white border-2 border-[#171717] neo-shadow-sm rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Database className="w-4 h-4 text-[#315BFF]" />
            <span className="font-mono text-xs font-black uppercase text-[#171717]">
              Optional Supabase Cloud Sync
            </span>
            <span
              className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSupabaseConfigured()
                  ? 'bg-[#00C974]/20 text-[#008F52] border border-[#00C974]'
                  : 'bg-[#FFD027]/20 text-[#B88700] border border-[#FFD027]'
              }`}
            >
              {isSupabaseConfigured() ? 'CONNECTED' : 'STANDALONE (LOCAL)'}
            </span>
          </div>
          <p className="font-display text-[11px] text-[#666] mb-2 leading-relaxed">
            By default, the arcade works 100% offline and statically on GitHub Pages. To link with a Supabase PostgreSQL instance, paste your project URL and Anon Key below (database schema is ready in <code className="bg-[#eee] px-1 rounded">supabase/schema.sql</code>).
          </p>

          <form onSubmit={handleSaveCredentials} className="space-y-2">
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#777] uppercase">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-[#FAF4EB] border-2 border-[#171717] rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-[#777] uppercase">
                Supabase Anon Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-[#FAF4EB] border-2 border-[#171717] rounded-lg focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="neo-btn bg-[#315BFF] text-white text-xs font-mono font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 w-full"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>SAVED SUCCESSFULLY!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SAVE SUPABASE CONFIG</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Section 3: Replay / Reset Progress */}
        <div className="pt-2 border-t-2 border-[#171717] flex items-center justify-between">
          <span className="font-mono text-xs text-[#777]">Re-experience arcade:</span>
          <button
            onClick={handleReset}
            className={`neo-btn text-xs font-mono font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
              confirmReset ? 'bg-red-500 text-white animate-pulse' : 'bg-[#FAF4EB] text-red-600'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{confirmReset ? 'SURE? CLICK TO CONFIRM' : 'RESET PROGRESS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
