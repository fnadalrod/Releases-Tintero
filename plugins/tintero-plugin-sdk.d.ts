/**
 * Tintero Plugin SDK — TypeScript Definitions
 *
 * Latest version: https://github.com/fnadalrod/Releases-Tintero/blob/master/plugins/tintero-plugin-sdk.d.ts
 *
 * Usage:
 *   Copy this file into your plugin's source directory (e.g. src/tintero-plugin-sdk.d.ts)
 *   TypeScript will automatically pick up the global declarations.
 */

// ─── Data Types ─────────────────────────────────────────────

declare namespace TinteroSDK {

  // ─── Manifest (plugin.json) ─────────────────────────────────

  /**
   * Every permission the host can grant. A plugin declares the ones it needs in
   * `plugin.json`; the user approves them at install time and the bridge checks them on
   * every single call. Asking for a scope you don't use costs you user trust; calling a
   * method whose scope you didn't declare fails at runtime with `SCOPE_DENIED`.
   *
   * Watch the ones that look alike: `project.write.fileContent` covers rewriting the
   * contents of an existing file or doc, while CREATING one needs `project.write.files`
   * or `project.write.docs`.
   */
  type PluginScope =
    // Project — read
    | 'project.read'
    | 'project.read.characters'
    | 'project.read.worldbuilding'
    | 'project.read.files'
    | 'project.read.fileContent'
    | 'project.read.docs'
    | 'project.read.docContent'
    | 'project.read.notes'
    | 'project.read.plotgrid'
    | 'project.read.cardboards'
    | 'project.read.images'
    | 'project.read.collections'
    | 'project.read.tags'
    | 'project.read.analytics'
    | 'project.read.timelines'
    | 'project.read.flowmaps'
    | 'project.read.templates'
    | 'project.read.snapshots'
    | 'project.read.scenes'
    // Project — write
    | 'project.write.characters'
    | 'project.write.worldbuilding'
    | 'project.write.files'
    | 'project.write.fileContent'
    | 'project.write.docs'
    | 'project.write.notes'
    | 'project.write.plotgrid'
    | 'project.write.cardboards'
    | 'project.write.images'
    | 'project.write.tags'
    | 'project.write.timelines'
    | 'project.write.flowmaps'
    | 'project.write.collections'
    | 'project.write.scenes'
    // File system
    | 'fs.read'
    | 'fs.write'
    | 'fs.platform'
    // Backups
    | 'backup.create'
    | 'backup.restore'
    | 'backup.list'
    // Import / export
    | 'import.file'
    | 'export.file'
    | 'import.project'
    | 'export.book'
    | 'export.project'
    // UI
    | 'ui.sidebar'
    | 'ui.notification'
    | 'ui.dialog'
    | 'ui.contextMenu'
    | 'ui.window'
    // App settings
    | 'app.settings.read'
    | 'app.settings.write'
    // Misc
    | 'debug.console'
    | 'editor.read'
    | 'editor.write'
    | 'convert.format'
    | 'ai.summarize'
    | 'mcp.observe'
    | 'net.fetch'
    | 'media.control'
    | 'storage'
    | 'settings';

  /**
   * Scopes that grant other scopes automatically, so you don't have to declare both.
   * Mirrors the host's implicit-scope table.
   */
  type ImplicitScopeGrants = {
    'export.file': 'project.read.fileContent';
    'export.book': 'project.read.fileContent' | 'project.read.files';
    'export.project': `project.read${string}`;
    'import.file': 'project.write.fileContent';
    'import.project': 'project.write.fileContent' | 'project.write.files';
    'app.settings.write': 'app.settings.read';
    'editor.write': 'editor.read';
  };

  /** Legacy single-role declaration. Prefer `surfaces` + `capabilities` for new plugins. */
  type PluginType =
    | 'sidebar-panel'
    | 'app'
    | 'file-importer'
    | 'file-exporter'
    | 'project-importer'
    | 'project-exporter'
    | 'book-exporter'
    | 'tool';

  /** Where a plugin presents itself. A plugin may run on several at once. */
  type PluginSurface = 'sidebar' | 'app' | 'background' | 'dialog';

  /** What a plugin contributes to the app. */
  type PluginCapability =
    | 'file-import'
    | 'file-export'
    | 'project-import'
    | 'project-export'
    | 'book-export';

  type PluginSettingType = 'string' | 'number' | 'boolean' | 'select';

  /** One field of the settings form Tintero renders for your plugin. */
  interface PluginSettingDefinition {
    type: PluginSettingType;
    label: string;
    description?: string;
    required?: boolean;
    /** Masked in the settings UI. */
    secret?: boolean;
    default?: any;
    min?: number;
    max?: number;
    /** Choices for `type: 'select'`. */
    options?: string[];
  }

  interface PluginManifestAuthor {
    name: string;
    url?: string;
  }

  interface PluginManifestSidebarUI {
    /** HTML file rendered inside the panel, relative to the plugin root. */
    panel?: string;
    label: string;
    tooltip?: string;
    width?: number;
  }

  interface PluginManifestUI {
    sidebar?: PluginManifestSidebarUI;
    /** Reserved: the path is checked at install time, but Tintero does not show it yet. */
    settings?: string;
    dialog?: string;
  }

  interface PluginManifestImport {
    extensions: string[];
    formatName: string;
    formatDescription?: string;
  }

  interface PluginManifestExport {
    formatName: string;
    extension: string;
    mimeType?: string;
    formatDescription?: string;
  }

  interface PluginManifestNetwork {
    /**
     * Hosts `tintero.net.fetch` may reach. Exact hosts ("api.example.com") and
     * leading-wildcard subdomains ("*.example.com"); a bare "*" is rejected at install.
     * Redirects are NOT followed — the allow-list is checked on the URL you request.
     */
    domains: string[];
  }

  /**
   * The shape of your `plugin.json`.
   *
   * Type it in your own project to catch mistakes before packaging:
   * ```ts
   * const manifest: TinteroSDK.PluginManifest = require('./plugin.json');
   * ```
   */
  interface PluginManifest {
    /**
     * Reverse-DNS style id, e.g. "com.yourname.my-plugin". Lowercase letters, digits,
     * dots and hyphens; must start and end with a letter or digit. Doubles as the name of
     * the plugin's directory and its storage bucket, so it has to be unique.
     */
    id: string;
    name: string;
    version: string;
    description: string;
    author: PluginManifestAuthor;
    license?: string;
    minTinteroVersion?: string;
    type: PluginType;
    /** Explicit contributions. When omitted, both are derived from `type`. */
    surfaces?: PluginSurface[];
    capabilities?: PluginCapability[];
    /** Entry point JS, relative to the plugin root (e.g. "plugin.js"). A sibling
     *  ".css" with the same base name is injected automatically if present. */
    main: string;
    /** SVG icon, relative to the plugin root. PNG/JPG are not installed. */
    icon?: string;
    /** Suggested launch shortcut, e.g. "Ctrl+Shift+W". The user can override it. */
    shortcut?: string;
    scopes: PluginScope[];
    ui?: PluginManifestUI;
    settings?: {
      schema: Record<string, PluginSettingDefinition>;
    };
    import?: PluginManifestImport;
    export?: PluginManifestExport;
    /** Required when `scopes` includes 'net.fetch'. */
    network?: PluginManifestNetwork;
  }

  // ─── Errors ─────────────────────────────────────────────────

  /**
   * Codes the host attaches to a rejected API call. They also appear inside the rejected
   * promise's `message`, which is what you can match on:
   *
   * ```js
   * try { await tintero.project.getCharacters(); }
   * catch (err) { if (err.message.includes('SCOPE_DENIED')) { ... } }
   * ```
   */
  type PluginErrorCode =
    /** The plugin's approved scopes don't cover this method. */
    | 'SCOPE_DENIED'
    /** More than 100 API calls in one second. */
    | 'RATE_LIMITED'
    /** Call arguments exceeded 5 MB. */
    | 'PAYLOAD_TOO_LARGE'
    /** `net.fetch` target is outside `network.domains`, or the request was rejected. */
    | 'NETWORK_DENIED'
    | 'UNKNOWN';

  // ─── Data Types ─────────────────────────────────────────────

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
    /** Reference to the element's portrait image (fileName or relativePath). Resolve with `tintero.project.getImageData()`. */
    portrait?: string;
    /** Reference to the element's landscape/banner image (fileName or relativePath). Resolve with `tintero.project.getImageData()`. */
    landscape?: string;
    isFavorite?: boolean;
    tags?: string[];
    color?: string;
    createdAt: number;
    updatedAt?: number;
    notes?: string;
    extraFields?: { id: string; label: string; type: 'text' | 'textarea'; value: string }[];
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
    /** For image cells: reference to the image (fileName or relativePath). Resolve with `tintero.project.getImageData()`. */
    imageUrl?: string;
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
    /** Creation timestamp in epoch milliseconds. */
    createdAt?: number;
  }

  interface WritingGoal {
    id: string;
    /** "words" | "chapters" | "chaptersCreated" | "characters" | "worldbuilding" | "streak" | "minutes" */
    type: string;
    /** "daily" | "weekly" | "monthly" | "total" */
    cadence: string;
    target: number;
    title?: string;
    createdAt: number;
    /** Soft-delete marker; archived goals are kept for sync merges. */
    archivedAt?: number | null;
  }

  interface WordCountLog {
    /** Start-of-day epoch ms for the logged day. */
    dayTimestamp: number;
    count: number;
    objective: number;
  }

  interface WritingMinutesLog {
    /** Start-of-day epoch ms for the logged day. */
    dayTimestamp: number;
    minutes: number;
  }

  interface TimelineNote {
    id: string;
    text: string;
    color: string;
    position: number;
  }

  interface TimelineBlock {
    id: string;
    fileId: string;
    sceneId?: string;
    childTimelineId?: string;
    startCol: number;
    spanCols: number;
    color?: string;
    /** Linked project character id. */
    characterId?: string;
    /** Linked project worldbuilding element id. */
    worldbuildingId?: string;
  }

  interface TimelineLane {
    id: string;
    name: string;
    collapsed: boolean;
    customHeight?: number;
    blocks: TimelineBlock[];
    notes: TimelineNote[];
    milestones: TimelineNote[];
  }

  interface Timeline {
    id: string;
    name: string;
    parentId?: string;
    lanes: TimelineLane[];
    unassignedNotes: TimelineNote[];
    customWidth?: number;
    createdAt: number;
    lastModified: number;
  }

  interface FlowMapTodo {
    id: string;
    text: string;
    done: boolean;
  }

  interface FlowMapNode {
    id: string;
    label: string;
    x: number;
    y: number;
    /**
     * "circle" | "square" | "rounded" | "diamond" | "document" | "todo-list" | "simple-list"
     * | "note" | "character" | "worldbuilding" | custom string
     */
    type: string;
    color: string;
    /** Small heading the writer typed above the node's text ("DECISION", "ACT II"). */
    title?: string;
    /** Padding inside the node, in pixels, when the writer set it by hand. */
    padding?: number;
    extendedText?: string;
    noteColor?: string;
    /** Linked project document fileId. */
    linkedDocument?: string;
    /** Linked project character id. */
    linkedCharacterId?: string;
    /** Linked project worldbuilding element id. */
    linkedWorldbuildingId?: string;
    todoList?: FlowMapTodo[];
    width?: number;
    height?: number;
    customData?: any;
  }

  interface FlowMapConnection {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    /** "simple" | "bidirectional" | "unidirectional-forward" | "unidirectional-backward" | "dotted" */
    arrowType: string;
    label?: string;
    startEdgePosition?: number;
    endEdgePosition?: number;
    color?: string;
  }

  interface FlowMap {
    id: string;
    name: string;
    nodes: FlowMapNode[];
    connections: FlowMapConnection[];
    createdAt: number;
    lastModified: number;
  }

  /**
   * What `project.updateFlowMap()` replaces. Nodes and connections go together: a flow map travels
   * to sync as one whole entity, so there is no cheaper node-by-node write.
   */
  interface FlowMapUpdate {
    nodes: FlowMapNode[];
    connections: FlowMapConnection[];
  }

  interface CustomFieldDef {
    id: string;
    name: string;
    label: string;
    /** "text" | "textarea" | "checkbox" | "relationship" */
    type: string;
    placeholder?: string;
    description?: string;
    defaultValue?: any;
    order?: number;
  }

  interface CustomWorldbuildingTemplate {
    id: string;
    name: string;
    description?: string;
    icon: string;
    color: string;
    fields: CustomFieldDef[];
    createdAt: number;
    updatedAt: number;
    archived?: boolean;
    tags?: string[];
    version?: number;
  }

  interface FileSnapshot {
    id: string;
    location: string;
    name: string;
    createdAt: number;
    writingMode?: WritingMode;
  }

  interface Scene {
    id: string;
    name?: string;
    povCharacterId: string | null;
    charactersInScene?: string[] | null;
    objectsInScene?: string[] | null;
    /** "main_continuity" | "flashback" | "dream" | "vision" | "memory" | "prologue" | "epilogue" | "interlude" | "montage" */
    type: string;
    locationId: string | null;
    createdAt: number;
    updatedAt: number;
    startOffset?: number;
    endOffset?: number;
    notes?: string;
  }

  interface BackupEntry {
    id: string;
    /**
     * Internal folder identifier. Since 0.10.x it equals `id` for new backups; it is NOT the text
     * passed to `backup.create()` (that goes to `label`). Look backups up by `id`, not by `name`.
     */
    name: string;
    /** User-visible label (the `name` given to `backup.create()`). Absent on older or unlabeled backups. */
    label?: string;
    timestamp: number;
    observations?: string;
    type: 'automatic' | 'manual';
  }

  // ─── Write input types ────────────────────────────────────

  /** A marked moment on a timeline: a turning point, a climax. Drawn across every lane. */
  interface TimelineMilestone {
    id: string;
    text: string;
    color: string;
    /** The column it sits at. */
    position: number;
  }

  /** A named stretch of a timeline's axis: an act, a part, a season. */
  interface TimelineSegment {
    id: string;
    name: string;
    startCol: number;
    spanCols: number;
    color?: string;
  }

  /**
   * A block to put on a timeline lane. The id is assigned by Tintero, not by you.
   * `kind: 'document'` (the default) needs `fileId`; `kind: 'event'` needs `eventId`, the id of a
   * worldbuilding element of type event.
   */
  interface TimelineBlockInput {
    kind?: 'document' | 'event';
    fileId?: string;
    sceneId?: string;
    eventId?: string;
    /** Column the block starts at. Defaults to 0. */
    startCol?: number;
    /** How many columns it covers. Defaults to 1. */
    spanCols?: number;
    color?: string;
    characterId?: string;
    worldbuildingId?: string;
  }

  /** A node to add to a flow map. The id is assigned by Tintero. */
  interface FlowMapNodeInput {
    label: string;
    /** Canvas position in pixels. Both default to 0, which stacks nodes on top of each other. */
    x?: number;
    y?: number;
    /** Shape. Defaults to "rounded". */
    type?: string;
    color?: string;
    title?: string;
    extendedText?: string;
    linkedDocument?: string;
    linkedCharacterId?: string;
    linkedWorldbuildingId?: string;
  }

  /** An arrow to add to a flow map. Both node ids must already exist. */
  interface FlowMapConnectionInput {
    fromNodeId: string;
    toNodeId: string;
    /** Defaults to "unidirectional-forward". */
    arrowType?: string;
    label?: string;
    color?: string;
  }

  /** A scene to create inside a chapter. The id and the timestamps are assigned by Tintero. */
  interface SceneInput {
    name?: string;
    povCharacterId?: string | null;
    /** Defaults to "scene". See Scene.type for the values. */
    type?: string;
    locationId?: string | null;
    charactersInScene?: string[] | null;
    objectsInScene?: string[] | null;
    notes?: string;
  }

  interface CharacterInput {
    name: string;
    firstName?: string;
    lastName?: string;
    pronouns?: string[];
    aka?: string[];
    physicalDescription?: string;
    psychologicalDescription?: string;
    /** Reference to the character's portrait image (fileName or relativePath). */
    portrait?: string;
    /** Reference to the character's landscape/banner image (fileName or relativePath). */
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
    visibleSidebarBoards?: boolean;
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
    /** Receives the file content as a ProseMirror/TipTap JSON string. Use `JSON.parse()` or `tintero.convert` to work with it. */
    convert: (jsonContent: string) => string | ExportResult | Promise<string | ExportResult>;
  }

  interface BookExporterConfig {
    formatName: string;
    extension: string;
    mimeType?: string;
    /** Each element of `documents` is a ProseMirror/TipTap JSON string for one file. */
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
    | 'flowmap.added'
    | 'flowmap.updated'
    | 'flowmap.deleted'
    | 'mcp.activity'
    | 'editor.selectionChanged'
    | 'editor.activeDocumentChanged'
    | 'plugin.activated'
    | 'plugin.deactivated'
    | 'storage.changed'
    | 'debug.log';

  /** Payload for `flowmap.added`: a flow map was created, by the writer or by a plugin. */
  interface FlowMapAddedEvent {
    flowMapId: string;
    name?: string;
  }

  /** Payload for `flowmap.updated`: a flow map's name, nodes or connections changed. */
  interface FlowMapUpdatedEvent {
    flowMapId: string;
    name?: string;
  }

  /** Payload for `flowmap.deleted`. */
  interface FlowMapDeletedEvent {
    flowMapId: string;
  }

  /**
   * Payload for `mcp.activity` (scope `mcp.observe`): the external AI agent connected over MCP just
   * called a tool. Sent after the call, whether it worked, was denied or failed. Never sent for
   * calls made by plugins, and never carries the tool's arguments (they can hold whole chapters).
   */
  interface McpActivityEvent {
    /** The MCP tool, e.g. `update_file_content`. */
    toolName: string;
    kind: 'read' | 'write';
    /** `denied`: the writer has not granted that permission. `error`: anything else. */
    outcome: 'ok' | 'denied' | 'error';
    /** How far it reaches: some items, a sweep (listings) or the whole project (save, backups). */
    scope: 'nodes' | 'sweep' | 'project';
    /** What it touched, when known. Empty when the tool does not point at anything specific. */
    targets: { type: 'document' | 'character' | 'worldbuilding' | 'folder'; id: string }[];
    /** How the agent introduced itself ("Claude Code"), if it did. */
    clientName: string | null;
    durationMs: number;
    /** Why it failed, in one line. Only when `outcome` is not `ok`. */
    reason?: string;
    /** Epoch ms. */
    at: number;
  }

  /** Payload for `editor.selectionChanged` event. Does not include selected text — use `editor.getSelection()` for that. */
  interface EditorSelectionChangedEvent {
    documentId: string;
    from: number;
    to: number;
    empty: boolean;
  }

  /** Payload for `storage.changed`: another surface of this same plugin wrote to storage. */
  interface StorageChangedEvent {
    /** Key that changed, when the mutation targeted a single key. */
    key?: string;
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
     * Get the raw content of a file by its ID.
     *
     * Returns the file content as a **ProseMirror/TipTap JSON string** (the internal
     * document format), or `null` if the file does not exist or has no content.
     *
     * You must `JSON.parse()` the result to obtain a `ProseMirrorDocument` object,
     * or pass the raw string directly to `tintero.convert.toHtml()` / `toMarkdown()` /
     * `toText()` — those methods accept both the raw string and a parsed object.
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

    /** Get the raw content of a document by its ID. Returns a ProseMirror/TipTap JSON string, or null. Same format as `getFileContent()`. */
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

    /** Get the user's writing goals (words/chapters/minutes targets). Read-only. */
    getWritingGoals(): Promise<WritingGoal[]>;

    /** Get the per-day word count log. Read-only. */
    getWordCountLog(): Promise<WordCountLog[]>;

    /** Get the per-day writing-minutes log. Read-only. */
    getWritingMinutesLog(): Promise<WritingMinutesLog[]>;

    /** Get all timelines (lanes, blocks, notes, milestones). Read-only. */
    getTimelines(): Promise<Timeline[]>;

    /** Get all flow maps (nodes and connections). Requires `project.read.flowmaps`. */
    getFlowMaps(): Promise<FlowMap[]>;

    /** Get one flow map by its ID, or `null` if it does not exist. Requires `project.read.flowmaps`. */
    getFlowMapById(flowMapId: string): Promise<FlowMap | null>;

    /** Create an empty flow map. Requires `project.write.flowmaps`. */
    createFlowMap(name: string): Promise<FlowMap>;

    /** Rename a flow map. Requires `project.write.flowmaps`. */
    renameFlowMap(flowMapId: string, name: string): Promise<FlowMap>;

    /** Delete a flow map. Requires `project.write.flowmaps`. */
    deleteFlowMap(flowMapId: string): Promise<boolean>;

    /**
     * Replace a flow map's nodes and connections. The payload is validated in full BEFORE anything
     * is written, so a malformed one leaves the project untouched: ids must be unique strings, every
     * connection must point at a node in the same payload, coordinates must be finite numbers and
     * colours must be plain CSS colours. Requires `project.write.flowmaps`.
     */
    updateFlowMap(flowMapId: string, update: FlowMapUpdate): Promise<FlowMap>;

    /** Get the project's custom worldbuilding templates. Read-only. */
    getCustomWorldbuildingTemplates(): Promise<CustomWorldbuildingTemplate[]>;

    /** Get the version snapshots of a file by its ID. Read-only. */
    getFileSnapshots(fileId: string): Promise<FileSnapshot[]>;

    /** Get the scenes defined within a file by its ID. Read-only. */
    getScenes(fileId: string): Promise<Scene[]>;


    /**
     * Search the chapter PROSE (not the metadata) for a term, matching whole words and ignoring
     * accents. Returns the chapters where it occurs, how many times, and a few excerpts around the
     * matches. Use it to answer "where/how does X appear" when the metadata is not enough.
     *
     * Bounded on purpose: `maxChapters` (250 by default) keeps a large manuscript from being read
     * end to end on every call. Pass several forms of the same name (full name, first name) as an
     * array to match any of them in one pass.
     */
    searchProse(term: string | string[], options?: ProseSearchOptions): Promise<ProseSearchHit[]>;

    /** Update an existing character's fields. Only provided fields are changed. */
    updateCharacter(id: string, data: Partial<CharacterInput>): Promise<void>;

    /** Create a new character. Requires at least `name`. */
    addCharacter(data: CharacterInput): Promise<Character>;

    /**
     * Save an image (a base64 string or a `data:` URI) into the project and return
     * a reference to the saved image — assign it to a character/worldbuilding
     * `portrait` or `landscape`. Requires the `project.write.images` scope. Pairs
     * with `net.fetch({ responseType: 'base64' })` to import a remote image.
     */
    addImage(data: string, fileName?: string): Promise<string>;

    /** Create a new worldbuilding element. Requires `name` and `type`. */
    addWorldbuildingElement(data: WorldbuildingInput): Promise<WorldbuildingElement>;

    /** Update an existing worldbuilding element. */
    updateWorldbuildingElement(id: string, data: Partial<WorldbuildingInput>): Promise<void>;

    /** Delete a worldbuilding element by ID. */
    removeWorldbuildingElement(id: string): Promise<void>;

    /**
     * Update the content of a file.
     *
     * `jsonContent` must be a **ProseMirror/TipTap JSON string** — i.e. the result of
     * `JSON.stringify(proseMirrorDocumentObject)`. To build a document from other formats,
     * use `tintero.convert.fromHtml()`, `fromMarkdown()`, or `fromText()` first, then
     * `JSON.stringify()` the returned object before passing it here.
     */
    updateFileContent(fileId: string, jsonContent: string): Promise<void>;

    /** Update the content of a document. Same format as `updateFileContent()`. */
    updateDocContent(docId: string, jsonContent: string): Promise<void>;

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

  /**
   * Derived questions about the manuscript, the ones that resolve "chapter 5" or a character by
   * name. Everything here returns READY-MADE ENGLISH TEXT meant to be read by a language model, not
   * structured data: it is the same knowledge Tintero's own AI uses. For raw entities, use
   * `project.*`.
   */
  interface KnowledgeAPI {
    /** Every chapter with its number, status, length, whether it has a summary, and its characters. */
    listChapters(): Promise<string>;

    /** Resolve a chapter by number ("chapter 7"), id, or a fragment of its title. */
    findChapter(reference: string): Promise<string>;

    /** The author-written synopsis of a chapter. Cheap: prefer it over the full prose. */
    getChapterSynopsis(chapter: string): Promise<string>;

    /** The prose of a chapter resolved by reference, clipped to 20.000 characters. */
    getChapterText(chapter: string): Promise<string>;

    /**
     * A summary of a chapter the author never summarised, generated on demand.
     *
     * Scopes: `ai.summarize` AND `project.read.fileContent` (the summary is derived from the prose).
     * It calls the AI server configured in Tintero's settings, so it costs
     * the user time and quota; returns the author's own summary when there is one, without calling
     * any model.
     */
    summarizeChapter(chapter: string): Promise<string>;

    /** The chapters a character appears in, according to the project metadata. */
    chaptersWithCharacter(character: string): Promise<string>;

    /** Appearance counts per character, most frequent first. With an argument, that character's chapters. */
    characterAppearanceCounts(character?: string): Promise<string>;

    /** The full profile of a character (traits, backstory, goals, fears) by id or name. */
    getCharacterProfile(character: string): Promise<string>;

    /** A character's relationships with other characters, with the names resolved. */
    getCharacterRelationships(character: string): Promise<string>;

    /** The full profile of a worldbuilding element by id or name. */
    getWorldbuildingProfile(element: string): Promise<string>;

    /** The text of a non-chapter document (synopsis, world bible) by id, name or title fragment. */
    getDocument(document: string): Promise<string>;
  }

  /**
   * WRITING the structure around the prose: timelines, flow maps, collections, scenes, and the rest
   * of a note's life (`project.addNote` still creates it).
   *
   * Every call goes through Tintero's own services, so the change is saved, synced and visible in
   * the open view without a reload. Cardboards and plot grids are not here yet.
   */
  interface StructureAPI {
    /** Creates a timeline and returns it. `parentId` hangs it off a block of another timeline. */
    createTimeline(name: string, parentId?: string): Promise<Timeline>;

    /** Deletes a timeline and everything on it. */
    deleteTimeline(timelineId: string): Promise<void>;

    /** Adds a lane (one strand of the story) and returns it. */
    addTimelineLane(timelineId: string, name: string): Promise<TimelineLane>;

    /**
     * Puts a chapter, a scene or a worldbuilding event on a lane. A `document` block needs
     * `fileId`; an `event` block needs `eventId`. The id of the block is assigned by Tintero.
     */
    addTimelineBlock(timelineId: string, laneId: string, block: TimelineBlockInput): Promise<TimelineBlock>;

    /** Removes a block from a lane. */
    removeTimelineBlock(timelineId: string, laneId: string, blockId: string): Promise<void>;

    /** Adds a milestone across every lane (a turning point, a climax). */
    addTimelineMilestone(timelineId: string, milestone: { text: string; position: number; color?: string }): Promise<TimelineMilestone>;

    /** Names a stretch of the axis: an act, a part, a season. */
    addTimelineSegment(timelineId: string, segment: { name: string; startCol: number; spanCols: number; color?: string }): Promise<TimelineSegment>;

    /** Sets how the axis is labelled. These are labels, never real dates. Pass null to unset it. */
    setTimelineAxis(timelineId: string, axis: { unit?: string; start: number; step: number } | null): Promise<void>;

    /** Creates a flow map and returns it. */
    createFlowMap(name: string): Promise<FlowMap>;

    /** Deletes a flow map with its nodes and arrows. */
    deleteFlowMap(flowMapId: string): Promise<void>;

    /** Renames a flow map. */
    renameFlowMap(flowMapId: string, name: string): Promise<void>;

    /** Adds a node to a flow map and returns it, with the id Tintero assigned. */
    addFlowMapNode(flowMapId: string, node: FlowMapNodeInput): Promise<FlowMapNode>;

    /** Removes a node. Arrows that pointed at it are left dangling, so remove them too. */
    removeFlowMapNode(flowMapId: string, nodeId: string): Promise<void>;

    /** Joins two existing nodes with an arrow. Both node ids must exist or the call fails. */
    addFlowMapConnection(flowMapId: string, connection: FlowMapConnectionInput): Promise<FlowMapConnection>;

    /** Removes an arrow. */
    removeFlowMapConnection(flowMapId: string, connectionId: string): Promise<void>;

    /** Creates a note collection and returns it. */
    createCollection(name: string): Promise<Collection>;

    /** Deletes a collection. The chapters and documents in it are not deleted. */
    deleteCollection(collectionId: string): Promise<void>;

    /** Renames a collection. */
    renameCollection(collectionId: string, name: string): Promise<void>;

    /** Puts a chapter (`file`) or a document (`doc`) into a collection. */
    addToCollection(collectionId: string, itemId: string, itemType: 'file' | 'doc'): Promise<void>;

    /** Takes an item out of a collection. */
    removeFromCollection(collectionId: string, itemId: string, itemType: 'file' | 'doc'): Promise<void>;

    /** Creates a scene inside a chapter. Unlike the editor's own dialog, it needs the chapter id. */
    createScene(fileId: string, scene: SceneInput): Promise<Scene>;

    /** Edits a scene. Only the fields you pass change. */
    updateScene(sceneId: string, updates: Partial<SceneInput>): Promise<Scene | null>;

    /** Deletes a scene from the chapter that owns it. */
    deleteScene(sceneId: string): Promise<void>;

    /** Rewrites a note's body and colour. The body hash is resealed, which is what sync compares. */
    updateNote(noteId: string, data: { content: string; type?: string }): Promise<void>;

    /** Deletes a note and its body. */
    deleteNote(noteId: string): Promise<void>;
  }

  interface FileSystemAPI {
    /**
     * Get the current platform as a compound string: `"<os> | <runtime>"`.
     * Examples: `"darwin | Desktop"`, `"win32 | Desktop"`, `"linux | Desktop"`,
     * `"ios | Mobile"`, `"android | Mobile"`, `"unknown | Web"`.
     */
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
    /**
     * Create a backup. Returns the backup ID — keep it to find the backup later.
     * `name` becomes the user-visible `label` (empty or blank = no label); the entry's `name` is an
     * internal folder id, so `list().find(b => b.name === name)` no longer finds it.
     */
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

    /**
     * Open an item of the project in Tintero, as if the user had clicked it in the file tree.
     * If it is already open, its tab becomes the active one.
     * Works with the ids of documents, characters, worldbuilding elements, images, audio and PDFs:
     * the id alone identifies the kind, so there is no type to pass.
     * It takes the user to the editor. Called from an `app` view, that view is hidden, not
     * destroyed: it keeps running and its state is intact if the user comes back within 10 minutes
     * (and without opening another project in between).
     * Rejects if nothing in the open project has that id, and when called from an `app` view the
     * user has left (hidden): a view nobody is looking at cannot move them elsewhere.
     */
    open(id: string): Promise<void>;

    // ── Write (scope: editor.write) ──

    /**
     * Insert HTML content at a specific position in the active editor.
     * @param position ProseMirror document position (obtain from getSelection()).
     * @param html     HTML string (parsed through the editor's ProseMirror schema).
     */
    insertAt(position: number, html: string): Promise<void>;

    /**
     * Insert a read-only block showing one of the project's flow maps.
     * @param flowMapId The flow map to show. It must exist.
     * @param position  ProseMirror document position; without it, the current selection.
     */
    insertFlowMap(flowMapId: string, position?: number): Promise<void>;

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
     * Accepts a parsed `ProseMirrorDocument` object **or** a raw JSON string
     * (as returned by `getFileContent()`).
     */
    toText(json: ProseMirrorDocument | string): Promise<string>;

    /**
     * Convert ProseMirror JSON to clean HTML.
     * Returns HTML fragment (no `<html>`/`<body>` wrapper).
     * Supports headings, paragraphs, lists, bold, italic, links, images.
     * Accepts a parsed `ProseMirrorDocument` object **or** a raw JSON string.
     */
    toHtml(json: ProseMirrorDocument | string): Promise<string>;

    /**
     * Convert ProseMirror JSON to Markdown.
     * Uses ATX-style headings (`#`), `**bold**`, `*italic*`, `[links](url)`.
     * Accepts a parsed `ProseMirrorDocument` object **or** a raw JSON string.
     */
    toMarkdown(json: ProseMirrorDocument | string): Promise<string>;

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

  interface NetFetchOptions {
    /** HTTP method. Defaults to `'GET'`. Allowed: GET, POST, PUT, PATCH, DELETE, HEAD. */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
    /** Request headers. */
    headers?: Record<string, string>;
    /** Request body (already serialized as a string) for non-GET/HEAD methods. */
    body?: string;
    /** How to decode the response body. Defaults to `'text'`. Use `'base64'` to
     *  fetch binary (e.g. an image): the host proxies the request and returns the
     *  bytes base64-encoded, so you can render it as a `data:` URI without relaxing
     *  the plugin CSP. */
    responseType?: 'text' | 'json' | 'base64';
  }

  interface NetFetchResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    /** Decoded body: a string for `'text'`, a parsed value for `'json'`, a base64 string for `'base64'`. */
    body: any;
  }

  interface NetworkAPI {
    /**
     * Perform an HTTP request to an external host (proxied by the host app).
     *
     * Requires the `net.fetch` scope **and** the target host must be listed in
     * the plugin manifest's `network.domains` allow-list (the user approves
     * those domains at install time). Requests to any other host are rejected.
     * Supports exact hosts and leading-wildcard subdomains (`*.example.com`).
     */
    fetch(url: string, options?: NetFetchOptions): Promise<NetFetchResponse>;
  }

  interface MediaNowPlaying {
    title?: string;
    videoId?: string;
  }

  interface MediaAPI {
    /** Play a public YouTube video or playlist (URL or id) in the host's background player. */
    play(source: string): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    stop(): Promise<void>;
    next(): Promise<void>;
    previous(): Promise<void>;
    /** Set the volume, 0–100. */
    setVolume(volume: number): Promise<void>;
    getNowPlaying(): Promise<MediaNowPlaying | null>;
    getState(): Promise<'idle' | 'playing' | 'paused' | 'buffering' | 'ended'>;
  }

  /**
   * WRITING the boards: the cardboard (a corkboard of cards in rows and columns) and the plot grids
   * (a table of chapters against plot lines). Reading them is `project.getCardboards()` and
   * `project.getPlotGrids()`. Every call goes through Tintero's own services, so the change is
   * saved, synced and visible in the open panel without a reload.
   */
  interface BoardsAPI {
    /** Creates a cardboard with empty cells and returns it. `rows` and `cols` default to 3. */
    createCardboard(name: string, rows?: number, cols?: number): Promise<CardboardGrid>;

    /** Renames a cardboard. */
    renameCardboard(gridId: string, name: string): Promise<void>;

    /** Deletes a cardboard with every card on it. */
    deleteCardboard(gridId: string): Promise<void>;

    /** Adds an empty row at the bottom. */
    addCardboardRow(gridId: string): Promise<void>;

    /** Adds an empty column at the right. */
    addCardboardColumn(gridId: string): Promise<void>;

    /** Deletes a row and its cards. The rows below move up. A cardboard keeps at least one row. */
    deleteCardboardRow(gridId: string, rowIndex: number): Promise<void>;

    /** Deletes a column and its cards. The columns to the right move left. */
    deleteCardboardColumn(gridId: string, colIndex: number): Promise<void>;

    /** Labels a row or a column (an act, a character arc). An empty label removes the header. */
    setCardboardHeader(gridId: string, axis: 'row' | 'col', index: number, label: string, color?: string): Promise<void>;

    /** Changes the title, status, tags or color of a card. Other fields are ignored. */
    updateCardboardCell(gridId: string, cellId: string, patch: { title?: string; status?: string; tags?: string[]; color?: string }): Promise<CardboardCell>;

    /** Pins a chapter, doc, character or worldbuilding element to a card. The target must exist. */
    addCardboardReference(gridId: string, cellId: string, refType: 'chapter' | 'doc' | 'character' | 'worldbuilding', targetId: string): Promise<CardboardCell>;

    /** Unpins a reference from a card. A card left empty goes back to unassigned. */
    removeCardboardReference(gridId: string, cellId: string, referenceId: string): Promise<CardboardCell>;

    /** Adds a sticky note or a checkbox to a card. Image, audio and pdf notes need an asset and are not available here. */
    addCardboardNote(gridId: string, cellId: string, note: { kind: 'sticky' | 'checkbox'; title?: string; content?: string; color?: string; checked?: boolean }): Promise<CardboardCell>;

    /** Removes a note from a card. */
    deleteCardboardNote(gridId: string, cellId: string, noteId: string): Promise<CardboardCell>;

    /** Creates a plot grid with the chapters column and two empty plot columns, three rows. */
    createPlotGrid(name: string): Promise<PlotGrid>;

    /** Renames a plot grid. */
    renamePlotGrid(gridId: string, name: string): Promise<void>;

    /** Deletes a plot grid with everything in it. */
    deletePlotGrid(gridId: string): Promise<void>;

    /** Adds a plot column at the right and returns it. */
    addPlotGridColumn(gridId: string, name?: string): Promise<PlotGridColumn>;

    /** Renames a column. */
    renamePlotGridColumn(gridId: string, columnId: string, name: string): Promise<void>;

    /** Deletes a column and its cells. The chapters column (position 0) cannot be deleted. */
    deletePlotGridColumn(gridId: string, columnId: string): Promise<void>;

    /** Adds a row at the bottom. */
    addPlotGridRow(gridId: string): Promise<void>;

    /** Deletes a row and its cells. The rows below move up, and so do the banners anchored below it. */
    deletePlotGridRow(gridId: string, rowIndex: number): Promise<void>;

    /**
     * Sets the cell of a column and a row, creating it if needed. A `chapter` cell only fits in the
     * chapters column (position 0) and needs the chapter id in `referenceId`; a `note` cell fits anywhere else.
     */
    setPlotGridCell(gridId: string, columnId: string, rowIndex: number, cell: { type: 'unassigned' | 'chapter' | 'note'; referenceId?: string; content?: string; color?: string }): Promise<PlotGridCell>;

    /** Empties a cell. */
    clearPlotGridCell(gridId: string, cellId: string): Promise<void>;

    /** Adds a banner above a row (an act, a part). `rowIndex` equal to the row count puts it after the last row. */
    addPlotGridRowNote(gridId: string, rowIndex: number, note?: { content?: string; color?: string; height?: number }): Promise<{ id: string; rowIndex: number; content: string; color?: string; height?: number }>;

    /** Changes the text, color or height of a banner. */
    updatePlotGridRowNote(gridId: string, noteId: string, changes: { content?: string; color?: string; height?: number }): Promise<void>;

    /** Deletes a banner. */
    deletePlotGridRowNote(gridId: string, noteId: string): Promise<void>;

    /** Swaps a row with the one above or below. */
    movePlotGridRow(gridId: string, rowIndex: number, direction: 'up' | 'down'): Promise<boolean>;

    /** Swaps a plot column with its neighbour. The chapters column stays where it is. */
    movePlotGridColumn(gridId: string, columnId: string, direction: 'left' | 'right'): Promise<boolean>;
  }

  // ─── Main API object ──────────────────────────────────────

  interface TinteroAPI {
    project: ProjectAPI;
    /** Derived questions answered in prose: chapters and characters resolved by name. */
    knowledge: KnowledgeAPI;
    /** Writing the structure around the prose: timelines, flow maps, collections, scenes, notes. */
    structure: StructureAPI;
    /** Writing the boards: the cardboard and the plot grids. */
    boards: BoardsAPI;
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
    /** Which surface this plugin instance is rendering on (a plugin can run several at once). */
    surface: 'sidebar' | 'app' | 'background' | 'dialog';
    /** Proxied HTTP access to the hosts declared in `network.domains`. */
    net: NetworkAPI;
    /** Control the host's background media player (public YouTube playback). */
    media: MediaAPI;
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

/** Options for `project.searchProse()`. They exist so a search cannot read the whole manuscript. */
interface ProseSearchOptions {
    /** Maximum chapters to read. Defaults to 250. */
    maxChapters?: number;
    /** Maximum excerpts returned per chapter. Defaults to 3. */
    maxExcerptsPerChapter?: number;
    /** Restrict the search to these chapters. Omitted, it searches all of them. */
    chapterIds?: string[];
}

/** A chapter where the searched term occurs, with excerpts of the prose around the matches. */
interface ProseSearchHit {
    chapterId: string;
    title: string;
    /** Position of the chapter in the manuscript. */
    order: number;
    /** Whole-word occurrences across the whole chapter. */
    count: number;
    excerpts: string[];
}
