import { useRef, useEffect, useState } from 'react';
import type { WritingState } from '../engine/stats';
import { motion, AnimatePresence } from 'framer-motion';

interface WritingCanvasProps {
    writingState: WritingState;
}

export function WritingCanvas({ writingState }: WritingCanvasProps) {
    const allItems = [
        ...writingState.paragraphs.map((p, i) => ({ text: p, id: `p-${i}` })),
        ...writingState.pendingSentences.map((p, i) => ({ text: p, id: `s-${i}` }))
    ];

    const visibleItems = allItems.slice(-5);

    const textRef = useRef<HTMLSpanElement>(null);
    const [lineHeight, setLineHeight] = useState(0);
    const [textOffset, setTextOffset] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkPlatform = async () => {
            if (window.tintero && window.tintero.fs) {
                try {
                    const platform = await window.tintero.fs.getPlatform();
                    const p = platform.toLowerCase();

                    console.log('Platform detected: ' + p);
                    setIsMobile(p.includes('android') || p.includes('ios') || p.includes('mobile'));
                } catch (e) {
                    console.warn('Failed to get platform', e);
                }
            }
        };
        checkPlatform();
    }, []);

    useEffect(() => {
        if (!textRef.current) return;

        const el = textRef.current;
        const totalHeight = el.scrollHeight;

        const computed = window.getComputedStyle(el);
        const lh = parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.5;
        setLineHeight(lh);

        if (totalHeight > lh + 4) {
            setTextOffset(totalHeight - lh);
        } else {
            setTextOffset(0);
        }
    }, [writingState.currentLine]);

    const activeLineStyle: React.CSSProperties = isMobile
        ? { top: '25%', transform: 'translateY(-50%)' }
        : { top: '50%', transform: 'translateY(-50%)' };

    const hintStyle: React.CSSProperties = isMobile
        ? { top: '35%', transform: 'translateY(-50%)' }
        : { top: '55%', transform: 'translateY(-50%)' };

    const dynamicMaxHeight = isMobile ? '66.5px' : (lineHeight > 0 ? `${lineHeight + 8}px` : '3em');

    return (
        <div className="relative w-full h-full flex flex-col font-serif overflow-hidden">
            {!isMobile && (
                <div
                    className="last-lines absolute w-full flex flex-col justify-end items-center pointer-events-none select-none px-4 md:px-8"
                    style={{ top: '10%', bottom: '50%' }}
                >
                    <AnimatePresence>
                        {visibleItems.map((item, i) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 0.1 + (i * 0.15),
                                    filter: `blur(${Math.max(0, (visibleItems.length - 1 - i) * 1.5)}px)`,
                                    y: 0
                                }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="text-lg md:text-2xl text-center w-full max-w-2xl mb-3"
                                style={{
                                    color: 'var(--text-muted)'
                                }}
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Active Line — fixed position, typewriter scroll */}
            <div
                className="current-line absolute w-full flex justify-center px-4 md:px-8 z-10 overflow-hidden"
                style={{ ...activeLineStyle, maxHeight: dynamicMaxHeight }}
            >
                <div className="w-full max-w-3xl text-center">
                    <span
                        ref={textRef}
                        className="text-2xl md:text-4xl leading-relaxed text-[var(--text-main)] whitespace-pre-wrap inline-block transition-transform duration-100"
                        style={{ transform: `translateY(-${textOffset}px)` }}
                    >
                        {writingState.currentLine}
                        {/* Custom Cursor */}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-[2px] md:w-[3px] h-[1em] bg-[var(--accent)] align-middle ml-1"
                        />
                    </span>
                </div>
            </div>

            {/* Input hint (optional) */}
            {writingState.currentLine.length === 0 && writingState.paragraphs.length === 0 && writingState.pendingSentences.length === 0 && (
                <div
                    className="absolute w-full text-center text-[var(--text-dim)] text-sm opacity-50"
                    style={hintStyle}
                >
                    Begin typing...
                </div>
            )}
        </div>
    );
}
