/**
 * Converts plain text lines into ProseMirror-compatible HTML.
 * Used when saving sprint content to Tintero documents.
 */

// Basic HTML escaping to prevent XSS and broken markup
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Converts an array of paragraph strings into a single HTML string
 * where each paragraph is wrapped in <p> tags.
 *
 * @param paragraphs Completed paragraphs
 * @param pendingSentences Sentences waiting to be merged into the current paragraph
 * @param currentLine The currently active line (optional)
 * @returns ProseMirror-compatible HTML string
 */
export function sprintTextToHtml(paragraphs: string[], currentLine: string = '', pendingSentences: string[] = []): string {
    const allParagraphs = [...paragraphs];

    const currentBuffer = [...pendingSentences];

    if (currentLine.trim()) {
        currentBuffer.push(currentLine);
    }

    if (currentBuffer.length > 0) {
        allParagraphs.push(currentBuffer.join(' '));
    }

    return allParagraphs
        .filter(p => p.trim().length > 0)
        .map(p => `<p>${escapeHtml(p)}</p>`)
        .join('');
}
