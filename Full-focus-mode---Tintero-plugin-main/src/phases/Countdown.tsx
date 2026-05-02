import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
    onComplete: () => void;
}

export function Countdown({ onComplete }: CountdownProps) {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (window.tintero) {
            if (typeof window.tintero.ui.isFullscreen === 'function') {
                window.tintero.ui.isFullscreen().then(isFull => {
                    if (!isFull) {
                        window.tintero.ui.toggleFullscreen();
                    }
                });
            } else {
                console.warn('Tintero API: isFullscreen not available, skipping fullscreen toggle.');
            }

            window.tintero.ui.hideSidebar();
        }

        if (count > 0) {
            const timer = setTimeout(() => setCount(c => c - 1), 1000);

            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 1000);

            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            <AnimatePresence mode="wait">
                <motion.div
                    key={count}
                    initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                    transition={{ duration: 0.5 }}
                    className="text-[15vw] font-bold text-[var(--text-main)] font-serif"
                >
                    {count > 0 ? count : "WRITE"}
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-20 text-[var(--text-dim)] text-lg font-light tracking-widest uppercase">
                Take a deep breath
            </div>
        </div>
    );
}
