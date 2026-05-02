import { useState, useEffect } from 'react';
import { FileSelector } from '../components/FileSelector';
import { Clock, FileText, ChevronRight, Plus, Quote, LayoutTemplate, Timer } from 'lucide-react';


import { ConstellationBackground } from '../components/ConstellationBackground';
import { useSettings } from '../hooks/useSettings';

interface SetupProps {
    onStart: (fileId: string, fileName: string, duration: number, mode: 'append' | 'new') => void;
    hasSeenIntro: boolean;
    onIntroComplete: () => void;
}

const PHRASES = [
    "Full focus.",
    "No distraction.",
    "No turning back.",
    "Write until the timer stops."
];

export function Setup({ onStart, hasSeenIntro, onIntroComplete }: SetupProps) {
    const [selectedFile, setSelectedFile] = useState<{ id: string, name: string } | null>(null);
    const [duration, setDuration] = useState<number>(10 * 60 * 1000);
    const [isCustomDuration, setIsCustomDuration] = useState(false);
    const [customHours, setCustomHours] = useState("");
    const [customMinutes, setCustomMinutes] = useState("");
    const [customSeconds, setCustomSeconds] = useState("");

    const updateCustomDuration = (h: string, m: string, s: string) => {
        const hours = parseInt(h) || 0;
        const minutes = parseInt(m) || 0;
        const seconds = parseInt(s) || 0;
        const totalMs = ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
        setDuration(totalMs);
    };

    const { settings, updateSetting } = useSettings();
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(-1);
    const [showIntro, setShowIntro] = useState(!hasSeenIntro);
    const [newFileName, setNewFileName] = useState("");
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    useEffect(() => {
        if (!showIntro) {
            return;
        }

        if (hasSeenIntro) {
            setShowIntro(false);

            return;
        }

        let isMounted = true;

        const runSequence = async () => {
            await new Promise(r => setTimeout(r, 500));

            if (!isMounted) {
                return;
            }

            setCurrentPhraseIndex(0);

            for (let i = 0; i < PHRASES.length; i++) {
                await new Promise(r => setTimeout(r, 1500));

                if (!isMounted) {
                    return;
                }

                if (i < PHRASES.length - 1) {
                    const next = i + 1;
                    setCurrentPhraseIndex(next);
                }
            }

            await new Promise(r => setTimeout(r, 1000));

            if (!isMounted) {
                return;
            }

            setShowIntro(false);
            onIntroComplete();
        };

        runSequence();

        return () => {
            isMounted = false;
        };
    }, []);



    const handleStart = async () => {
        if (isCreatingNew) {
            if (!newFileName.trim()) return;
            onStart("NEW_FILE_PENDING", newFileName, duration, 'new');
        } else if (selectedFile) {
            onStart(selectedFile.id, selectedFile.name, duration, 'append');
        }
    };

    if (showIntro) {
        return (
            <div
                className="relative flex flex-col items-center justify-center min-h-screen bg-black text-center cursor-pointer overflow-hidden"
                onClick={() => {
                    console.log('[Setup] Intro skipped by user');
                    setShowIntro(false);
                    onIntroComplete();
                }}
            >
                <ConstellationBackground />
                <div className="relative z-10 h-24 flex items-center justify-center">
                    {currentPhraseIndex >= 0 && currentPhraseIndex < PHRASES.length && (
                        <h1
                            key={currentPhraseIndex}
                            className="text-3xl md:text-5xl font-serif text-[var(--text-main)] tracking-wider break-words whitespace-normal text-center px-4 leading-tight"
                        >
                            {PHRASES[currentPhraseIndex]}
                        </h1>
                    )}
                </div>
                <div className="absolute bottom-8 text-white/20 text-xs animate-pulse">
                    Click to skip
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 text-center max-w-2xl mx-auto relative z-10"
        >
            {settings.showBackground && <ConstellationBackground />}

            <h1 className="text-3xl md:text-5xl font-serif mb-4 tracking-wide text-[var(--accent)] uppercase relative z-10 drop-shadow-lg">Full Focus Mode</h1>

            <div className="w-full bg-[var(--bg-secondary)]/80 border border-[var(--border-dim)] rounded-none p-4 md:p-8 mb-8 text-left shadow-2xl backdrop-blur-md relative z-10">
                {/* File Selection */}
                <div className="mb-8 border-b border-[var(--border-dim)] pb-8">
                    <div className="flex justify-between items-center mb-4">
                        <label className="flex items-center gap-3 text-xs text-[var(--text-dim)] uppercase tracking-[0.2em] font-bold">
                            <FileText className="w-3 h-3" /> Select Target File
                        </label>
                        <button
                            onClick={() => setIsCreatingNew(!isCreatingNew)}
                            className="text-xs text-[var(--accent)] hover:text-white uppercase tracking-wider flex items-center gap-1"
                        >
                            {isCreatingNew ? "Select Existing" : <> <Plus className="w-3 h-3" /> Create New</>}
                        </button>
                    </div>

                    {isCreatingNew ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                placeholder="Enter file name..."
                                className="w-full bg-black/50 border border-[var(--border-dim)] p-4 text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent)] transition-colors"
                            />
                        </div>
                    ) : (
                        <>
                            <FileSelector onSelect={(id, name) => setSelectedFile({ id, name })} />
                            {selectedFile && (
                                <div className="mt-3 text-sm text-[var(--accent)] font-mono">
                                    &gt; {selectedFile?.name || 'Unknown'} SELECTED
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Duration */}
                <div className="mb-8 border-b border-[var(--border-dim)] pb-8">
                    <label className="flex items-center gap-3 text-xs text-[var(--text-dim)] mb-4 uppercase tracking-[0.2em] font-bold">
                        <Clock className="w-3 h-3" /> Duration
                    </label>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                        {[
                            { label: '5m', value: 5 * 60 * 1000 },
                            { label: '10m', value: 10 * 60 * 1000 },
                            { label: '30m', value: 30 * 60 * 1000 },
                            { label: '1h', value: 60 * 60 * 1000 },
                            { label: '2h', value: 120 * 60 * 1000 },
                            { label: '∞', value: 0 },
                        ].map(d => (
                            <button
                                key={d.label}
                                onClick={() => {
                                    setDuration(d.value);
                                    setIsCustomDuration(false);
                                }}
                                className={`py-3 text-xs font-mono transition-all border ${!isCustomDuration && duration === d.value
                                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                    : 'bg-transparent text-[var(--text-dim)] border-[var(--border-dim)] hover:border-[var(--text-muted)] hover:text-[var(--text-main)]'
                                    }`}
                            >
                                {d.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustomDuration(true)}
                            className={`py-3 text-xs font-mono transition-all border col-span-2 md:col-span-2 ${isCustomDuration
                                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                : 'bg-transparent text-[var(--text-dim)] border-[var(--border-dim)] hover:border-[var(--text-muted)] hover:text-[var(--text-main)]'
                                }`}
                        >
                            Custom
                        </button>
                    </div>

                    {isCustomDuration && (
                        <div className="flex gap-4 justify-center items-center bg-black/20 p-4 border border-[var(--border-dim)] animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col items-center">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="00"
                                    value={customHours}
                                    onChange={(e) => {
                                        setCustomHours(e.target.value);
                                        updateCustomDuration(e.target.value, customMinutes, customSeconds);
                                    }}
                                    className="w-12 text-center bg-transparent border-b border-[var(--text-dim)] text-[var(--text-main)] focus:border-[var(--accent)] outline-none text-xl font-mono"
                                />
                                <span className="text-[10px] text-[var(--text-dim)] uppercase mt-1">Hrs</span>
                            </div>
                            <span className="text-[var(--text-dim)]">:</span>
                            <div className="flex flex-col items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    placeholder="00"
                                    value={customMinutes}
                                    onChange={(e) => {
                                        setCustomMinutes(e.target.value);
                                        updateCustomDuration(customHours, e.target.value, customSeconds);
                                    }}
                                    className="w-12 text-center bg-transparent border-b border-[var(--text-dim)] text-[var(--text-main)] focus:border-[var(--accent)] outline-none text-xl font-mono"
                                />
                                <span className="text-[10px] text-[var(--text-dim)] uppercase mt-1">Min</span>
                            </div>
                            <span className="text-[var(--text-dim)]">:</span>
                            <div className="flex flex-col items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    placeholder="00"
                                    value={customSeconds}
                                    onChange={(e) => {
                                        setCustomSeconds(e.target.value);
                                        updateCustomDuration(customHours, customMinutes, e.target.value);
                                    }}
                                    className="w-12 text-center bg-transparent border-b border-[var(--text-dim)] text-[var(--text-main)] focus:border-[var(--accent)] outline-none text-xl font-mono"
                                />
                                <span className="text-[10px] text-[var(--text-dim)] uppercase mt-1">Sec</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings (Moved inside) */}
                <div className="mb-8">
                    <label className="flex items-center gap-3 text-xs text-[var(--text-dim)] mb-4 uppercase tracking-[0.2em] font-bold">
                        <LayoutTemplate className="w-3 h-3" /> Preference
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className={`flex items-center justify-center p-3 border cursor-pointer transition-all gap-2 text-xs uppercase tracking-wider ${settings.showBackground ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-main)]' : 'border-[var(--border-dim)] text-[var(--text-dim)]'}`}>
                            <input
                                type="checkbox"
                                checked={settings.showBackground}
                                onChange={(e) => updateSetting('showBackground', e.target.checked)}
                                className="hidden"
                            />
                            <div className={`w-2 h-2 rounded-full ${settings.showBackground ? 'bg-[var(--accent)]' : 'bg-[var(--text-dim)]'}`} />
                            Stars
                        </label>

                        <label className={`flex items-center justify-center p-3 border cursor-pointer transition-all gap-2 text-xs uppercase tracking-wider ${settings.showQuotes ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-main)]' : 'border-[var(--border-dim)] text-[var(--text-dim)]'}`}>
                            <input
                                type="checkbox"
                                checked={settings.showQuotes}
                                onChange={(e) => updateSetting('showQuotes', e.target.checked)}
                                className="hidden"
                            />
                            <Quote className="w-3 h-3" /> Quotes
                        </label>

                        <label className={`flex items-center justify-center p-3 border cursor-pointer transition-all gap-2 text-xs uppercase tracking-wider ${settings.showTimer ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-main)]' : 'border-[var(--border-dim)] text-[var(--text-dim)]'}`}>
                            <input
                                type="checkbox"
                                checked={settings.showTimer}
                                onChange={(e) => updateSetting('showTimer', e.target.checked)}
                                className="hidden"
                            />
                            <Timer className="w-3 h-3" /> Timer
                        </label>
                    </div>
                </div>

                <button
                    disabled={(!selectedFile && !isCreatingNew) || (isCreatingNew && !newFileName.trim())}
                    onClick={handleStart}
                    className="group w-full py-5 bg-[var(--text-main)] text-black font-bold uppercase tracking-[0.2em] hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4"
                >
                    Begin Session
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
