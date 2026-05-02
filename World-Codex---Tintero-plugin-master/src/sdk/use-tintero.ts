import { useProject } from './sdk-context';
import { useState, useEffect } from 'react';

export function useCharacters() {
    const project = useProject();
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await project.getCharacters();
                setCharacters(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [project]);

    return { characters, loading, error };
}

export function useWorldbuilding() {
    const project = useProject();
    const [worldbuilding, setWorldbuilding] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await project.getWorldbuilding();
                setWorldbuilding(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [project]);

    return { worldbuilding, loading, error };
}

export function useFiles() {
    const project = useProject();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await project.getFiles();
                setFiles(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [project]);

    return { files, loading, error };
}

export function useDocs() {
    const project = useProject();
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await project.getDocs();
                setDocs(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [project]);

    return { docs, loading, error };
}

export function useProjectMetadata() {
    const project = useProject();
    const [metadata, setMetadata] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await project.getMetadata();
                setMetadata(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [project]);

    return { metadata, loading, error };
}

export function useCharacter(id: string | undefined) {
    const project = useProject();
    const [character, setCharacter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            if (!id) return;

            try {
                setLoading(true);
                const data = await project.getCharacterById(id);
                setCharacter(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, project]);

    return { character, loading, error };
}

export function useCrossRefIndex() {
    const project = useProject();
    const [index, setIndex] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setIndex({});
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [project]);

    return { index, loading, error };
}
