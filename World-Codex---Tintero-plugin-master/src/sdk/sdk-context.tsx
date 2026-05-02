import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createMockSDK } from './mock-sdk';

// Create context for the SDK
const TinteroContext = createContext<any>(null);

interface TinteroProviderProps {
    children: ReactNode;
}

/**
 * Provider that makes the Tintero SDK available to all components.
 * Automatically detects if running in production (window.tintero exists)
 * or development (uses mock SDK).
 */
export function TinteroProvider({ children }: TinteroProviderProps) {
    const sdk = useMemo(() => {
        // Check if we're running inside Tintero (production)
        if (typeof window !== 'undefined' && (window as any).tintero) {
            console.log('[SDK] Using production Tintero SDK');
            return (window as any).tintero;
        }

        // Development mode: use mock SDK
        console.log('[SDK] Using mock SDK for development');
        return createMockSDK();
    }, []);

    return (
        <TinteroContext.Provider value={sdk}>
            {children}
        </TinteroContext.Provider>
    );
}

/**
 * Hook to access the Tintero SDK from any component
 */
export function useTintero() {
    const sdk = useContext(TinteroContext);

    if (!sdk) {
        throw new Error('useTintero must be used within TinteroProvider');
    }

    return sdk;
}

/**
 * Hook to access project API
 */
export function useProject() {
    const tintero = useTintero();

    return tintero.project;
}

/**
 * Hook to access storage API
 */
export function useStorage() {
    const tintero = useTintero();

    return tintero.storage;
}

/**
 * Hook to access UI API
 */
export function useUI() {
    const tintero = useTintero();

    return tintero.ui;
}

/**
 * Hook to access events API
 */
export function useEvents() {
    const tintero = useTintero();

    return tintero.events;
}
