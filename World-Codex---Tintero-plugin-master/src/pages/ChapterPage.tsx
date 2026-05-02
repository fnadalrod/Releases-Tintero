import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useTintero } from '../sdk/sdk-context.tsx';
import { useEffect, useState, type MouseEvent } from 'react';

export default function ChapterPage() {
    const { id } = useParams<{ id: string }>();
    const project = useProject();
    const tintero = useTintero();
    const navigate = useNavigate();

    const [file, setFile] = useState<any>(null);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChapter() {
            if (!id) {
                return;
            }

            setLoading(true);

            try {
                const allFiles = await project.getFiles();
                const fileData = allFiles.find((f: any) => f.id === id);
                setFile(fileData);

                const content = await project.getFileContent(id);

                if (content) {
                    const html = await tintero.convert.toHtml(content);
                    const processedHtml = await processDocumentLinks(html, project);

                    setHtmlContent(processedHtml);
                }
            } catch (err) {
                console.error('Failed to load chapter:', err);
            } finally {
                setLoading(false);
            }
        }

        loadChapter();
    }, [id, project, tintero]);

    const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const link = target.closest('.doc-link') as HTMLElement;

        if (link) {
            e.preventDefault();
            const type = link.dataset.linkType;
            const id = link.dataset.id;

            if (type && id) {
                navigate(`/${type}/${id}`);
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading chapter</div>;
    }

    if (!file) {
        return <div className="error">Chapter not found</div>;
    }

    return (
        <div className="wiki-page">
            <header className="entity-header">
                <div>
                    <h1 className="entity-title">
                        {file.name}
                        {file.title && file.title !== file.name && (
                            <span style={{
                                display: 'block',
                                fontSize: '1.2rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 400,
                                marginTop: '8px'
                            }}>
                                {file.title}
                            </span>
                        )}
                    </h1>
                </div>
            </header>

            <div className="card" style={{ padding: '32px' }}>
                <div
                    className="chapter-content"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    onClick={handleContentClick}
                />
            </div>

            {/* Documentation section */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                    Related Content
                </h3>
                <DocumentationLinks fileId={id!} />
            </div>
        </div>
    );
}

async function processDocumentLinks(html: string, project: any): Promise<string> {
    const [characters, worldbuilding] = await Promise.all([
        project.getCharacters(),
        project.getWorldbuilding(),
    ]);

    let processedHtml = html;

    for (const char of characters) {
        const names = [char.name, ...(char.aka || [])].filter(Boolean);

        for (const name of names) {
            if (name.length < 3) continue;

            const regex = new RegExp(`\\b(${escapeRegex(name)})\\b`, 'gi');
            processedHtml = processedHtml.replace(regex, (match) => {
                return `<a href="#" data-link-type="character" data-id="${char.id}" class="doc-link" style="color: var(--accent-primary); text-decoration: none; font-weight: 500; border-bottom: 1px dotted var(--accent-primary);"><span style="margin-right: 4px">👤</span>${match}</a>`;
            });
        }
    }

    for (const wb of worldbuilding) {
        if (wb.name.length < 3) {
            continue;
        }

        const regex = new RegExp(`\\b(${escapeRegex(wb.name)})\\b`, 'gi');

        processedHtml = processedHtml.replace(regex, (match) => {
            return `<a href="#" data-link-type="worldbuilding" data-id="${wb.id}" class="doc-link" style="color: var(--accent-secondary); text-decoration: none; font-weight: 500; border-bottom: 1px dotted var(--accent-secondary);"><span style="margin-right: 4px">🌍</span>${match}</a>`;
        });
    }

    return processedHtml;
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function DocumentationLinks({ fileId }: { fileId: string }) {
    const project = useProject();
    const [relatedChars, setRelatedChars] = useState<any[]>([]);
    const [relatedWb, setRelatedWb] = useState<any[]>([]);

    useEffect(() => {
        async function findRelated() {
            try {
                const [content, characters, worldbuilding] = await Promise.all([
                    project.getFileContent(fileId),
                    project.getCharacters(),
                    project.getWorldbuilding(),
                ]);

                if (!content) return;

                const text = JSON.stringify(content).toLowerCase();

                const mentioned = characters.filter((char: any) => {
                    const names = [char.name, ...(char.aka || [])].filter(Boolean);
                    return names.some(name => text.includes(name.toLowerCase()));
                });

                setRelatedChars(mentioned.slice(0, 5));

                const mentionedWb = worldbuilding.filter((wb: any) =>
                    text.includes(wb.name.toLowerCase())
                );

                setRelatedWb(mentionedWb.slice(0, 5));
            } catch (err) {
                console.error('Failed to find related items:', err);
            }
        }

        findRelated();
    }, [fileId, project]);

    if (relatedChars.length === 0 && relatedWb.length === 0) {
        return <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No related content found</div>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {relatedChars.map((char: any) => (
                <Link
                    key={char.id}
                    to={`/character/${char.id}`}
                    className="tag"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                    }}
                >
                    <span>👤</span>
                    {char.name}
                </Link>
            ))}
            {relatedWb.map((wb: any) => (
                <Link
                    key={wb.id}
                    to={`/worldbuilding/${wb.id}`}
                    className="tag"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                    }}
                >
                    <span>🌍</span>
                    {wb.name}
                </Link>
            ))}
        </div>
    );
}
