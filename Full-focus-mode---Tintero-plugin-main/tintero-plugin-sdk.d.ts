/**
 * Tintero Plugin SDK — TypeScript Definitions
 *
 * Usage:
 *   Copy this file into your plugin's source directory (e.g. src/tintero-plugin-sdk.d.ts)
 *   TypeScript will automatically pick up the global declarations.
 */

// ─── Data Types ─────────────────────────────────────────────

declare namespace TinteroSDK {

    interface ProjectMetadata {
        id: string;
        name: string;
        description: string | null;
        createdAt: number;
        lastModified: number;
        path: string;
    }

    interface CharacterWorldbuilding {
        species?: string[];
        factions?: string[];
        occupations?: string[];
        locations?: string[];
        religions?: string[];
        magicSystems?: string[];
        languages?: string[];
        technologies?: string[];
        groupMember?: string[];
        groupLeader?: string[];
        groupFounder?: string[];
        groupExMember?: string[];
        groupExLeader?: string[];
        deityFollower?: string[];
        deityChampion?: string[];
        deityClergy?: string[];
        deityEnemy?: string[];
        deityBlessed?: string[];
        deityCursed?: string[];
        deityExFollower?: string[];
        creatureTamed?: string[];
        creatureHunted?: string[];
        creatureProtected?: string[];
        creatureEncountered?: string[];
        creatureCompanion?: string[];
        creatureFamiliar?: string[];
        itemOwner?: string[];
        itemCreator?: string[];
        itemDiscovered?: string[];
        itemGuardian?: string[];
        itemExOwner?: string[];
        itemSeeker?: string[];
        eventParticipant?: string[];
        eventKeyFigure?: string[];
        eventCausedBy?: string[];
        eventWitness?: string[];
        eventVictim?: string[];
        eventHero?: string[];
    }

    interface CharacterVariant {
        id: string;
        name: string;
        description?: string;
        position?: number;
        /** Partial overrides of character fields for this variant. */
        overrides: Record<string, any>;
        createdAt: number;
        updatedAt?: number;
    }

    interface Character {
        id: string;
        name: string;
        firstName?: string;
        lastName?: string;
        pronouns?: string[];
        aka?: string[];
        physicalDescription?: string;
        psychologicalDescription?: string;
        portrait?: string;
        landscape?: string;
        color?: string;
        gender?: string;
        age?: string;
        birthdate?: string;
        birthplace?: string;
        traits?: string[];
        goals?: string[];
        fears?: string[];
        backstory?: string;
        notes?: string;
        tags?: string[];
        createdAt: number;
        updatedAt?: number;
        relationships?: Relationship[];
        variants?: CharacterVariant[];
        worldbuilding?: CharacterWorldbuilding;
    }

    interface Relationship {
        characterId: string;
        type: string;
        description?: string;
        isBidirectional?: boolean;
        inverseType?: string;
    }

    /** Known worldbuilding element types. Plugins may encounter other custom types. */
    type WorldbuildingType =
        | 'species'
        | 'faction'
        | 'occupation'
        | 'location'
        | 'religion'
        | 'magic-system'
        | 'technology'
        | 'language'
        | 'event'
        | 'creature'
        | 'item'
        | 'group'
        | 'deity'
        | 'custom';

    interface WorldbuildingElement {
        id: string;
        name: string;
        /** One of the known WorldbuildingType values, or a custom string. */
        type: WorldbuildingType | string;
        description?: string;
        tags?: string[];
        color?: string;
        createdAt: number;
        updatedAt?: number;
        notes?: string;
        extraFields?: { key: string; value: string }[];
    }

    /** Writing mode for files and documents. */
    type WritingMode = 'prose' | 'screenplay' | 'theatre';

    interface FileMetadata {
        id: string;
        name: string;
        title?: string;
        location: string;
        treePath?: string;
        order?: number | null;
        status?: string | null;
        createdAt: number;
        lastModified: number;
        hash?: string;
        links?: string[];
        color?: string;
        customIcon?: string;
        wordNumber?: number;
        keywords?: string[];
        customMetadata?: Record<string, string>;
        writingMode?: WritingMode;
    }

    interface DocMetadata {
        id: string;
        name: string;
        title: string;
        location: string;
        treePath: string;
        createdAt: number;
        lastModified: number;
        links?: string[];
        color?: string;
        customIcon?: string;
        wordNumber?: number;
        keywords?: string[];
        customMetadata?: Record<string, string>;
        writingMode?: WritingMode;
    }

    interface Note {
        id: string;
        fileId: string | null;
        type: string;
        location: string;
        textAssociated: string | null;
        content?: string;
    }

    interface PlotGridColumn {
        id: string;
        name: string;
        position: number;
    }

    interface PlotGridCell {
        id: string;
        type: string;
        columnId: string;
        rowIndex: number;
        referenceId?: string;
        content?: string;
        color?: string;
    }

    interface PlotGrid {
        id: string;
        name: string;
        columns: PlotGridColumn[];
        rowCount: number;
        cells: PlotGridCell[];
        createdAt: number;
        lastModified: number;
    }

    interface CardboardCell {
        id: string;
        type: string;
        position: { row: number; col: number };
        referenceId?: string;
        content?: string;
        color?: string;
        checked?: boolean;
        title?: string;
    }

    interface CardboardGrid {
        id: string;
        name: string;
        rows: number;
        cols: number;
        cells: CardboardCell[];
        createdAt: number;
        lastModified: number;
    }

    interface Collection {
        id: string;
        name: string;
        items: { id: string; type: string }[];
    }

    interface ImageInfo {
        id: string;
        title: string;
        fileName: string;
        relativePath: string;
        size: number;
        mimeType: string;
        width?: number;
        height?: number;
    }

    interface BackupEntry {
        id: string;
        name: string;
        timestamp: number;
        observations?: string;
        type: 'automatic' | 'manual';
    }

    // ─── Write input types ────────────────────────────────────

    interface CharacterInput {
        name: string;
        firstName?: string;
        lastName?: string;
        pronouns?: string[];
        aka?: string[];
        physicalDescription?: string;
        psychologicalDescription?: string;
        color?: string;
        gender?: string;
        age?: string;
        birthdate?: string;
        birthplace?: string;
        traits?: string[];
        goals?: string[];
        fears?: string[];
        backstory?: string;
        notes?: string;
        tags?: string[];
    }

    interface WorldbuildingInput {
        name: string;
        type: string;
        description?: string;
        tags?: string[];
        color?: string;
        notes?: string;
    }

    interface NoteInput {
        location: string;
        type?: string;
        fileId?: string;
        textAssociated?: string;
        content?: string;
    }

    interface FileInput {
        /** File name (required). */
        name: string;
        /** Folder tree path (e.g. "Chapter 1"). Defaults to root. */
        treePath?: string;
        /** Writing mode: 'prose' | 'screenplay' | 'theatre'. Defaults to 'prose'. */
        writingMode?: WritingMode;
        /** Optional initial HTML content. */
        content?: string;
        /** Color tag. */
        color?: string;
        /** Custom emoji icon. */
        customIcon?: string;
        /** Keywords/tags. */
        keywords?: string[];
        /** Free-form metadata. */
        customMetadata?: Record<string, string>;
        /** Workflow status (e.g. "draft", "review"). */
        status?: string;
    }

    interface FileMetaUpdate {
        name?: string;
        title?: string;
        color?: string;
        customIcon?: string;
        keywords?: string[];
        customMetadata?: Record<string, string>;
        writingMode?: WritingMode;
        status?: string;
        order?: number;
        treePath?: string;
    }

    interface DocInput {
        /** Document name (required). */
        name: string;
        /** Folder tree path. Defaults to root. */
        treePath?: string;
        /** Writing mode. Defaults to 'prose'. */
        writingMode?: WritingMode;
        /** Optional initial HTML content. */
        content?: string;
        /** Color tag. */
        color?: string;
        /** Custom emoji icon. */
        customIcon?: string;
        /** Keywords/tags. */
        keywords?: string[];
        /** Free-form metadata. */
        customMetadata?: Record<string, string>;
    }

    interface DocMetaUpdate {
        name?: string;
        title?: string;
        color?: string;
        customIcon?: string;
        keywords?: string[];
        customMetadata?: Record<string, string>;
        writingMode?: WritingMode;
        treePath?: string;
    }

    interface FolderInfo {
        id: string;
        title: string;
        treePath: string;
        color?: string;
        customIcon?: string;
    }

    interface FileInput {
        /** File name (required). */
        name: string;
        /** Folder tree path (e.g. "Chapter 1"). Defaults to root. */
        treePath?: string;
        /** Writing mode: 'prose' | 'screenplay' | 'theatre'. Defaults to 'prose'. */
        writingMode?: WritingMode;
        /** Optional initial HTML content. */
        content?: string;
        /** Color tag. */
        color?: string;
        /** Custom emoji icon. */
        customIcon?: string;
        /** Keywords/tags. */
        keywords?: string[];
        /** Free-form metadata. */
        customMetadata?: Record<string, string>;
        /** Workflow status (e.g. "draft", "review"). */
        status?: string;
    }

    interface FileMetaUpdate {
        name?: string;
        title?: string;
        color?: string;
        customIcon?: string;
        keywords?: string[];
        customMetadata?: Record<string, string>;
        writingMode?: WritingMode;
        status?: string;
        order?: number;
        treePath?: string;
    }

    interface DocInput {
        /** Document name (required). */
        name: string;
        /** Folder tree path. Defaults to root. */
        treePath?: string;
        /** Writing mode. Defaults to 'prose'. */
        writingMode?: WritingMode;
        /** Optional initial HTML content. */
        content?: string;
        /** Color tag. */
        color?: string;
        /** Custom emoji icon. */
        customIcon?: string;
        /** Keywords/tags. */
        keywords?: string[];
        /** Free-form metadata. */
        customMetadata?: Record<string, string>;
    }

    interface DocMetaUpdate {
        name?: string;
        title?: string;
        color?: string;
        customIcon?: string;
        keywords?: string[];
        customMetadata?: Record<string, string>;
        writingMode?: WritingMode;
        treePath?: string;
    }

    interface FolderInfo {
        id: string;
        title: string;
        treePath: string;
        color?: string;
        customIcon?: string;
    }

    // ─── Application Settings types ──────────────────────────

    interface GeneralSettings {
        languageIsoCode: string;
        selectedTheme: string;
        sidebarLength: number;
        editorZoom: number;
        spellCheckLanguage: string;
        dateFormat: string;
        timeFormat: string;
        autoDetectLanguage: boolean;
        fontSize: number | null;
        distractionFreeMode: boolean;
        highlightCurrentLine: boolean;
        showWordCount: boolean;
        useDialogWhenCreatingFiles: boolean;
        appMode: 'creative' | 'study' | 'minimal';
        clickFileOpensSameTab: boolean;
        displayChapterOrder: boolean;
        showNativeDecorators: boolean;
    }

    interface TrophySettings {
        dailyObjective: number;
        weeklyObjective: number;
        objectiveType: string;
        objectiveReminders: boolean;
        showRealTimeProgress: boolean;
        streakTracking: boolean;
        reminderTime: string;
        showAchievements: boolean;
        achievementNotifications: boolean;
    }

    interface HideSettings {
        showSidebar: boolean;
        editorShowSidebar: boolean;
        showStatusBar: boolean;
        showEditorUnderBar: boolean;
        visibleSidebarFiles: boolean;
        visibleSidebarCharacters: boolean;
        visibleSidebarWorldbuilding: boolean;
        visibleSidebarNotes: boolean;
        visibleSidebarAchievements: boolean;
        visibleSidebarBetaShares: boolean;
        [key: string]: boolean;
    }

    interface EditorSettings {
        defaultFontFamily: string | null;
        maxCharacters: number | null;
        defaultFontSize: number | null;
        intelligentQuotes?: boolean;
        intelligentDialog?: boolean;
        autoSave?: boolean;
    }

    interface EditorToolbarSettings {
        disableDistractionFreeMode?: boolean;
        disableZoom?: boolean;
        disableBold?: boolean;
        disableItalic?: boolean;
        disableStrikethrough?: boolean;
        disableHighlight?: boolean;
        disableRemoveFormat?: boolean;
        disableHeadings?: boolean;
        disableAlignLeft?: boolean;
        disableAlignCenter?: boolean;
        disableAlignRight?: boolean;
        disableJustify?: boolean;
        disableUnorderedList?: boolean;
        disableOrderedList?: boolean;
        disableBlockquote?: boolean;
        disableCodeBlock?: boolean;
        disableInlineCode?: boolean;
        disableFootnote?: boolean;
        disableTable?: boolean;
        disableImage?: boolean;
        disableDocumentLink?: boolean;
        disableHorizontalRule?: boolean;
    }

    /**
     * Sanitized AI settings exposed to plugins.
     * Sensitive fields (host, port, lastUsedModels) are excluded.
     */
    interface SanitizedAiSettings {
        serverType: 'ollama' | 'lm-studio';
        hide?: boolean;
        selectedModel: string;
        temperature: number;
        maxTokens: number;
    }

    /** The full application settings object returned by `tintero.app.getSettings()`. */
    interface AppSettings {
        generalSettings: GeneralSettings;
        trophySettings: TrophySettings;
        hideSettings: HideSettings;
        editorSettings: EditorSettings;
        editorToolbarSettings: EditorToolbarSettings;
        /** AI settings are sanitized — host, port, and lastUsedModels are stripped. */
        aiSettings: SanitizedAiSettings;
    }

    // ─── Dialog options ───────────────────────────────────────

    interface DialogOptions {
        title?: string;
        width?: number;
        height?: number;
        data?: any;
    }

    // ─── Notification types ───────────────────────────────────

    type NotificationType = 'info' | 'success' | 'warning' | 'error';

    // ─── Export/Import config ─────────────────────────────────

    interface ExportResult {
        data: string;
        encoding?: 'text' | 'base64';
        mimeType?: string;
    }

    interface FileExporterConfig {
        formatName: string;
        extension: string;
        mimeType?: string;
        convert: (htmlContent: string) => string | ExportResult | Promise<string | ExportResult>;
    }

    interface BookExporterConfig {
        formatName: string;
        extension: string;
        mimeType?: string;
        convert: (documents: string[], metadata: ProjectMetadata) => string | ExportResult | Promise<string | ExportResult>;
    }

    interface ProjectExporterConfig {
        formatName: string;
        extension: string;
        mimeType?: string;
        convert: (project: any) => string | ExportResult | Promise<string | ExportResult>;
    }

    interface FileImporterConfig {
        formatName: string;
        extensions: string[];
        formatDescription?: string;
        convert: (data: string, fileName: string) => string | Promise<string>;
    }

    interface ProjectImporterConfig {
        formatName: string;
        extensions: string[];
        formatDescription?: string;
        convert: (data: string, fileName: string) => any | Promise<any>;
    }

    // ─── Editor types ──────────────────────────────────────

    interface EditorSelection {
        /** Start position of the selection in the ProseMirror document. */
        from: number;
        /** End position of the selection. Same as `from` when no text is selected. */
        to: number;
        /** The selected text, or empty string if nothing is selected. */
        text: string;
        /** Whether the selection is empty (cursor only, no text selected). */
        empty: boolean;
    }

    interface OpenDocument {
        /** File or document ID. */
        id: string;
        /** Display name (file name). */
        name: string;
        /** Writing mode if set. */
        writingMode?: WritingMode;
        /** Color tag. */
        color?: string;
        /** Custom emoji icon. */
        customIcon?: string;
        /** Whether this document is the currently active/focused one. */
        isActive: boolean;
    }

    // ─── Debug / Console types ──────────────────────────────

    interface ConsoleEntry {
        level: 'log' | 'warn' | 'error' | 'info';
        args: string[];
        /** Source identifier: 'app' for host logs, or a plugin ID for plugin logs. */
        source: string;
        timestamp: number;
    }

    // ─── Events ───────────────────────────────────────────────

    type PluginEvent =
        | 'project.loaded'
        | 'project.saved'
        | 'project.changed'
        | 'file.opened'
        | 'file.saved'
        | 'file.closed'
        | 'character.added'
        | 'character.updated'
        | 'character.deleted'
        | 'worldbuilding.added'
        | 'worldbuilding.updated'
        | 'worldbuilding.deleted'
        | 'editor.selectionChanged'
        | 'editor.activeDocumentChanged'
        | 'plugin.activated'
        | 'plugin.deactivated'
        | 'debug.log';

    /** Payload for `editor.selectionChanged` event. Does not include selected text — use `editor.getSelection()` for that. */
    interface EditorSelectionChangedEvent {
        documentId: string;
        from: number;
        to: number;
        empty: boolean;
    }

    /** Payload for `editor.activeDocumentChanged` event. */
    interface EditorActiveDocumentChangedEvent {
        documentId: string;
        name: string | null;
    }

    type EventCallback = (data?: any) => void;

    // ─── API namespaces ───────────────────────────────────────

    interface ProjectAPI {
        /** Get project metadata (name, dates, description). */
        getMetadata(): Promise<ProjectMetadata>;

        /** Get all project files (metadata only, no content). */
        getFiles(): Promise<FileMetadata[]>;

        /**
         * Get the HTML content of a file by its ID.
         *
         * Content is stored in **ProseMirror HTML format**: paragraphs are wrapped in
         * `<p>` tags, headings use `<h1>`–`<h6>`, and inline formatting uses standard
         * HTML (`<strong>`, `<em>`, `<s>`, `<code>`, `<mark>`). Lists use `<ul>`/`<ol>`,
         * blockquotes use `<blockquote>`, and code blocks use `<pre><code>`.
         */
        getFileContent(fileId: string): Promise<string | null>;

        /** Get all characters. */
        getCharacters(): Promise<Character[]>;

        /** Get a character by ID. */
        getCharacterById(id: string): Promise<Character | null>;

        /** Get all worldbuilding elements. */
        getWorldbuilding(): Promise<WorldbuildingElement[]>;

        /** Get worldbuilding elements by type (e.g. "location", "faction"). */
        getWorldbuildingByType(type: string): Promise<WorldbuildingElement[]>;

        /** Get all documents (metadata only). */
        getDocs(): Promise<DocMetadata[]>;

        /** Get the HTML content of a document by its ID. Content is in ProseMirror HTML format. */
        getDocContent(docId: string): Promise<string | null>;

        /** Get all notes. */
        getNotes(): Promise<Note[]>;

        /** Get all plot grids with their columns and cells. */
        getPlotGrids(): Promise<PlotGrid[]>;

        /** Get all cardboard grids with their cells. */
        getCardboards(): Promise<CardboardGrid[]>;

        /** Get all collections. */
        getCollections(): Promise<Collection[]>;

        /** Get all project tags. */
        getTags(): Promise<string[]>;

        /** Get all images metadata. */
        getImages(): Promise<ImageInfo[]>;

        /**
         * Get a project image as a base64 data URL.
         * Accepts the image fileName or relativePath (e.g. "portrait.png" or "images/portrait.png").
         * Returns a string like "data:image/png;base64,..." or null if not found.
         * Use this to display project images inside plugin iframes.
         */
        getImageData(imageRef: string): Promise<string | null>;

        /** Update an existing character's fields. Only provided fields are changed. */
        updateCharacter(id: string, data: Partial<CharacterInput>): Promise<void>;

        /** Create a new character. Requires at least `name`. */
        addCharacter(data: CharacterInput): Promise<Character>;

        /** Create a new worldbuilding element. Requires `name` and `type`. */
        addWorldbuildingElement(data: WorldbuildingInput): Promise<WorldbuildingElement>;

        /** Update an existing worldbuilding element. */
        updateWorldbuildingElement(id: string, data: Partial<WorldbuildingInput>): Promise<void>;

        /** Delete a worldbuilding element by ID. */
        removeWorldbuildingElement(id: string): Promise<void>;

        /**
         * Update the HTML content of a file.
         *
         * Content must be valid **ProseMirror HTML**: paragraphs in `<p>` tags,
         * headings in `<h1>`–`<h6>`, inline formatting with `<strong>`, `<em>`, etc.
         * The editor will parse the HTML back into its internal ProseMirror document model.
         */
        updateFileContent(fileId: string, htmlContent: string): Promise<void>;

        /** Update the HTML content of a document. Same format as updateFileContent. */
        updateDocContent(docId: string, htmlContent: string): Promise<void>;

        /** Create a new file in the project. Returns the created file metadata. */
        addFile(data: FileInput): Promise<FileMetadata>;

        /** Update file metadata (not content). Only provided fields are changed. */
        updateFileMeta(id: string, data: FileMetaUpdate): Promise<void>;

        /** Create a new document in the project. Returns the created doc metadata. */
        addDoc(data: DocInput): Promise<DocMetadata>;

        /** Update document metadata (not content). Only provided fields are changed. */
        updateDocMeta(id: string, data: DocMetaUpdate): Promise<void>;

        /** Get the project's folder tree structure. */
        getFolders(): Promise<FolderInfo[]>;

        /** Update the HTML content of a document. Same format as updateFileContent. */
        updateDocContent(docId: string, htmlContent: string): Promise<void>;

        /** Create a new file in the project. Returns the created file metadata. */
        addFile(data: FileInput): Promise<FileMetadata>;

        /** Update file metadata (not content). Only provided fields are changed. */
        updateFileMeta(id: string, data: FileMetaUpdate): Promise<void>;

        /** Create a new document in the project. Returns the created doc metadata. */
        addDoc(data: DocInput): Promise<DocMetadata>;

        /** Update document metadata (not content). Only provided fields are changed. */
        updateDocMeta(id: string, data: DocMetaUpdate): Promise<void>;

        /** Get the project's folder tree structure. */
        getFolders(): Promise<FolderInfo[]>;

        /** Create a new note. Requires `location`. */
        addNote(data: NoteInput): Promise<Note>;

        /** Replace all project tags. */
        updateTags(tags: string[]): Promise<void>;
    }

    interface FileSystemAPI {
        /** Get the current platform: "tauri", "capacitor", or "web". */
        getPlatform(): Promise<string>;

        /** Read a file from the project directory (relative path). */
        readProjectFile(location: string): Promise<string | null>;

        /** Write a file to the project directory (relative path). */
        writeProjectFile(location: string, content: string): Promise<void>;

        /** Delete a file from the project directory (relative path). */
        deleteProjectFile(location: string): Promise<void>;

        /** Save the project metadata to disk. */
        saveProject(): Promise<void>;
    }

    interface UIAPI {
        /** Show a toast notification. */
        showNotification(message: string, type?: NotificationType, durationMs?: number): Promise<void>;

        /**
         * Render HTML into the active context.
         * If a dialog is open for this plugin, renders into the dialog.
         * Otherwise, renders into the sidebar panel's #plugin-root.
         */
        render(html: string): Promise<void>;

        /** Open a modal dialog for this plugin. */
        openDialog(options?: DialogOptions): Promise<void>;

        /** Close the plugin's open dialog. */
        closeDialog(): Promise<void>;

        /** Show the application sidebar. */
        showSidebar(): Promise<void>;

        /** Hide the application sidebar. */
        hideSidebar(): Promise<void>;

        /** Toggle the application sidebar visibility. */
        toggleSidebar(): Promise<void>;

        /** Toggle fullscreen mode (Desktop only). */
        toggleFullscreen(): Promise<void>;

        /** Check if the application is currently in fullscreen mode. */
        isFullscreen(): Promise<boolean>;
    }

    interface StorageAPI {
        /** Get a stored value by key. Returns null if not found. */
        get(key: string): Promise<any | null>;

        /** Store a value. Values are JSON-serializable. */
        set(key: string, value: any): Promise<void>;

        /** Remove a stored key. */
        remove(key: string): Promise<void>;

        /** Get all stored key-value pairs. */
        getAll(): Promise<Record<string, any>>;
    }

    interface SettingsAPI {
        /** Get all plugin settings (manifest defaults merged with stored overrides). */
        get(): Promise<Record<string, any>>;

        /** Get a specific setting field value. */
        getField(key: string): Promise<any | null>;
    }

    interface AppAPI {
        /** Get a sanitized copy of application settings (AI credentials excluded). */
        getSettings(): Promise<AppSettings>;

        /** Get a specific setting field by dot path (e.g. "generalSettings.languageIsoCode"). */
        getSettingsField(path: string): Promise<any | null>;

        /**
         * Modify application settings.
         * Allowed sections: generalSettings, trophySettings, hideSettings, editorSettings, editorToolbarSettings.
         * AI settings cannot be modified.
         */
        updateSettings(changes: Partial<Pick<AppSettings, 'generalSettings' | 'trophySettings' | 'hideSettings' | 'editorSettings' | 'editorToolbarSettings'>>): Promise<void>;
    }

    interface BackupAPI {
        /** Create a backup. Returns the backup ID. */
        create(name?: string, observations?: string): Promise<string>;

        /** List all backups. */
        list(): Promise<BackupEntry[]>;

        /** Get a specific backup by ID. */
        getById(id: string): Promise<BackupEntry | null>;

        /** Restore a backup. WARNING: This replaces the current project data. */
        restore(id: string): Promise<void>;
    }

    interface EventsAPI {
        /** Subscribe to an event. */
        on(event: PluginEvent, callback: EventCallback): void;

        /** Unsubscribe from an event. */
        off(event: PluginEvent, callback: EventCallback): void;
    }

    interface ExportAPI {
        /** Register this plugin as a file exporter. The convert function is called when the user exports. */
        registerExporter(config: FileExporterConfig): Promise<void>;

        /** Register this plugin as a book exporter (all files concatenated). */
        registerBookExporter(config: BookExporterConfig): Promise<void>;

        /** Register this plugin as a project exporter. */
        registerProjectExporter(config: ProjectExporterConfig): Promise<void>;

        /** Trigger a file download to the user's device. */
        exportFile(fileName: string, content: string, mimeType?: string): Promise<void>;
    }

    interface ImportAPI {
        /** Register this plugin as a file importer. The convert function receives raw file data. */
        registerImporter(config: FileImporterConfig): Promise<void>;

        /** Register this plugin as a project importer. */
        registerProjectImporter(config: ProjectImporterConfig): Promise<void>;
    }

    interface EditorAPI {
        // ── Read (scope: editor.read) ──

        /** Get the currently active/focused document, or null if no editor is open. */
        getActiveDocument(): Promise<OpenDocument | null>;

        /** Get all documents currently open in editor tabs. */
        getOpenDocuments(): Promise<OpenDocument[]>;

        /**
         * Get the current text selection in the active editor.
         * Returns null if no editor is open.
         * Positions are ProseMirror document positions (use with insertAt/replaceRange).
         */
        getSelection(): Promise<EditorSelection | null>;

        /** Get the word count of the active document. Returns 0 if no editor is open. */
        getWordCount(): Promise<number>;

        // ── Write (scope: editor.write) ──

        /**
         * Insert HTML content at a specific position in the active editor.
         * @param position ProseMirror document position (obtain from getSelection()).
         * @param html     HTML string (parsed through the editor's ProseMirror schema).
         */
        insertAt(position: number, html: string): Promise<void>;

        /**
         * Replace a range of content in the active editor.
         * @param from Start position (inclusive).
         * @param to   End position (exclusive).
         * @param html Replacement HTML content.
         */
        replaceRange(from: number, to: number, html: string): Promise<void>;

        /**
         * Replace the current selection with HTML content.
         * If the selection is empty (cursor only), inserts at the cursor position.
         */
        replaceSelection(html: string): Promise<void>;
    }

    interface DebugAPI {
        /** Get all stored console log entries. Requires `debug.console` scope. */
        getLogs(): Promise<ConsoleEntry[]>;

        /** Clear the console log buffer. */
        clear(): Promise<void>;
    }

    // ─── ProseMirror JSON type ──────────────────────────────

    /**
     * A ProseMirror/TipTap document JSON structure.
     * The top-level node has `type: "doc"` with an array of child nodes.
     * Each node has a `type` (e.g. "paragraph", "heading"), optional `content`,
     * optional `attrs`, and text nodes have a `text` string with optional `marks`.
     */
    interface ProseMirrorNode {
        type: string;
        content?: ProseMirrorNode[];
        text?: string;
        marks?: { type: string; attrs?: Record<string, any> }[];
        attrs?: Record<string, any>;
    }

    interface ProseMirrorDocument {
        type: 'doc';
        content: ProseMirrorNode[];
    }

    // ─── Format Conversion API ──────────────────────────────

    interface ConvertAPI {
        /**
         * Convert ProseMirror JSON to plain text.
         * Extracts text content, discarding all formatting.
         */
        toText(json: ProseMirrorDocument): Promise<string>;

        /**
         * Convert ProseMirror JSON to clean HTML.
         * Returns HTML fragment (no `<html>`/`<body>` wrapper).
         * Supports headings, paragraphs, lists, bold, italic, links, images.
         */
        toHtml(json: ProseMirrorDocument): Promise<string>;

        /**
         * Convert ProseMirror JSON to Markdown.
         * Uses ATX-style headings (`#`), `**bold**`, `*italic*`, `[links](url)`.
         */
        toMarkdown(json: ProseMirrorDocument): Promise<string>;

        /**
         * Convert plain text to ProseMirror JSON.
         * Each line becomes a paragraph node.
         */
        fromText(text: string): Promise<ProseMirrorDocument>;

        /**
         * Convert HTML to ProseMirror JSON.
         * Supports standard HTML elements: `<p>`, `<h1>`–`<h6>`, `<strong>`,
         * `<em>`, `<a>`, `<ul>`, `<ol>`, `<blockquote>`, `<code>`, `<table>`, etc.
         */
        fromHtml(html: string): Promise<ProseMirrorDocument>;

        /**
         * Convert Markdown to ProseMirror JSON.
         * Parses standard Markdown syntax (headings, bold, italic, links, lists, code blocks).
         */
        fromMarkdown(markdown: string): Promise<ProseMirrorDocument>;
    }

    // ─── Main API object ──────────────────────────────────────

    interface TinteroAPI {
        project: ProjectAPI;
        fs: FileSystemAPI;
        ui: UIAPI;
        storage: StorageAPI;
        settings: SettingsAPI;
        app: AppAPI;
        backup: BackupAPI;
        events: EventsAPI;
        export: ExportAPI;
        import: ImportAPI;
        /** Live editor state: active document, open tabs, text selection, and write operations. */
        editor: EditorAPI;
        debug: DebugAPI;
        /** Stateless format converters between ProseMirror JSON, HTML, Markdown, and plain text. */
        convert: ConvertAPI;
    }
}

// ─── Global declarations ──────────────────────────────────

/** The main Tintero Plugin API. Available globally inside plugin iframes. */
declare const tintero: TinteroSDK.TinteroAPI;

/**
 * Base class for Tintero plugins.
 * Create an instance, override lifecycle methods, then call registerPlugin().
 */
declare class TinteroPlugin {
    /** Called when the plugin is activated. Initialize your UI and load data here. */
    onActivate(): void | Promise<void>;

    /** Called when the active project changes. Refresh your data and UI here. */
    onProjectChange(): void | Promise<void>;

    /** Called when the plugin is being deactivated. Clean up resources here. */
    onDeactivate(): void | Promise<void>;

    /** Legacy method for panel rendering. Use onActivate instead. */
    renderPanel(): void | Promise<void>;
}

/**
 * Register a plugin instance with Tintero.
 * This must be called exactly once per plugin. It triggers onActivate().
 */
declare function registerPlugin(plugin: TinteroPlugin): void;
