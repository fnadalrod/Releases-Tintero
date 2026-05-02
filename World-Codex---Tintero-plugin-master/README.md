# World Codex Wiki - Tintero Plugin

Auto-generated navigable wiki from your Tintero project's characters, worldbuilding elements, and manuscript content.

## Features

✨ **Auto-Generated Wiki Pages** - Every character and worldbuilding element gets its own page  
🔗 **Cross-Reference Engine** - Automatically finds and links mentions across your manuscript  
🎨 **Beautiful UI** - Matches Tintero's theme with dark mode support  
📊 **Analytics Dashboard** - See stats about your world and characters  
🔍 **Fuzzy Search** - Find anything quickly  

## Development

This plugin is built with React + TypeScript + Vite and includes a **mock SDK layer** so you can develop and test it independently without Tintero.

### Prerequisites

- Node.js 18+ and npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

This will start a local server at `http://localhost:5174` (or another port if 5174 is busy).

**The app will use mock data from `mock-data/` directory.** You can edit these JSON files to test different scenarios.

### Mock Data

The mock data includes:
- **Characters**: Aragorn, Arwen, Gandalf (Lord of the Rings themed)
- **Worldbuilding**: Locations (Rivendell, Minas Tirith), Factions, Species, etc.
- **Files**: Sample chapters with content that mentions the characters

Edit files in `mock-data/` to customize the test data.

### How It Works

The plugin automatically detects its environment:

- **Development** (`npm run dev`): Uses mock SDK from `src/sdk/mock-sdk.ts`
- **Production** (inside Tintero): Uses real `window.tintero` SDK

This is handled transparently by `src/sdk/sdk-context.tsx`.

## Building for Production

### Build the Plugin

```bash
npm run build
```

This creates a `dist/` folder with:
- `plugin.js` - Single bundled JavaScript file (all code inline)
- `index.html` - HTML with inlined CSS
- `assets/` - Any other assets

### Package as ZIP

```bash
npm run package
```

This builds the plugin and creates `world-codex-plugin.zip` ready to install in Tintero.

## Installing in Tintero

1. Run `npm run package` to create the ZIP file
2. Open Tintero
3. Go to **Settings > Plugins > Install Plugin**
4. Select `world-codex-plugin.zip`
5. Approve the requested permissions
6. Open the "World Codex" panel in the sidebar

## Project Structure

```
world-codex-plugin/
├── src/
│   ├── sdk/
│   │   ├── mock-sdk.ts          # Mock Tintero SDK for development
│   │   ├── sdk-context.tsx      # React Context provider
│   │   └── use-tintero.ts       # Custom hooks
│   ├── engine/
│   │   └── indexer.ts           # Cross-reference indexing engine
│   ├── pages/
│   │   ├── Dashboard.tsx        # Main dashboard with stats
│   │   └── EntityPage.tsx       # Character/worldbuilding pages
│   ├── components/
│   │   └── Sidebar.tsx          # Navigation sidebar
│   ├── styles/
│   │   └── main.css             # Tintero-themed styles
│   ├── types/
│   │   └── tintero-plugin-sdk.d.ts  # TypeScript definitions
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── mock-data/
│   ├── characters.json          # Mock character data
│   ├── worldbuilding.json       # Mock worldbuilding data
│   ├── files.json               # Mock file content
│   └── project.json             # Mock project metadata
├── plugin.json                  # Plugin manifest
├── vite.config.ts               # Vite configuration
└── package.json                 # Dependencies and scripts
```

## Key Concepts

### SDK Abstraction

The `TinteroProvider` component automatically provides the correct SDK:

```tsx
import { useTintero, useCharacters } from './sdk/use-tintero';

function MyComponent() {
  const { characters } = useCharacters(); // Works in dev AND production
  return <div>{characters.map(c => c.name)}</div>;
}
```

### Cross-Reference Indexing

The indexer scans all files for mentions of characters and worldbuilding elements:

```typescript
import { buildIndex } from './engine/indexer';

// Build index (cached in storage)
const index = await buildIndex(tintero);

// index = {
//   'char-1': [
//     { fileId: 'file-1', fileName: 'Chapter 1', snippet: '...Aragorn stood...' }
//   ]
// }
```

### Theming

The plugin uses CSS variables that Tintero injects:

```css
.my-component {
  color: var(--text-primary, #e6d7c2);  /* Fallback for development */
  background: var(--dark-secondary, #231e19);
}
```

## Permissions (Scopes)

The plugin requests these permissions:

- `project.read.*` - Read project data (characters, worldbuilding, files)
- `storage` - Cache the cross-reference index
- `ui.sidebar` - Render in the sidebar
- `ui.notification` - Show notifications

## Troubleshooting

### "Cannot find module" errors

Make sure you ran `npm install` and that `tsconfig.app.json` has `"resolveJsonModule": true`.

### Development server shows blank page

Check the browser console for errors. Make sure all mock data files exist in `mock-data/`.

### Build fails

Try deleting `node_modules` and `dist`, then:

```bash
npm install
npm run build
```

## Next Steps

- Add more mock data to test edge cases
- Implement search functionality
- Add relationship graphs with D3
- Add analytics charts with Recharts
- Test in actual Tintero app

## Contributing

Contributions are welcome! Whether it's a bug fix, a new feature, or an improvement to the docs, feel free to open a pull request.

If you build something on top of this plugin (a fork, a variant, your own Tintero plugin using this as a base), you don't need to ask for permission. Just go ahead.

Some ideas for contributions:

- Relationship graphs between characters (D3 / Cytoscape)
- Analytics charts (Recharts / Chart.js)
- Timeline view for story events
- Improved fuzzy search with ranking
- Support for additional entity types

## License

MIT — completely free to use, modify, fork, and distribute, for any purpose, personal or commercial.

You can use this project as a template or starting point to build your own Tintero plugins. No attribution required, though it's always appreciated.
