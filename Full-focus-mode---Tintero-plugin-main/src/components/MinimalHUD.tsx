import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface MinimalHUDProps {
    wordCount: number;
    timeLeft: number;
    isInfinite: boolean;
}

export function MinimalHUD({ wordCount, timeLeft, isInfinite }: MinimalHUDProps) {
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;

        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="fixed bottom-8 right-8 flex flex-col items-end gap-2 text-[var(--text-dim)] font-mono text-xs select-none pointer-events-none"
        >
            <div className="flex gap-4 items-center">
                <span>{wordCount} words</span>
                <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {isInfinite ? formatTime(timeLeft) : formatTime(timeLeft)}
                </span>
            </div>
        </motion.div>
    );
}
