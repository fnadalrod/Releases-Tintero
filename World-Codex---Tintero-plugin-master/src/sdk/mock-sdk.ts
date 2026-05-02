// Mock SDK implementation for development
// Simulates the Tintero SDK API with data from mock-data/ directory

import projectData from '../../mock-data/project.json';
import charactersData from '../../mock-data/characters.json';
import worldbuildingData from '../../mock-data/worldbuilding.json';
import filesData from '../../mock-data/files.json';

// Simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple event emitter
class EventEmitter {
    private handlers: Map<string, Set<Function>> = new Map();

    on(event: string, handler: Function) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    off(event: string, handler: Function) {
        this.handlers.get(event)?.delete(handler);
    }

    emit(event: string, data?: any) {
        this.handlers.get(event)?.forEach(handler => handler(data));
    }
}

/**
 * Creates a mock Tintero SDK for development
 */
export function createMockSDK() {
    const events = new EventEmitter();
    const storageData: Map<string, any> = new Map();

    // Mock project API
    const project = {
        async getMetadata() {
            await delay(50);
            return projectData;
        },

        async getCharacters() {
            await delay(100);
            return charactersData;
        },

        async getCharacterById(id: string) {
            await delay(50);
            return charactersData.find(c => c.id === id) || null;
        },

        async getWorldbuilding() {
            await delay(100);
            return worldbuildingData;
        },

        async getWorldbuildingByType(type: string) {
            await delay(50);
            return worldbuildingData.filter(w => w.type === type);
        },

        async getFiles() {
            await delay(100);
            return filesData.map(f => {
                const { content, ...metadata } = f;
                return metadata;
            });
        },

        async getFileContent(fileId: string) {
            await delay(150);
            const file = filesData.find(f => f.id === fileId);
            if (!file?.content) return null;

            // Convert HTML string to ProseMirror document structure
            const htmlContent = file.content;
            const doc = await convert.fromHtml(htmlContent);
            return doc;
        },

        async getDocs() {
            await delay(100);
            // Return docs (notes) from files.json where location is /notes
            return filesData.filter(f => f.location === '/notes').map(f => {
                const { content, ...metadata } = f;
                return metadata;
            });
        },

        async getDocContent(docId: string) {
            await delay(150);
            const doc = filesData.find(f => f.id === docId && f.location === '/notes');
            if (!doc?.content) return null;

            // Convert HTML to ProseMirror doc
            const htmlContent = doc.content;
            const pmDoc = await convert.fromHtml(htmlContent);
            return pmDoc;
        },

        async getNotes() {
            await delay(50);
            return [];
        },

        async getPlotGrids() {
            await delay(50);
            return [];
        },

        async getCardboards() {
            await delay(50);
            return [];
        },

        async getCollections() {
            await delay(50);
            return [];
        },

        async getTags() {
            await delay(50);
            return ['fantasy', 'epic', 'adventure'];
        },

        async getImages() {
            await delay(50);
            return [];
        },

        async getImageData(imageRef: string) {
            await delay(80);
            // Return placeholder avatar images based on character/worldbuilding
            const avatarMap: Record<string, string> = {
                // Characters
                'char-1': 'https://i.pravatar.cc/150?img=12', // Aragorn
                'char-2': 'https://i.pravatar.cc/150?img=47', // Gandalf
                'char-3': 'https://i.pravatar.cc/150?img=48', // Arwen
                // Worldbuilding - Factions
                'wb-1': 'https://i.pravatar.cc/150?img=33', // Fellowship
                // Worldbuilding - Locations
                'wb-2': 'https://i.pravatar.cc/150?img=68', // Mordor
                'wb-3': 'https://i.pravatar.cc/150?img=59', // Rivendell
                // Worldbuilding - Items
                'wb-4': 'https://i.pravatar.cc/150?img=70', // The One Ring
            };

            return avatarMap[imageRef] || null;
        },

        async updateCharacter(id: string, data: any) {
            await delay(100);
            console.log('[Mock SDK] updateCharacter:', id, data);
        },

        async addCharacter(data: any) {
            await delay(100);
            console.log('[Mock SDK] addCharacter:', data);
            return { id: 'new-char', ...data };
        },

        async addWorldbuildingElement(data: any) {
            await delay(100);
            console.log('[Mock SDK] addWorldbuildingElement:', data);
            return { id: 'new-wb', ...data };
        },

        async updateWorldbuildingElement(id: string, data: any) {
            await delay(100);
            console.log('[Mock SDK] updateWorldbuildingElement:', id, data);
        },

        async removeWorldbuildingElement(id: string) {
            await delay(100);
            console.log('[Mock SDK] removeWorldbuildingElement:', id);
        },

        async updateFileContent(fileId: string, _htmlContent: string) {
            await delay(150);
            console.log('[Mock SDK] updateFileContent:', fileId);
        },

        async updateDocContent(docId: string, _htmlContent: string) {
            await delay(150);
            console.log('[Mock SDK] updateDocContent:', docId);
        },

        async addFile(data: any) {
            await delay(100);
            console.log('[Mock SDK] addFile:', data);
            return { id: 'new-file', ...data };
        },

        async updateFileMeta(id: string, data: any) {
            await delay(100);
            console.log('[Mock SDK] updateFileMeta:', id, data);
        },

        async addDoc(data: any) {
            await delay(100);
            console.log('[Mock SDK] addDoc:', data);
            return { id: 'new-doc', ...data };
        },

        async updateDocMeta(id: string, data: any) {
            await delay(100);
            console.log('[Mock SDK] updateDocMeta:', id, data);
        },

        async addNote(data: any) {
            await delay(100);
            console.log('[Mock SDK] addNote:', data);
            return { id: 'new-note', ...data };
        },

        async updateTags(tags: string[]) {
            await delay(100);
            console.log('[Mock SDK] updateTags:', tags);
        },

        async getFolders() {
            await delay(50);
            return [
                { id: 'folder-1', title: 'Manuscript', treePath: 'Manuscript' },
                { id: 'folder-2', title: 'Notes', treePath: 'Notes' },
            ];
        },
    };

    // Mock storage API (uses localStorage in development)
    const storage = {
        async get(key: string) {
            await delay(20);
            if (storageData.has(key)) {
                return storageData.get(key);
            }
            // Try localStorage as fallback
            const stored = localStorage.getItem(`tintero-mock-${key}`);
            return stored ? JSON.parse(stored) : null;
        },

        async set(key: string, value: any) {
            await delay(20);
            storageData.set(key, value);
            localStorage.setItem(`tintero-mock-${key}`, JSON.stringify(value));
        },

        async remove(key: string) {
            await delay(20);
            storageData.delete(key);
            localStorage.removeItem(`tintero-mock-${key}`);
        },

        async getAll() {
            await delay(30);
            const all: any = {};
            storageData.forEach((value, key) => {
                all[key] = value;
            });
            return all;
        },
    };

    // Mock UI API
    const ui = {
        async showNotification(message: string, type: string = 'info', _duration: number = 3000) {
            await delay(10);
            console.log(`[Mock Notification ${type.toUpperCase()}]:`, message);
            // Could show a toast in the UI here
        },

        async render(html: string) {
            await delay(10);
            console.log('[Mock SDK] render:', html.substring(0, 100));
        },

        async openDialog(options: any) {
            await delay(10);
            console.log('[Mock SDK] openDialog:', options);
        },

        async closeDialog() {
            await delay(10);
            console.log('[Mock SDK] closeDialog');
        },
    };

    // Mock convert API
    const convert = {
        async fromHtml(html: string) {
            await delay(50);

            // Simple HTML to ProseMirror conversion
            // Split by paragraph tags and create text nodes
            const paragraphs = html.split(/<\/p>/gi).filter(p => p.trim());

            const content = paragraphs.map(p => {
                // Remove opening <p> tag and any other tags
                const text = p.replace(/<p[^>]*>/gi, '').replace(/<[^>]*>/g, '').trim();

                if (!text) return null;

                return {
                    type: 'paragraph',
                    content: [{ type: 'text', text }]
                };
            }).filter(Boolean);

            return {
                type: 'doc',
                content: content.length > 0 ? content : [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: html.replace(/<[^>]*>/g, '') }]
                    }
                ]
            };
        },

        async toText(doc: any) {
            await delay(50);
            // Extract text from ProseMirror doc
            if (typeof doc === 'string') {
                return doc.replace(/<[^>]*>/g, '');
            }
            return JSON.stringify(doc);
        },

        async toHtml(doc: any) {
            await delay(50);

            // Simple ProseMirror to HTML conversion
            function nodeToHtml(node: any): string {
                if (node.text) {
                    let text = node.text;
                    if (node.marks) {
                        for (const mark of node.marks) {
                            if (mark.type === 'strong') text = `<strong>${text}</strong>`;
                            if (mark.type === 'em') text = `<em>${text}</em>`;
                            if (mark.type === 'underline') text = `<u>${text}</u>`;
                        }
                    }
                    return text;
                }

                if (!node.content) return '';

                const content = node.content.map(nodeToHtml).join('');

                switch (node.type) {
                    case 'paragraph':
                        return `<p>${content}</p>`;
                    case 'heading':
                        const level = node.attrs?.level || 1;
                        return `<h${level}>${content}</h${level}>`;
                    case 'blockquote':
                        return `<blockquote>${content}</blockquote>`;
                    case 'bulletList':
                        return `<ul>${content}</ul>`;
                    case 'orderedList':
                        return `<ol>${content}</ol>`;
                    case 'listItem':
                        return `<li>${content}</li>`;
                    case 'doc':
                        return content;
                    default:
                        return content;
                }
            }

            return nodeToHtml(doc);
        },
    };

    // Mock app API
    const app = {
        async getSettings() {
            await delay(30);
            return {
                generalSettings: {
                    languageIsoCode: 'en',
                    selectedTheme: 'dark',
                },
            };
        },

        async getSettingsField(_field: string) {
            await delay(20);
            return 'en';
        },
    };

    // Mock settings API
    const settings = {
        async get() {
            await delay(20);
            return {};
        },

        async getField(_field: string) {
            await delay(20);
            return null;
        },
    };

    return {
        project,
        storage,
        ui,
        convert,
        app,
        settings,
        events: {
            on: events.on.bind(events),
            off: events.off.bind(events),
            emit: events.emit.bind(events),
        },
    };
}
