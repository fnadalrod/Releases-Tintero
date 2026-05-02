import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QUOTES, QuoteCategory } from '../engine/quotes';

interface MotivationalQuotesProps {
    wpm: number;
    isPaused: boolean;
}

export function MotivationalQuotes({ wpm, isPaused }: MotivationalQuotesProps) {
    const [currentQuote, setCurrentQuote] = useState<{ text: string, x: number, y: number } | null>(null);
    const wpmRef = useRef(wpm);
    const isPausedRef = useRef(isPaused);

    useEffect(() => {
        wpmRef.current = wpm;
        isPausedRef.current = isPaused;
    }, [wpm, isPaused]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.3) {
                return;
            }

            const currentWpm = wpmRef.current;
            const currentIsPaused = isPausedRef.current;

            let category: QuoteCategory = QuoteCategory.RANDOM;

            if (currentIsPaused || currentWpm < 10) {
                category = QuoteCategory.SLOW;
            } else if (currentWpm > 40) {
                category = QuoteCategory.FAST;
            }

            const availableQuotes = QUOTES.filter(q => q.categories.includes(category) || q.categories.includes(QuoteCategory.RANDOM));

            if (availableQuotes.length === 0) {
                return;
            }

            const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];

            let x = Math.random() * 80 + 10;
            let y = Math.random() * 80 + 10;

            if (x > 30 && x < 70) {
                x = x < 50 ? 20 : 80;
            }

            if (y > 40 && y < 60) {
                y = y < 50 ? 20 : 80;
            }

            setCurrentQuote({ text: randomQuote.text, x, y });

            setTimeout(() => setCurrentQuote(null), 4000);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
            <AnimatePresence>
                {currentQuote && (
                    <motion.div
                        key={currentQuote.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute text-xl font-serif text-[var(--text-muted)]/50 text-center max-w-xs"
                        style={{
                            left: `${currentQuote.x}%`,
                            top: `${currentQuote.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {currentQuote.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
