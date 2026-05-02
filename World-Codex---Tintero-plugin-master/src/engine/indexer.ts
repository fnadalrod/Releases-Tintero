// Cross-reference indexer
// Scans all files and builds an index of entity mentions

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildEntityLookup(characters: any[], worldbuilding: any[]) {
    const entities: Array<{
        id: string;
        type: string;
        names: string[];
    }> = [];

    for (const char of characters) {
        const names = [
            char.name,
            char.firstName,
            char.lastName,
            ...(char.aka || []),
        ].filter(Boolean);

        if (char.variants) {
            for (const variant of char.variants) {
                if (variant.name) {
                    names.push(variant.name);
                }
            }
        }

        entities.push({
            id: char.id,
            type: 'character',
            names: [...new Set(names)],
        });
    }

    for (const wb of worldbuilding) {
        entities.push({
            id: wb.id,
            type: wb.type,
            names: [wb.name],
        });
    }

    return entities;
}

function htmlToText(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export async function scanFiles(
    files: any[],
    entities: ReturnType<typeof buildEntityLookup>,
    tintero: any
) {
    const mentions = new Map<string, Array<{
        fileId: string;
        fileName: string;
        position: number;
        snippet: string;
    }>>();

    for (const file of files) {
        const html = await tintero.project.getFileContent(file.id);

        if (!html) {
            continue;
        }

        const text = htmlToText(html);

        for (const entity of entities) {
            for (const name of entity.names) {
                if (!name || name.length < 2) {
                    continue;
                }

                const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
                let match;

                while ((match = regex.exec(text)) !== null) {
                    const start = Math.max(0, match.index - 40);
                    const end = Math.min(text.length, match.index + name.length + 40);
                    const snippet = text.slice(start, end);

                    if (!mentions.has(entity.id)) {
                        mentions.set(entity.id, []);
                    }

                    mentions.get(entity.id)!.push({
                        fileId: file.id,
                        fileName: file.name,
                        position: match.index,
                        snippet: `...${snippet}...`,
                    });
                }
            }
        }
    }

    return mentions;
}

export function computeProjectHash(
    characters: any[],
    worldbuilding: any[],
    files: any[]
): string {
    const data = {
        charCount: characters.length,
        wbCount: worldbuilding.length,
        fileCount: files.length,
        charIds: characters.map(c => c.id).sort().join(','),
        fileIds: files.map(f => f.id).sort().join(','),
    };
    return JSON.stringify(data);
}

export async function buildIndex(tintero: any) {
    const [characters, worldbuilding, files] = await Promise.all([
        tintero.project.getCharacters(),
        tintero.project.getWorldbuilding(),
        tintero.project.getFiles(),
    ]);

    const entities = buildEntityLookup(characters, worldbuilding);
    const mentions = await scanFiles(files, entities, tintero);

    const mentionsObj: Record<string, any> = {};
    mentions.forEach((value, key) => {
        mentionsObj[key] = value;
    });

    await tintero.storage.set('crossRefIndex', mentionsObj);
    await tintero.storage.set('indexHash', computeProjectHash(characters, worldbuilding, files));

    return mentionsObj;
}

export async function shouldRebuildIndex(tintero: any): Promise<boolean> {
    const [characters, worldbuilding, files, cachedHash] = await Promise.all([
        tintero.project.getCharacters(),
        tintero.project.getWorldbuilding(),
        tintero.project.getFiles(),
        tintero.storage.get('indexHash'),
    ]);

    const currentHash = computeProjectHash(characters, worldbuilding, files);
    return currentHash !== cachedHash;
}