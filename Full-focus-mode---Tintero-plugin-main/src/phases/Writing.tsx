import { useEffect, useState, useRef } from 'react';
import type { WritingSession } from '../engine/session';
import { calculateStats, type SessionStats } from '../engine/stats';
import { MinimalHUD } from '../components/MinimalHUD';
import { WritingCanvas } from '../components/WritingCanvas';
import { useKeyCapture } from '../hooks/useKeyCapture';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { MotivationalQuotes } from '../components/MotivationalQuotes';
import { useSettings } from '../hooks/useSettings';
import { StopCircle } from 'lucide-react';

interface WritingProps {
    session: WritingSession;
    onEnd: (stats: SessionStats) => void;
}

const NO_OP = () => { };

export function Writing({ session, onEnd }: WritingProps) {
    const { settings } = useSettings();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const { state, inputProps } = useKeyCapture({
        isActive: !isFinished,
        backspaceMode: 'disabled',
        onUpdate: NO_OP,
        onActivity: NO_OP
    });

    useEffect(() => {
        const handleDocKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                finishSprintRef.current();
            }
        };
        document.addEventListener('keydown', handleDocKeyDown);

        return () => document.removeEventListener('keydown', handleDocKeyDown);
    }, []);


    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (session.durationTarget > 0) {
            interval = setInterval(() => {
                const now = Date.now();
                const elapsed = now - session.startTime;
                setElapsedTime(elapsed);

                if (session.durationTarget > 0 && elapsed >= session.durationTarget) {
                    finishSprint();
                }
            }, 100);
        } else {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - session.startTime);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [session, isFinished]);

    const finishSprintRef = useRef<() => void>(NO_OP);

    const finishSprint = async () => {
        if (isFinished) {
            return;
        }

        setIsFinished(true);

        if (window.tintero) {
            if (typeof window.tintero.ui.isFullscreen === 'function') {
                try {
                    const isFull = await window.tintero.ui.isFullscreen();

                    if (isFull) {
                        await window.tintero.ui.toggleFullscreen();
                    }
                } catch (e) {
                    console.warn('Error checking fullscreen:', e);
                }
            }

            await window.tintero.ui.showSidebar();
        }

        const stats = calculateStats(
            state,
            elapsedTime,
            session.fileId,
            session.fileName,
            state.pauses.length
        );

        onEnd(stats);
    };

    useEffect(() => {
        finishSprintRef.current = finishSprint;
    });

    const minutes = Math.max(elapsedTime / 60000, 0.1);
    const isPaused = (Date.now() - state.lastKeystroke) > 3000;
    const wpm = Math.round((state.paragraphs.length * 15 + state.currentLine.length / 5) / minutes);

    return (
        <div className="relative w-full h-[100dvh] flex flex-col cursor-none overflow-hidden">
            {/* Invisible Input for Mobile Keyboard */}
            <textarea {...inputProps} autoFocus />

            {/* Background */}
            {settings.showBackground && <ConstellationBackground />}

            {/* Top Stop Button (Visible on hover or always? User said "add button". Let's make it subtle but accessible) */}
            <div className="absolute top-4 w-full flex justify-center z-50 pointer-events-auto cursor-pointer">
                <button
                    onClick={finishSprint}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400/50 hover:text-red-400 border border-red-500/10 rounded-full transition-all text-sm uppercase tracking-widest backdrop-blur-sm"
                >
                    <StopCircle className="w-4 h-4" /> Stop Session
                </button>
            </div>

            {/* Quotes Overlay */}
            {settings.showQuotes && (
                <MotivationalQuotes wpm={wpm} isPaused={isPaused} />
            )}

            {/* Canvas */}
            <WritingCanvas
                writingState={state}
            />

            {/* HUD */}
            {settings.showTimer && (
                <MinimalHUD
                    wordCount={state.paragraphs.join(' ').length + state.currentLine.length}
                    timeLeft={session.durationTarget > 0 ? Math.max(0, session.durationTarget - elapsedTime) : elapsedTime}
                    isInfinite={session.durationTarget === 0}
                />
            )}
        </div>
    );
}
