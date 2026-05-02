/**
 * Statistics calculation engine for Full Focus Sprint.
 */

export interface SessionStats {
    fileId: string;
    fileName: string;
    date: number;
    duration: number;
    timePoints: { time: number; wpm: number }[];
    totalWords: number;
    avgWPM: number;
    peakWPM: number;
    speedOverTime: { time: number; wpm: number }[];
    pauseCount: number;
    longestStreak: number;
    paragraphCount: number;
    avgSentenceLength: number;
    paragraphs: string[];
    currentLine: string;
    pendingSentences: string[];
}

export interface WritingState {
    paragraphs: string[];
    currentLine: string;
    pendingSentences: string[];
    cursorPosition: number;
    wordTimestamps: number[];
    sessionStart: number;
    pauses: number[];
    lastKeystroke: number;
}


export function calculateStats(
    finalState: WritingState,
    durationMs: number,
    fileId: string,
    fileName: string,
    pauseCount: number
): SessionStats {
    const allText = [...finalState.paragraphs, ...finalState.pendingSentences, finalState.currentLine].join(' ');
    const words = allText.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const minutes = Math.max(durationMs / 60000, 0.001);
    const avgWPM = Math.round(wordCount / minutes);
    let maxStreak = 0;
    let currentStreak = 0;
    const pauseThreshold = 3000;

    if (finalState.wordTimestamps.length > 1) {
        for (let i = 0; i < finalState.wordTimestamps.length - 1; i++) {
            const diff = finalState.wordTimestamps[i + 1] - finalState.wordTimestamps[i];

            if (diff < pauseThreshold) {
                currentStreak += diff;
            } else {
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }

                currentStreak = 0;
            }
        }
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
    }

    let maxWordStreak = 0;
    let currentWordStreak = 0;

    if (finalState.wordTimestamps.length > 0) {
        currentWordStreak = 1;

        for (let i = 0; i < finalState.wordTimestamps.length - 1; i++) {
            const diff = finalState.wordTimestamps[i + 1] - finalState.wordTimestamps[i];

            if (diff < pauseThreshold) {
                currentWordStreak++;
            } else {
                if (currentWordStreak > maxWordStreak) {
                    maxWordStreak = currentWordStreak;
                }

                currentWordStreak = 1;
            }
        }
        if (currentWordStreak > maxWordStreak) {
            maxWordStreak = currentWordStreak;
        }
    }

    let logicalStreak = maxWordStreak;
    let peakWPM = 0;
    const windowMs = 30000;

    if (finalState.wordTimestamps.length > 0) {
        for (let i = 0; i < finalState.wordTimestamps.length; i++) {
            const start = finalState.wordTimestamps[i];
            let count = 0;

            for (let j = i; j < finalState.wordTimestamps.length; j++) {
                if (finalState.wordTimestamps[j] - start < windowMs) {
                    count++;
                } else {
                    break;
                }
            }
            const currentWPM = (count / (windowMs / 60000));

            if (currentWPM > peakWPM) {
                peakWPM = currentWPM;
            }
        }
    }

    const sentences = allText.split(/[.!?]+(\s|$)/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
    const bucketSize = 10000;
    const buckets = Math.ceil(durationMs / bucketSize);
    const speedOverTime = [];

    for (let i = 0; i < buckets; i++) {
        const bucketStart = finalState.sessionStart + (i * bucketSize);
        const bucketEnd = bucketStart + bucketSize;
        const wordsInBucket = finalState.wordTimestamps.filter(t => t >= bucketStart && t < bucketEnd).length;
        const wpm = (wordsInBucket / (bucketSize / 60000));
        speedOverTime.push({
            time: (i + 1) * 10,
            wpm: Math.round(wpm)
        });
    }

    return {
        fileId,
        fileName,
        date: Date.now(),
        duration: durationMs,
        totalWords: wordCount,
        avgWPM,
        peakWPM: Math.round(peakWPM),
        speedOverTime,
        pauseCount,
        longestStreak: logicalStreak,
        paragraphCount: finalState.paragraphs.length + (finalState.currentLine.trim() ? 1 : 0),
        avgSentenceLength,
        paragraphs: finalState.paragraphs,
        currentLine: finalState.currentLine,
        pendingSentences: finalState.pendingSentences,
        timePoints: speedOverTime
    };
}
