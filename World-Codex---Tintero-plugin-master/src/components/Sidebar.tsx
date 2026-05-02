import { Link, useLocation } from 'react-router-dom';
import { useCharacters, useWorldbuilding, useFiles, useDocs, useProjectMetadata } from '../sdk/use-tintero';
import { useTintero } from '../sdk/sdk-context';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const location = useLocation();
    const { characters, loading: charsLoading } = useCharacters();
    const { worldbuilding, loading: wbLoading } = useWorldbuilding();
    const { files, loading: filesLoading } = useFiles();
    const { docs, loading: docsLoading } = useDocs();
    const { metadata } = useProjectMetadata();
    const tintero = useTintero();

    const [charAvatars, setCharAvatars] = useState<Record<string, string>>({});
    const [wbAvatars, setWbAvatars] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadCharacterAvatars() {
            const avatarMap: Record<string, string> = {};
            for (const char of characters) {
                if (char.avatar) {
                    try {
                        const imageData = await tintero.project.getImageData(char.avatar);
                        if (imageData) {
                            avatarMap[char.id] = imageData;
                        }
                    } catch (err) {
                        console.error(`Failed to load avatar for ${char.name}:`, err);
                    }
                }
            }

            setCharAvatars(avatarMap);
        }

        if (characters.length > 0) {
            loadCharacterAvatars();
        }
    }, [characters, tintero]);

    useEffect(() => {
        async function loadWbAvatars() {
            const avatarMap: Record<string, string> = {};

            for (const wb of worldbuilding) {
                if (wb.avatar) {
                    try {
                        const imageData = await tintero.project.getImageData(wb.avatar);
                        if (imageData) {
                            avatarMap[wb.id] = imageData;
                        }
                    } catch (err) {
                        console.error(`Failed to load avatar for ${wb.name}:`, err);
                    }
                }
            }

            setWbAvatars(avatarMap);
        }

        if (worldbuilding.length > 0) {
            loadWbAvatars();
        }
    }, [worldbuilding, tintero]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredCharacters = characters.filter((char: any) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredWorldbuilding = worldbuilding.filter((wb: any) =>
        wb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredWbByType = filteredWorldbuilding.reduce((acc: any, wb: any) => {
        if (!acc[wb.type]) acc[wb.type] = [];
        acc[wb.type].push(wb);
        return acc;
    }, {});

    const filteredFiles = files.filter((file: any) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDocs = docs.filter((doc: any) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2 className="sidebar-title" style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-serif)',
                    letterSpacing: '0.5px'
                }}>
                    {metadata?.name || 'World Codex'}
                </h2>
                <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginTop: '4px'
                }}>
                    Your world comes to life
                </div>
            </div>

            {/* Search */}
            <div className="search-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <input
                    type="text"
                    placeholder="Search connection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                />
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
                {/* Dashboard */}
                <div className="nav-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', borderRadius: 'var(--radius-md)',
                        color: location.pathname === '/' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        background: location.pathname === '/' ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        fontWeight: '500', transition: 'all 0.2s'
                    }}>
                        <span>📊</span> Dashboard
                    </Link>
                </div>

                {/* Characters */}
                <div className="nav-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div className="nav-title" style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        paddingLeft: '12px'
                    }}>Characters</div>

                    {charsLoading ? (
                        <div style={{ paddingLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : filteredCharacters.length === 0 ? (
                        <div style={{ paddingLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>None found</div>
                    ) : (
                        filteredCharacters.map((char: any) => (
                            <Link key={char.id} to={`/character/${char.id}`} className={`nav-item ${location.pathname === `/character/${char.id}` ? 'active' : ''}`} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                                color: location.pathname === `/character/${char.id}` ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: location.pathname === `/character/${char.id}` ? 'var(--bg-tertiary)' : 'transparent',
                                marginBottom: '2px', transition: 'all 0.2s'
                            }}>
                                {charAvatars[char.id] ? (
                                    <img src={charAvatars[char.id]} className="sidebar-avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                                ) : (
                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: char.color || '#444', border: '1px solid rgba(255,255,255,0.1)' }} />
                                )}
                                <span style={{ fontSize: '0.9rem' }}>{char.name}</span>
                            </Link>
                        ))
                    )}
                </div>

                {/* Worldbuilding */}
                {!wbLoading && Object.keys(filteredWbByType).map(type => (
                    <div key={type} className="nav-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <div className="nav-title" style={{
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            paddingLeft: '12px'
                        }}>{type}</div>

                        {filteredWbByType[type].map((wb: any) => (
                            <Link key={wb.id} to={`/worldbuilding/${wb.id}`} className={`nav-item ${location.pathname === `/worldbuilding/${wb.id}` ? 'active' : ''}`} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                                color: location.pathname === `/worldbuilding/${wb.id}` ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: location.pathname === `/worldbuilding/${wb.id}` ? 'var(--bg-tertiary)' : 'transparent',
                                marginBottom: '2px', transition: 'all 0.2s'
                            }}>
                                {wbAvatars[wb.id] ? (
                                    <img src={wbAvatars[wb.id]} className="sidebar-avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                                ) : (
                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: wb.color || '#444', border: '1px solid rgba(255,255,255,0.1)' }} />
                                )}
                                <span style={{ fontSize: '0.9rem' }}>{wb.name}</span>
                            </Link>
                        ))}
                    </div>
                ))}

                {/* Chapters */}
                <div className="nav-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div className="nav-title" style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        paddingLeft: '12px'
                    }}>Chapters</div>

                    {filesLoading ? (
                        <div style={{ paddingLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : filteredFiles.length === 0 ? (
                        <div style={{ paddingLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>None found</div>
                    ) : (
                        filteredFiles.map((file: any) => (
                            <Link key={file.id} to={`/chapter/${file.id}`} className={`nav-item ${location.pathname === `/chapter/${file.id}` ? 'active' : ''}`} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                                color: location.pathname === `/chapter/${file.id}` ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: location.pathname === `/chapter/${file.id}` ? 'var(--bg-tertiary)' : 'transparent',
                                marginBottom: '2px', transition: 'all 0.2s'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>📄</span>
                                <span style={{ fontSize: '0.9rem' }}>{file.name}</span>
                            </Link>
                        ))
                    )}
                </div>

                {/* Documents */}
                <div className="nav-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div className="nav-title" style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        paddingLeft: '12px'
                    }}>Documents</div>

                    {docsLoading ? (
                        <div style={{ paddingLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : filteredDocs.length === 0 ? (
                        <div style={{ paddingLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>None found</div>
                    ) : (
                        filteredDocs.map((doc: any) => (
                            <Link key={doc.id} to={`/chapter/${doc.id}`} className={`nav-item ${location.pathname === `/chapter/${doc.id}` ? 'active' : ''}`} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                                color: location.pathname === `/chapter/${doc.id}` ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: location.pathname === `/chapter/${doc.id}` ? 'var(--bg-tertiary)' : 'transparent',
                                marginBottom: '2px', transition: 'all 0.2s'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>📝</span>
                                <span style={{ fontSize: '0.9rem' }}>{doc.name}</span>
                            </Link>
                        ))
                    )}
                </div>
            </nav>
        </div>
    );
}
