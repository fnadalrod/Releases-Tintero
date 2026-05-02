import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { SessionStats } from '../engine/stats';

interface HistoryProps {
    onBack: () => void;
}

export function History({ onBack }: HistoryProps) {
    const [history, setHistory] = useState<SessionStats[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        async function load() {
            if (typeof window.tintero !== 'undefined') {
                const data = await window.tintero.storage.get('sprintHistory');

                if (Array.isArray(data)) {
                    const normalized = data.map(item => {
                        if (item.stats && typeof item.stats === 'object' && !item.totalWords) {
                            return { ...item.stats, date: new Date(item.date).getTime() || item.stats.date };
                        }
                        return item;
                    });

                    const sorted = [...normalized].sort((a, b) => b.date - a.date);
                    setHistory(sorted);
                }
            }
        }
        load();
    }, []);

    const formatDateTime = (ts: number) => {
        if (!ts) {
            return 'Unknown Date';
        }

        const date = new Date(ts);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `${dateStr} at ${timeStr}`;
    };

    const getChartData = (session: SessionStats) => {
        if (!session.timePoints || !Array.isArray(session.timePoints) || session.timePoints.length === 0) {
            return [];
        }

        const cutoffTime = Math.max(0, session.duration - 3000);

        return session.timePoints
            .filter(tp => tp.time * 1000 <= cutoffTime)
            .map((tp, i) => ({
                time: i,
                wpm: tp.wpm
            }));
    };

    const formatXAxisLabel = (value: number, session: SessionStats) => {
        const duration = session.duration || 0;
        const durationMinutes = duration / 60000;

        if (durationMinutes < 2) {
            return `${value * 10}s`;
        }

        const minutes = Math.floor((value * 10) / 60);

        return `${minutes}m`;
    };

    const getTextPreview = (session: SessionStats) => {
        const paragraphs = session.paragraphs || [];
        const pendingSentences = session.pendingSentences || [];
        const currentLine = session.currentLine || '';

        const allText = [...paragraphs, ...pendingSentences, currentLine]
            .filter(s => typeof s === 'string' && s.trim().length > 0)
            .join(' ');

        if (!allText) {
            return null;
        }

        return allText;
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="w-full flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h1 className="text-xl font-serif text-[var(--accent)]">SESSION HISTORY</h1>
                <div className="w-16"></div>
            </div>

            <div className="w-full space-y-4">
                {history.map((session, i) => {
                    const isExpanded = expandedIndex === i;
                    const chartData = getChartData(session);
                    const totalWords = session.totalWords || 0;
                    const avgWPM = session.avgWPM || 0;
                    const durationMs = session.duration || 0;
                    const textContent = getTextPreview(session);

                    return (
                        <div key={i} className="bg-[var(--bg-secondary,#111)] border border-[var(--border-dim)] rounded overflow-hidden">
                            {/* Header */}
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                            >
                                <div className="flex-1">
                                    <div className="text-[var(--text-main)] font-semibold flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-[var(--text-dim)]" />
                                        {formatDateTime(session.date)}
                                        <span className="text-[var(--text-dim)] text-xs font-normal ml-2">{session.fileName || 'Untitled'}</span>
                                    </div>
                                    <div className="text-[var(--text-dim)] text-xs mt-1 flex gap-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {Math.floor(durationMs / 60000)}m {Math.floor((durationMs / 1000) % 60)}s
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {avgWPM} WPM
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-[var(--text-main)]">{totalWords}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-dim)]">Words</div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="border-t border-[var(--border-dim)] p-6 space-y-6 bg-[var(--bg-tertiary)]/50">

                                    {/* Chart Section */}
                                    <div className="bg-[var(--bg-secondary,#111)] border border-[var(--border-dim)] p-4 rounded">
                                        {chartData.length > 1 ? (
                                            <div style={{ width: '100%', height: 200 }}>
                                                <ResponsiveContainer>
                                                    <LineChart data={chartData}>
                                                        <XAxis
                                                            dataKey="time"
                                                            tick={{ fill: 'var(--text-dim)', fontSize: 10 }}
                                                            tickFormatter={(value) => formatXAxisLabel(value, session)}
                                                        />
                                                        <YAxis
                                                            tick={{ fill: 'var(--text-dim)', fontSize: 10 }}
                                                            domain={['auto', 'auto']}
                                                            width={30}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-dim)' }}
                                                            itemStyle={{ color: 'var(--accent)' }}
                                                            labelFormatter={(value) => `Time: ${formatXAxisLabel(value as number, session)}`}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="wpm"
                                                            stroke="var(--accent)"
                                                            strokeWidth={2}
                                                            dot={false}
                                                            activeDot={{ r: 4, fill: '#fff' }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <div className="h-[200px] flex flex-col items-center justify-center text-[var(--text-dim)]">
                                                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                                <span className="text-sm">Chart data not available for this session</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="bg-[var(--bg-secondary,#111)] border border-[var(--border-dim)] p-4 rounded">
                                        <div className="flex items-center gap-2 mb-3 text-[var(--text-dim)] text-xs uppercase tracking-wider font-bold border-b border-[var(--border-dim)] pb-2">
                                            <FileText className="w-3 h-3" />
                                            Written Content
                                        </div>
                                        <div className="text-[#e6d7c2] text-sm font-serif leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-2">
                                            {textContent ? (
                                                textContent
                                            ) : (
                                                <span className="text-white/20 italic">No text content saved.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {history.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-dim)]">
                        No sessions recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}
