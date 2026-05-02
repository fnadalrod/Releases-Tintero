import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectMetadata, useCharacters, useWorldbuilding, useFiles } from '../sdk/use-tintero';
import { useStorage } from '../sdk/sdk-context';
import { buildIndex, shouldRebuildIndex } from '../engine/indexer';
import { useTintero } from '../sdk/sdk-context';

export default function Dashboard() {
    const { metadata } = useProjectMetadata();
    const { characters } = useCharacters();
    const { worldbuilding } = useWorldbuilding();
    const { files } = useFiles();
    const storage = useStorage();
    const tintero = useTintero();

    const [indexing, setIndexing] = useState(false);
    const [indexStats, setIndexStats] = useState<any>(null);

    useEffect(() => {
        async function checkAndBuildIndex() {
            try {
                const needsRebuild = await shouldRebuildIndex(tintero);

                if (needsRebuild) {
                    setIndexing(true);
                    const index = await buildIndex(tintero);
                    setIndexing(false);

                    const totalMentions = Object.values(index).reduce(
                        (sum: number, mentions: any) => sum + mentions.length,
                        0
                    );
                    setIndexStats({
                        entitiesWithMentions: Object.keys(index).length,
                        totalMentions,
                    });
                } else {
                    const index = await storage.get('crossRefIndex');

                    if (index) {
                        const totalMentions = Object.values(index).reduce(
                            (sum: number, mentions: any) => sum + mentions.length,
                            0
                        );
                        setIndexStats({
                            entitiesWithMentions: Object.keys(index).length,
                            totalMentions,
                        });
                    }
                }
            } catch (err) {
                console.error('[Dashboard] Failed to build index:', err);
                setIndexing(false);
            }
        }

        if (tintero && characters.length > 0) {
            checkAndBuildIndex();
        }
    }, [tintero, characters.length, worldbuilding.length, files.length]);



    return (
        <div className="dashboard">
            {/* Header */}
            <div className="wiki-header">
                <h1 className="wiki-title">
                    {metadata?.name || 'World Codex'}
                </h1>
                <p className="wiki-subtitle">
                    {metadata?.description || 'Your world comes to life'}
                </p>
            </div>

            {/* Indexing Status */}
            {indexing && (
                <div className="indexing-status">
                    <div className="spinner">🔄</div>
                    Building cross-reference index...
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="dashboard-grid">
                {/* Characters */}
                <div className="dashboard-card">
                    <div className="dashboard-stat" style={{ color: 'var(--accent-primary)' }}>
                        {characters.length}
                    </div>
                    <div className="dashboard-label">
                        Characters
                    </div>
                </div>

                {/* Worldbuilding */}
                <div className="dashboard-card">
                    <div className="dashboard-stat" style={{ color: 'var(--accent-secondary)' }}>
                        {worldbuilding.length}
                    </div>
                    <div className="dashboard-label">
                        World Elements
                    </div>
                </div>

                {/* Files */}
                <div className="dashboard-card">
                    <div className="dashboard-stat" style={{ color: 'var(--text-primary)' }}>
                        {files.length}
                    </div>
                    <div className="dashboard-label">
                        Chapters
                    </div>
                </div>

                {/* Cross-references */}
                <div className="dashboard-card">
                    <div className="dashboard-stat" style={{ color: '#4caf50' }}>
                        {indexStats?.totalMentions || 0}
                    </div>
                    <div className="dashboard-label">
                        Calculated Links
                    </div>
                </div>
            </div>

            {/* Quick Access / Recent Characters */}
            {characters.length > 0 && (
                <div className="section">
                    <h2 className="section-title">
                        Prominent Characters
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                        {characters.slice(0, 8).map((char: any) => (
                            <Link
                                key={char.id}
                                to={`/character/${char.id}`}
                                className="card"
                                style={{
                                    padding: '16px',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    margin: 0,
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                            >
                                <span
                                    className="entity-dot"
                                    style={{
                                        backgroundColor: char.color || '#888',
                                        boxShadow: '0 0 8px ' + (char.color || '#888')
                                    }}
                                />
                                <div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem' }}>{char.name}</div>
                                    {char.physicalDescription && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                            {char.physicalDescription}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
