import { useState, useEffect } from 'react';

export interface PluginSettings {
    showBackground: boolean;
    showQuotes: boolean;
    showTimer: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
    showBackground: true,
    showQuotes: true,
    showTimer: true
};

export function useSettings() {
    const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const loadSettings = async () => {
            if (window.tintero && window.tintero.storage) {
                try {
                    const stored = await window.tintero.storage.get('fullFocusSettings');

                    if (stored) {
                        setSettings({ ...DEFAULT_SETTINGS, ...stored });
                    }
                } catch (e) {
                    console.warn('Failed to load settings', e);
                }
            }
        };
        loadSettings();
    }, []);

    const updateSetting = async (key: keyof PluginSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        if (window.tintero && window.tintero.storage) {
            try {
                await window.tintero.storage.set('fullFocusSettings', newSettings);
            } catch (e) {
                console.warn('Failed to save settings', e);
            }
        }
    };

    return { settings, updateSetting };
}
