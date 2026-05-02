import { useState, useCallback } from 'react';
import type { SprintPhase, WritingSession } from '../engine/session';
import type { SessionStats } from '../engine/stats';

export function useSession() {
    const [phase, setPhase] = useState<SprintPhase>('setup');
    const [session, setSession] = useState<WritingSession | null>(null);
    const [lastStats, setLastStats] = useState<SessionStats | null>(null);

    const startSprint = useCallback((fileId: string, fileName: string, durationTarget: number, mode: 'append' | 'new') => {
        setSession({
            id: crypto.randomUUID(),
            fileId,
            fileName,
            durationTarget,
            mode,
            startTime: Date.now()
        });
        setPhase('countdown');
    }, []);

    const startWriting = useCallback(() => {
        setPhase('writing');
    }, []);

    const endSprint = useCallback((stats: SessionStats) => {
        setLastStats(stats);
        setPhase('results');
    }, []);

    const reset = useCallback(() => {
        setSession(null);
        setLastStats(null);
        setPhase('setup');
    }, []);

    const viewHistory = useCallback(() => {
        setPhase('history');
    }, []);

    return {
        phase,
        session,
        lastStats,
        startSprint,
        startWriting,
        endSprint,
        reset,
        viewHistory,
        setPhase
    };
}
