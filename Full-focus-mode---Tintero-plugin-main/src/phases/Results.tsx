import { useState } from 'react';
import type { WritingSession } from '../engine/session';
import type { SessionStats } from '../engine/stats';
import { sprintTextToHtml } from '../engine/html-generator';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import { Save, Trash2, AlertTriangle } from 'lucide-react';

interface ResultsProps {
    session: WritingSession;
    stats: SessionStats;
    onDiscard: () => void;
    onSave: () => void;
}

export function Results({ session, stats, onDiscard, onSave }: ResultsProps) {
    const [isSaving, setIsSaving] = useState(false);
    const historyEntry = stats;

    const handleSave = async () => {
        setIsSaving(true);

        const htmlContent = sprintTextToHtml(stats.paragraphs, stats.currentLine, stats.pendingSentences);
        let history = [];

        try {
            if (window.tintero) {
                const stored = await window.tintero.storage.get('sprintHistory');

                if (stored && Array.isArray(stored)) {
                    history = stored;
                }
            }
        } catch (e) {
            console.warn('Results: Failed to load history', e);
        }

        if (window.tintero) {
            try {
                if (session.fileId === "NEW_FILE_PENDING") {
                    await window.tintero.ui.showNotification('Creating new file...', 'info');

                    const json = await window.tintero.convert.fromHtml(htmlContent);
                    const jsonString = JSON.stringify(json);

                    await window.tintero.project.addFile({
                        name: session.fileName,
                        content: jsonString,
                        writingMode: 'prose'
                    });

                    await window.tintero.ui.showNotification('File created successfully!', 'success');
                } else {
                    await window.tintero.ui.showNotification('Saving to file...', 'info');
                    let existingContentString = await window.tintero.project.getFileContent(session.fileId);

                    let existingHtml = '';

                    if (existingContentString && existingContentString.trim().startsWith('{')) {
                        try {
                            const jsonContent = JSON.parse(existingContentString);
                            existingHtml = await window.tintero.convert.toHtml(jsonContent);
                        } catch (e) {
                            existingHtml = existingContentString;
                        }
                    } else {
                        existingHtml = existingContentString || '';
                    }

                    const combinedHtml = existingHtml + htmlContent;
                    const validJson = await window.tintero.convert.fromHtml(combinedHtml);
                    const finalContent = JSON.stringify(validJson);

                    await window.tintero.project.updateFileContent(session.fileId, finalContent);
                    await window.tintero.ui.showNotification('Sprint saved successfully!', 'success');
                }

                const newHistory = [...history, historyEntry];
                await window.tintero.storage.set('sprintHistory', newHistory);
            } catch (err) {
                console.error("Save failed:", err);
                await window.tintero.ui.showNotification('Failed to save sprint', 'error');
                setIsSaving(false);

                return;
            }
        } else {

        }

        onSave();
    };

    const chartData = stats.timePoints.map((tp, i) => ({
        time: i,
        wpm: tp.wpm
    }));

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center max-w-4xl mx-auto"
        >
            <h2 className="text-4xl font-serif mb-2 text-[var(--accent-color,#c98a48)] uppercase tracking-widest">Session Complete</h2>
            <div className="text-white/40 mb-12 font-mono text-sm uppercase tracking-wider">
                {session.fileName} • {Math.floor(stats.duration / 1000 / 60)}m {Math.floor((stats.duration / 1000) % 60)}s
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-dim)] p-6 flex flex-col items-center">
                    <span className="text-5xl font-bold text-[var(--text-main)] mb-2">{stats.totalWords}</span>
                    <span className="text-xs uppercase tracking-widest text-[var(--text-dim)]">Words Written</span>
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-dim)] p-6 flex flex-col items-center">
                    <span className="text-5xl font-bold text-[var(--accent)] mb-2">{Math.round(stats.avgWPM)}</span>
                    <span className="text-xs uppercase tracking-widest text-[var(--text-dim)]">Avg WPM</span>
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-dim)] p-6 flex flex-col items-center">
                    <span className="text-5xl font-bold text-[var(--text-main)] mb-2">{stats.longestStreak}</span>
                    <span className="text-xs uppercase tracking-widest text-[var(--text-dim)]">Best Streak</span>
                </div>
            </div>

            {/* WPM Graph */}
            <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border-dim)] p-4 mb-8 flex justify-center overflow-hidden">
                <LineChart width={600} height={300} data={chartData}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-dim)' }}
                        itemStyle={{ color: 'var(--accent)' }}
                        labelStyle={{ display: 'none' }}
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
            </div>

            {/* Written Text Preview */}
            <div className="w-full max-w-3xl mb-8 text-left">
                <h3 className="text-xs uppercase tracking-widest text-[var(--text-dim)] mb-4 font-bold border-b border-[var(--border-dim)] pb-2">Session Content</h3>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-dim)] p-6 h-64 overflow-y-auto font-serif text-[#e6d7c2] text-lg leading-relaxed whitespace-pre-wrap select-text">
                    {(stats.paragraphs.length === 0 && stats.pendingSentences.length === 0 && !stats.currentLine) ? (
                        <p className="text-[var(--text-dim)] italic text-center text-sm py-10">No text written in this session.</p>
                    ) : (
                        <>
                            {stats.paragraphs.map((p, i) => (
                                <p key={i} className="mb-4">{p}</p>
                            ))}
                            {stats.pendingSentences.length > 0 && (
                                <p className="mb-4">{stats.pendingSentences.join(' ')}{stats.currentLine ? ' ' + stats.currentLine : ''}</p>
                            )}
                            {stats.pendingSentences.length === 0 && stats.currentLine && (
                                <p>{stats.currentLine}</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex gap-4 w-full max-w-md">
                <button
                    onClick={onDiscard}
                    disabled={isSaving}
                    className="flex-1 py-4 border border-[var(--border-dim)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
                >
                    <Trash2 className="w-4 h-4" /> Discard
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-4 bg-[var(--accent)] text-white hover:bg-[var(--text-main)] hover:text-black uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save to File</>}
                </button>
            </div>

            {session.fileId === "NEW_FILE_PENDING" && (
                <div className="mt-4 text-xs text-[var(--accent-color,#c98a48)] flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    New file "{session.fileName}" will be created.
                </div>
            )}
        </div>
    );
}
