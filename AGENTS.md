# Tintero Project Guide for AI Agents

**Tintero** is a **cross-platform creative writing application** (v0.9.8+) that helps writers manage complex projects with distraction-free writing modes, character management, worldbuilding, and project organization.

## 🏗️ Architecture

This is a **monorepo** with multiple interconnected components:

```
Tintero Ecosystem
├── Tinteros-App/           [Mobile/Desktop app - React Native + Expo/Tauri]
├── Plugins/                [Extensibility layer - Sidebar panels]
│   ├── Full-focus-mode     [Writing sprint timer + immersive fullscreen]
│   ├── World-Codex         [Auto-generated wiki from project data]
│   └── Dev-console         [Logging & debugging utilities]
├── Themes/                 [CSS customization layer]
├── Releases/               [Multi-platform binaries & artifacts]
└── Registry Files          [plugin-list.json, theme-list.json]
```

**Core Relationship**:
- **Tinteros-App** = Host runtime (manages projects & filesystem)
- **Plugins** = Feature extensions (load into sidebar via `window.tintero` SDK)
- **Themes** = UI skinning (CSS variable overrides)
- **Releases** = Distribution (signed Tauri binaries)

## 🛠️ Tech Stack

| Component | Stack |
|-----------|-------|
| **Modern Plugins** | React 19 + TypeScript 5.9 + Vite 7 + Tailwind 4 |
| **Legacy Plugins** | Vanilla JavaScript (no build process) |
| **Mobile App** | React Native 0.63 + Expo 40 + Firebase |
| **Themes** | CSS3 with custom properties + JSON metadata |

### Plugin Build Stack Details

```
Compilation: TypeScript → JavaScript
Bundling:    Vite (single plugin.js file)
Styling:     CSS injected into JS bundle (via vite-plugin-css-injected-by-js)
Modules:     React + React-DOM + dependencies (Framer Motion, Recharts, etc.)
Transpiling: ES2020+ → browser-compatible
```

## 📦 Build & Development Commands

### Modern Plugins (Full-focus-mode, World-Codex)

```bash
npm run dev      # Start Vite dev server with HMR (Hot Module Replacement)
npm run build    # Type-check (tsc -b) + bundle with Vite
npm run lint     # ESLint static analysis
npm run preview  # Serve optimized build locally
```

**Makefile targets:**
```bash
make build       # npm run build
make package     # build + copy metadata + create plugin.zip
make clean       # Remove dist/ and plugin.zip
```

### Legacy Plugins (Dev-console)

```bash
make package     # Create plugin.zip (no build needed)
make clean       # Remove plugin.zip
```

### Mobile App (Tinteros-App)

```bash
npm run android  # Build & run on Android emulator/device
npm run ios      # Build & run on iOS simulator
npm run web      # Launch web version via Expo Web
npm run test     # Jest test suite
```

## 📁 File Structure Convention

All modern plugins follow this structure:

```
plugin-name/
├── src/
│   ├── main.tsx              # Entry point (root mounting)
│   ├── App.tsx               # Root component (phase routing)
│   ├── index.css             # Global styles
│   ├── components/           # React components (PascalCase)
│   ├── engine/               # Business logic (camelCase utilities)
│   ├── hooks/                # Custom React hooks (useXxx.ts)
│   ├── phases/               # UI screens/states (Setup → Countdown → Writing → Results)
│   ├── types/                # TypeScript interfaces (types.ts)
│   └── sdk/                  # Mock SDK for dev testing (World-Codex pattern)
├── public/
│   └── panel.html            # Sidebar panel template
├── plugin.json               # Plugin manifest (metadata, scopes, UI config)
├── icon.svg                  # Plugin icon (sidebar display)
├── vite.config.ts            # Build configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS setup
├── postcss.config.js         # PostCSS for Tailwind
├── eslint.config.js          # ESLint rules
├── Makefile                  # Build shortcuts
└── package.json              # Dependencies & scripts
```

## 🔌 Plugin SDK Reference

All plugins access the host app via `window.tintero` global object. **Always check if it exists:**

```typescript
if (!window.tintero) {
  console.error('Tintero SDK not available');
  return;
}
```

### Core API Surface

```typescript
window.tintero = {
  // UI Control
  ui: {
    hideSidebar(): Promise<void>,
    showSidebar(): Promise<void>,
    isFullscreen(): Promise<boolean>,
    enterFullscreen(): Promise<void>,
    exitFullscreen(): Promise<void>,
    toggleFullscreen(): Promise<void>,
    showNotification(msg: string): Promise<void>,
    // ... dialog, theme controls
  },

  // Project Data Access
  project: {
    read(): Promise<ProjectMetadata>,
    readFiles(): Promise<File[]>,
    readFile(path: string): Promise<string>,
    writeFile(path: string, content: string): Promise<void>,
    readCharacters(): Promise<Character[]>,
    readWorldbuilding(): Promise<Worldbuilding>,
    readTags(): Promise<Tag[]>,
    // ... more methods
  },

  // Plugin-Local Storage
  storage: {
    get(key: string): Promise<any>,
    set(key: string, value: any): Promise<void>,
  },

  // File System
  fs: {
    write(path: string, content: string): Promise<void>,
    platform(): Promise<'windows' | 'linux' | 'darwin'>,
  }
}
```

### Plugin Scopes (Permissions)

Define required scopes in `plugin.json` to access specific APIs:

```json
{
  "scopes": [
    "project.read",              // Read project metadata
    "project.read.files",        // List files
    "project.read.fileContent",  // Read file contents
    "project.read.characters",   // Access character data
    "project.read.worldbuilding",// Access worldbuilding
    "project.write.fileContent", // Write to files
    "project.write.files",       // Create/delete files
    "storage",                   // Plugin-local storage
    "ui.sidebar",                // Control sidebar visibility
    "ui.window",                 // Enter/exit fullscreen
    "ui.notification",           // Show notifications
    "debug.console",             // Log to dev console
    "fs.write",                  // File system write
    "fs.platform"                // Platform detection
  ]
}
```

## 🚀 Common Patterns

### Root Mounting (All Modern Plugins)

```typescript
// Graceful fallback mounting strategy
const getRoot = () => {
  const pluginRoot = document.getElementById('plugin-root');
  if (pluginRoot) return pluginRoot;
  
  const root = document.getElementById('root');
  if (root) return root;
  
  // Fallback for dev/testing
  const newRoot = document.createElement('div');
  newRoot.id = 'plugin-root';
  document.body.appendChild(newRoot);
  return newRoot;
};

ReactDOM.createRoot(getRoot()).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Immersive UI Control (Full-focus-mode Example)

```typescript
// Hide UI for distraction-free mode
const enterWritingMode = async () => {
  if (window.tintero?.ui) {
    await window.tintero.ui.hideSidebar();
    await window.tintero.ui.enterFullscreen();
    // User now sees fullscreen text editor only
  }
};

// Restore UI when done
const exitWritingMode = async () => {
  if (window.tintero?.ui) {
    await window.tintero.ui.showSidebar();
    await window.tintero.ui.exitFullscreen();
  }
};
```

### Project File Integration

```typescript
// Read existing files from project
const files = await window.tintero.project.readFiles();
const fileContent = await window.tintero.project.readFile(filePath);

// Write session output back to project
await window.tintero.project.writeFile(filePath, sessionText);

// Create new file in project
await window.tintero.project.writeFile('New Document.txt', initialContent);
```

### Theme Variable Access

Plugins inherit CSS variables from the theme system:

```css
:root {
  /* Base Tintero Theme */
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-main: #eaeaea;
  --text-secondary: #b0b0b0;
  --accent-primary: #0f3460;
  --accent-secondary: #533483;
  /* ... more variables */
}

/* Use in plugins */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-main);
}
```

## ⚙️ Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Folders | kebab-case (with content) | `full-focus-mode`, `world-codex` |
| React Components | PascalCase | `App.tsx`, `WritingCanvas.tsx` |
| Utilities/Functions | camelCase | `useSession.ts`, `html-generator.ts` |
| CSS Classes | kebab-case, namespaced | `.writing-canvas-main`, `.session-timer` |
| CSS Variables | kebab-case, prefixed | `--bg-primary`, `--text-main` |

## ⚡ Build Configuration Highlights

### Vite Config (Single-File Plugin Output)

```typescript
// vite.config.ts - Key patterns
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(), // ← Bundles CSS into JS
  ],
  base: './',                 // Relative paths for plugin loading
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'plugin.js',  // ← Single output file
        manualChunks: undefined,      // ← No code splitting
        assetFileNames: () => 'assets/[name]-[hash][extname]'
      }
    }
  }
});
```

### TypeScript Config (Multi-Target)

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

## 🐛 Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Plugin fails to load | Missing `plugin.json` or `icon.svg` in dist/ | Run `make package` to copy metadata |
| Styles don't apply | CSS not injected into JS bundle | Ensure `cssInjectedByJsPlugin()` in vite.config.ts + CSS imported in main.tsx |
| `window.tintero` undefined | Accessing SDK before app loads | Wrap SDK calls in `if (window.tintero) { ... }` |
| Root element not found | Sidebar panel HTML misconfigured | Use fallback mounting logic above |
| Type errors on build | TypeScript not type-checked before Vite | Build script runs `tsc -b` before `vite build` |
| Code splitting breaks plugin | Vite creates multiple chunks | Set `manualChunks: undefined` in rollupOptions |
| Icons/images missing | Not bundled into single JS file | Use data URLs or CSS-in-JS approach |
| Plugin registry entry missing | Not added to plugin-list.json | Register new plugins in `/plugins/plugin-list.json` |

## 📍 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `plugin.json` | Plugin manifest (metadata, scopes, UI) | Changing permissions, name, or UI layout |
| `vite.config.ts` | Build output configuration | Single-file bundling strategy |
| `tsconfig.json` | TypeScript strict mode + lib definitions | Type targets or new library support |
| `tintero-plugin-sdk.d.ts` | SDK type definitions (copy into each plugin) | When SDK API changes (rare) |
| `plugin-list.json` | Central plugin registry | Publishing a new plugin |
| `theme-list.json` | Central theme registry | Publishing a new theme |
| `Makefile` | Build automation shortcuts | Adding new build targets |
| `src/main.tsx` | App entry point & root mounting | Root element ID, global setup |
| `src/App.tsx` | Main UI component & routing logic | Adding new phases/screens |

## 🎯 Quick Start: Adding a Feature

1. **Create new component** in `src/components/FeatureName.tsx`
2. **Add business logic** to `src/engine/` (non-React utilities)
3. **Wire into App.tsx** with appropriate phase/state
4. **Define required scopes** in `plugin.json` (e.g., `project.read.files`)
5. **Test with SDK checks**: `if (window.tintero?.project) { ... }`
6. **Build & package**: `npm run build && make package`
7. **Add to registry**: Update `plugin-list.json` with new entry

## 🔗 Links to Essential Documentation

- [Full Focus Mode README](./Full-focus-mode---Tintero-plugin-main/README.md) - Immersive writing example
- [Base Theme](./Base-Tintero-Theme-master/README.md) - Theme structure & CSS variables
- [Plugin Registry](./plugins/plugin-list.json) - All published plugins
- [Theme Registry](./themes/theme-list.json) - All published themes
- [Latest Release Info](./releases/latest.json) - Current version & availability

---

**Last Updated**: May 2026 | For questions about plugins, check existing plugin repos (Full-focus-mode, World-Codex) as working examples.
