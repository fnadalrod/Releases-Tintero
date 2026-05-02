import { useParams, Link } from 'react-router-dom';
import { useProject, useStorage, useTintero } from '../sdk/sdk-context.tsx';
import { useEffect, useState } from 'react';

interface EntityPageProps {
    type: 'character' | 'worldbuilding';
}

export default function EntityPage({ type }: EntityPageProps) {
    const { id } = useParams<{ id: string }>();
    const project = useProject();
    const storage = useStorage();

    const [entity, setEntity] = useState<any>(null);
    const [mentions, setMentions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEntity() {
            if (!id) {
                return;
            }

            setLoading(true);
            try {
                let data;

                if (type === 'character') {
                    data = await project.getCharacterById(id);
                } else {
                    const allWb = await project.getWorldbuilding();
                    data = allWb.find((wb: any) => wb.id === id);
                }

                setEntity(data);

                const index = await storage.get('crossRefIndex');

                if (index && index[id]) {
                    setMentions(index[id]);
                } else {
                    setMentions([]);
                }
            } catch (err) {
                console.error('Failed to load entity:', err);
            } finally {
                setLoading(false);
            }
        }

        loadEntity();
    }, [id, type, project, storage]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!entity) {
        return <div className="error">Entity not found</div>;
    }

    if (type === 'character') {
        return <CharacterView character={entity} mentions={mentions} />;
    } else {
        return <WorldbuildingView element={entity} mentions={mentions} />;
    }
}

function CharacterView({ character, mentions }: { character: any; mentions: any[] }) {
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [allCharacters, setAllCharacters] = useState<any[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const project = useProject();
    const tintero = useTintero();

    useEffect(() => {
        async function loadCharacters() {
            try {
                const chars = await project.getCharacters();
                setAllCharacters(chars);
            } catch (err) {
                console.error('Failed to load characters:', err);
            }
        }
        loadCharacters();
    }, [project]);

    useEffect(() => {
        async function loadAvatar() {
            if (character.avatar) {
                try {
                    const imageData = await tintero.project.getImageData(character.avatar);
                    if (imageData) {
                        setAvatarUrl(imageData);
                    }
                } catch (err) {
                    console.error('Failed to load avatar:', err);
                }
            }
        }

        loadAvatar();
    }, [character.avatar, tintero]);

    const getCharacterName = (characterId: string): string => {
        const char = allCharacters.find(c => c.id === characterId);

        return char ? char.name : `Character ${characterId}`;
    };

    const displayCharacter = selectedVariant
        ? { ...character, ...selectedVariant.overrides }
        : character;

    return (
        <div className="wiki-page">
            {/* Header with avatar */}
            <header className="entity-header">
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt={displayCharacter.name}
                        className="avatar-large"
                    />
                )}
                <div>
                    <h1 className="entity-title">{displayCharacter.name}</h1>
                    {displayCharacter.aka && displayCharacter.aka.length > 0 && (
                        <div className="entity-subtitle">
                            Also known as: {displayCharacter.aka.join(', ')}
                        </div>
                    )}
                </div>
            </header>

            {/* Core Stats Grid */}
            <div className="data-grid">
                {displayCharacter.age && (
                    <div className="data-item">
                        <div className="data-label">Age</div>
                        <div className="data-value">{displayCharacter.age}</div>
                    </div>
                )}
                {displayCharacter.gender && (
                    <div className="data-item">
                        <div className="data-label">Gender</div>
                        <div className="data-value">{displayCharacter.gender}</div>
                    </div>
                )}
                {displayCharacter.birthplace && (
                    <div className="data-item">
                        <div className="data-label">Birthplace</div>
                        <div className="data-value">{displayCharacter.birthplace}</div>
                    </div>
                )}
            </div>

            {/* Variants selector */}
            {character.variants && character.variants.length > 0 && (
                <div className="card">
                    <h3>Character Versions</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <div
                            className={`variant-card ${!selectedVariant ? 'active' : ''}`}
                            onClick={() => setSelectedVariant(null)}
                        >
                            <div className="variant-name">Base Version</div>
                        </div>
                        {character.variants.map((variant: any) => (
                            <div
                                key={variant.id}
                                className={`variant-card ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                                onClick={() => setSelectedVariant(variant)}
                            >
                                <div className="variant-name">{variant.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Descriptions */}
            {(displayCharacter.physicalDescription || displayCharacter.psychologicalDescription || displayCharacter.backstory) && (
                <div className="card">
                    <h3>Lore & Background</h3>
                    {displayCharacter.physicalDescription && (
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Physical Appearance</h4>
                            <p>{displayCharacter.physicalDescription}</p>
                        </div>
                    )}
                    {displayCharacter.psychologicalDescription && (
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Personality</h4>
                            <p>{displayCharacter.psychologicalDescription}</p>
                        </div>
                    )}
                    {displayCharacter.backstory && (
                        <div>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Backstory</h4>
                            <p>{displayCharacter.backstory}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Relationships */}
            {character.relationships && character.relationships.length > 0 && (
                <div className="card">
                    <h3>Relationships</h3>
                    <div className="grid-relationships">
                        {character.relationships.map((rel: any, i: number) => (
                            <div key={i} className="relationship-item">
                                <div className="relationship-type">{rel.type}</div>
                                <Link to={`/character/${rel.characterId}`} className="relationship-name">
                                    {getCharacterName(rel.characterId)}
                                </Link>
                                {rel.description && (
                                    <div className="relationship-desc">
                                        "{rel.description}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Traits, Goals, Fears */}
            <div className="card">
                <h3>Character Traits</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {displayCharacter.traits && displayCharacter.traits.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Tags</h4>
                            <div className="tags">
                                {displayCharacter.traits.map((trait: string) => (
                                    <span key={trait} className="tag">{trait}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {displayCharacter.goals && displayCharacter.goals.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Goals</h4>
                            <ul>
                                {displayCharacter.goals.map((goal: string, i: number) => (
                                    <li key={i} style={{ marginBottom: '4px' }}>{goal}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Mentions */}
            {mentions.length > 0 && (
                <div className="card">
                    <h3>Appearances ({mentions.length})</h3>
                    <ul className="cross-ref-list">
                        {mentions.slice(0, 10).map((mention: any, i: number) => (
                            <li key={i} className="cross-ref-item">
                                <Link
                                    to={`/chapter/${mention.fileId}`}
                                    className="cross-ref-link"
                                >
                                    <div className="cross-ref-file">
                                        📄 {mention.fileName}
                                    </div>
                                    <div className="cross-ref-snippet">
                                        "...{mention.snippet}..."
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function WorldbuildingView({ element, mentions }: { element: any; mentions: any[] }) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const tintero = useTintero();

    useEffect(() => {
        async function loadAvatar() {
            if (element.avatar) {
                try {
                    const imageData = await tintero.project.getImageData(element.avatar);
                    if (imageData) {
                        setAvatarUrl(imageData);
                    }
                } catch (err) {
                    console.error('Failed to load avatar:', err);
                }
            }
        }
        loadAvatar();
    }, [element.avatar, tintero]);

    return (
        <div className="entity-page">
            {/* Header with avatar */}
            <header className="entity-header">
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt={element.name}
                        className="avatar-large"
                    />
                )}
                <div>
                    <h1 className="entity-title">{element.name}</h1>
                    <div className="entity-type-badge">
                        {element.type}
                    </div>
                </div>
            </header>

            {/* Description & Notes */}
            <div className="card">
                <h3>Details</h3>
                {element.description && (
                    <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</h4>
                        <div className="section-content">{element.description}</div>
                    </div>
                )}
                {element.notes && (
                    <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>GM Notes</h4>
                        <div className="section-content" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{element.notes}</div>
                    </div>
                )}
            </div>

            {/* Tags */}
            {element.tags && element.tags.length > 0 && (
                <div className="card">
                    <h3>Tags</h3>
                    <div className="tags">
                        {element.tags.map((tag: string) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Mentions */}
            {mentions.length > 0 && (
                <div className="card">
                    <h3>Referenced in ({mentions.length})</h3>
                    <ul className="cross-ref-list">
                        {mentions.slice(0, 10).map((mention: any, i: number) => (
                            <li key={i} className="cross-ref-item">
                                <Link
                                    to={`/chapter/${mention.fileId}`}
                                    className="cross-ref-link"
                                >
                                    <div className="cross-ref-file">
                                        📄 {mention.fileName}
                                    </div>
                                    <div className="cross-ref-snippet">
                                        "...{mention.snippet}..."
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
