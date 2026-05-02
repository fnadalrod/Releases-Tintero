import { useState, useEffect, useCallback } from 'react';
import { useSession } from './hooks/useSession';
import { Setup } from './phases/Setup';
import { Countdown } from './phases/Countdown';
import { Writing } from './phases/Writing';
import { Results } from './phases/Results';
import { History } from './phases/History';
import { History as HistoryIcon } from 'lucide-react';

export default function App() {
  const { phase, session, lastStats, startSprint, startWriting, endSprint, reset, viewHistory } = useSession();
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setHasSeenIntro(true);
  }, []);

  useEffect(() => {
    const handleImmersive = async () => {
      if (!window.tintero) return;

      try {
        if (phase === 'writing') {
          if (window.tintero.ui?.hideSidebar) {
            await window.tintero.ui.hideSidebar();
          }

          if (window.tintero.ui?.isFullscreen && !await window.tintero.ui.isFullscreen()) {

          }
        } else if (phase === 'results' || phase === 'setup') {
          if (window.tintero.ui?.showSidebar) {
            await window.tintero.ui.showSidebar();
          }

          if (window.tintero.ui?.isFullscreen && await window.tintero.ui.isFullscreen()) {
            await window.tintero.ui.toggleFullscreen();
          }
        }
      } catch (e) {
        console.warn('Immersive mode error:', e);
      }
    };

    handleImmersive();
  }, [phase]);

  return (
    <div className="w-full h-full bg-[var(--bg-primary)] text-[var(--text-main)] overflow-hidden overflow-y-auto">
      {phase === 'setup' && (
        <>
          <Setup
            onStart={startSprint}
            hasSeenIntro={hasSeenIntro}
            onIntroComplete={handleIntroComplete}
          />
          <button
            onClick={viewHistory}
            className="fixed bottom-4 left-4 text-white/20 hover:text-white/50 text-xs flex items-center gap-2 transition-colors z-50"
          >
            <HistoryIcon className="w-3 h-3" /> History
          </button>
        </>
      )}

      {phase === 'countdown' && (
        <Countdown onComplete={startWriting} />
      )}

      {phase === 'writing' && session && (
        <Writing
          session={session}
          onEnd={endSprint}
        />
      )}

      {phase === 'results' && session && lastStats && (
        <Results
          session={session}
          stats={lastStats}
          onDiscard={reset}
          onSave={reset}
        />
      )}

      {phase === 'history' && (
        <History onBack={reset} />
      )}
    </div>
  );
}
