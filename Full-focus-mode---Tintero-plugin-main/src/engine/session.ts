export type SprintPhase = 'setup' | 'countdown' | 'writing' | 'results' | 'history';

export interface WritingSession {
    id: string;
    fileId: string;
    fileName: string;
    durationTarget: number;
    mode: 'append' | 'new';
    startTime: number;
}
