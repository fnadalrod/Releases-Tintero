import { useEffect, useCallback, useState, useRef } from 'react';
import type { WritingState } from '../engine/stats';

interface KeyCaptureProps {
    isActive: boolean;
    backspaceMode: 'within-word' | 'disabled';
    onUpdate: (state: WritingState) => void;
    onActivity: () => void;
}

const initialState: WritingState = {
    paragraphs: [],
    currentLine: '',
    pendingSentences: [],
    cursorPosition: 0,
    wordTimestamps: [],
    sessionStart: Date.now(),
    pauses: [],
    lastKeystroke: Date.now()
};

export function useKeyCapture({ isActive, backspaceMode, onUpdate, onActivity }: KeyCaptureProps) {
    const [state, setState] = useState<WritingState>(initialState);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isActive) {
            setState({
                ...initialState,
                sessionStart: Date.now(),
                lastKeystroke: Date.now()
            });

            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.value = '';
            }
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            if (textareaRef.current && document.activeElement !== textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isActive]);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isActive) return;
        onActivity();

        const now = Date.now();
        const value = e.target.value;

        const newChar = value.slice(-1);

        if (!newChar) {
            return;
        }

        const isSpace = newChar === ' ';
        const isPeriod = newChar === '.';

        let newPauses = [...state.pauses];

        if (now - state.lastKeystroke > 3000) {
            newPauses.push(now);
        }

        setState(prev => {
            const prevTrimmed = prev.currentLine.trimEnd();
            const endsWithPeriod = prevTrimmed.endsWith('.');

            if (endsWithPeriod && !isPeriod && prev.currentLine.trim().length > 0) {
                const newTimestamps = [now];

                return {
                    ...prev,
                    lastKeystroke: now,
                    pauses: newPauses,
                    pendingSentences: [...prev.pendingSentences, prev.currentLine],
                    currentLine: newChar,
                    cursorPosition: 1,
                    wordTimestamps: newTimestamps
                };
            }

            const newLine = prev.currentLine + newChar;
            const newTimestamps = [...prev.wordTimestamps];

            if (isSpace && prev.currentLine.trim().length > 0) {
                newTimestamps.push(now);
            } else if (prev.currentLine.length === 0) {
                newTimestamps.push(now);
            }

            return {
                ...prev,
                lastKeystroke: now,
                pauses: newPauses,
                currentLine: newLine,
                cursorPosition: prev.cursorPosition + 1,
                wordTimestamps: newTimestamps
            };
        });

        e.target.value = '';
    }, [isActive, state, onActivity]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isActive) {
            return;
        }

        onActivity();

        if (e.key === 'Enter') {
            e.preventDefault();
            const now = Date.now();

            setState(prev => {
                const completeParagraph = [...prev.pendingSentences, prev.currentLine]
                    .filter(s => s.trim().length > 0)
                    .join(' ');

                const newTimestamps = [...prev.wordTimestamps];
                if (prev.currentLine.trim().length > 0) {
                    newTimestamps.push(now);
                }

                return {
                    ...prev,
                    lastKeystroke: now,
                    paragraphs: completeParagraph ? [...prev.paragraphs, completeParagraph] : prev.paragraphs,
                    currentLine: '',
                    pendingSentences: [],
                    cursorPosition: 0,
                    wordTimestamps: newTimestamps
                };
            });
            return;
        }

        if (e.key === 'Backspace') {
            setState(prev => {
                if (backspaceMode === 'disabled') return prev;
                if (prev.currentLine.length === 0) return prev;
                if (prev.currentLine.slice(-1) === ' ') return prev; // Don't delete spaces? (Orig logic)

                return {
                    ...prev,
                    currentLine: prev.currentLine.slice(0, -1),
                    cursorPosition: Math.max(0, prev.cursorPosition - 1)
                };
            });
        }

    }, [isActive, backspaceMode, onActivity]);

    useEffect(() => {
        if (isActive) {
            onUpdate(state);
        }
    }, [state, isActive, onUpdate]);

    return {
        state,
        inputProps: {
            ref: textareaRef,
            onChange: handleInput,
            onKeyDown: handleKeyDown,
            autoCapitalize: 'none',
            autoComplete: 'off',
            autoCorrect: 'off',
            spellCheck: false,
            style: {
                position: 'absolute' as const,
                opacity: 0,
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 10,
                cursor: 'text'
            }
        }
    };
}
