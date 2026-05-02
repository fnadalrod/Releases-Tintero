/// <reference path="../tintero-plugin-sdk.d.ts" />

export { };

declare global {
    interface Window {
        tintero: {
            project: TinteroSDK.ProjectAPI;
            fs: TinteroSDK.FileSystemAPI;
            ui: TinteroSDK.UIAPI;
            storage: TinteroSDK.StorageAPI;
            settings: TinteroSDK.SettingsAPI;
            app: TinteroSDK.AppAPI;
            backup: TinteroSDK.BackupAPI;
            events: TinteroSDK.EventsAPI;
            export: TinteroSDK.ExportAPI;
            import: TinteroSDK.ImportAPI;
            editor: TinteroSDK.EditorAPI;
            convert: TinteroSDK.ConvertAPI;
        };
        registerPlugin: (plugin: any) => void;
        TinteroPlugin: any;
    }

    const tintero: Window['tintero'];
}
