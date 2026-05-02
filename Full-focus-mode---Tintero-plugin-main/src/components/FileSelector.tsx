import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

interface FileSelectorProps {
    onSelect: (fileId: string, fileName: string) => void;
}

export function FileSelector({ onSelect }: FileSelectorProps) {
    const [files, setFiles] = useState<TinteroSDK.FileMetadata[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                if (typeof window.tintero !== 'undefined') {
                    const allFiles = await window.tintero.project.getFiles();

                    setFiles(allFiles);
                } else {
                    console.warn('Tintero SDK not found, using mock data');
                    setFiles([
                        { id: '1', name: 'Chapter 1.md', location: 'c1', createdAt: 0, lastModified: 0 },
                        { id: '2', name: 'Chapter 2.md', location: 'c2', createdAt: 0, lastModified: 0 }
                    ]);
                }
            } catch (e) {
                console.error('Failed to load files', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="p-4 text-center opacity-50">Loading files...</div>;

    return (
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto border border-[var(--border-dim)] rounded p-2 bg-[var(--bg-tertiary)]/20">
            {files.map(file => (
                <button
                    key={file.id}
                    onClick={() => onSelect(file.id, file.name)}
                    className="flex items-center gap-3 p-3 text-left hover:bg-[var(--bg-tertiary)] rounded transition-colors group"
                >
                    <FileText className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-main)] group-hover:text-white">{file.name}</span>
                </button>
            ))}
            {files.length === 0 && (
                <div className="text-center p-4 text-[var(--text-dim)] text-sm">No files found.</div>
            )}
        </div>
    );
}
