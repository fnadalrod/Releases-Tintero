# Theme Examples

This document contains complete example themes you can use as inspiration or starting point for your own themes.

## 🌃 Dark Cyberpunk

A vibrant cyberpunk theme with neon accents.

```css
:root {
  /* Fonts */
  --interface-font: 'JetBrains Mono', monospace;
  --tab-font: 'JetBrains Mono', monospace;
  --editor-font: 'Courier New', monospace;

  /* Base Colors */
  --dark-bg: #0a0e27;
  --dark-secondary: #141829;
  --dark-tertiary: #1e2235;
  --dark-quaternary: #252a42;
  --dark-menu: #0a0e27;

  /* Text Colors */
  --text-primary: #e0e0e0;
  --text-secondary: #00ff9f;
  --text-tertiary: #7a8bff;

  /* Accent Colors */
  --accent-color: #00ff9f;
  --accent-color-hover: #00ffcc;

  /* Borders */
  --border-color: #00ff9f;
}

/* Glowing effect on focused elements */
*:focus {
  box-shadow: 0 0 10px var(--accent-color) !important;
}
```

## ☀️ Light Minimalist

A clean, bright theme for daytime writing.

```css
:root {
  /* Fonts */
  --interface-font: 'Inter Variable', sans-serif;
  --editor-font: 'Merriweather', serif;

  /* Base Colors */
  --dark-bg: #ffffff;
  --dark-secondary: #f8f9fa;
  --dark-tertiary: #e9ecef;
  --dark-quaternary: #dee2e6;
  --dark-menu: #ffffff;

  /* Text Colors */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-tertiary: #adb5bd;

  /* Accent Colors */
  --accent-color: #0066cc;
  --accent-color-hover: #0052a3;

  /* Borders */
  --border-color: #dee2e6;
}
```

## 📜 Sepia Vintage

A warm, vintage theme inspired by old manuscripts.

```css
:root {
  /* Fonts */
  --interface-font: 'Crimson Text', serif;
  --editor-font: 'Crimson Text', serif;

  /* Base Colors */
  --dark-bg: #f4ecd8;
  --dark-secondary: #ebe2d0;
  --dark-tertiary: #e2d9c7;
  --dark-quaternary: #d9d0be;
  --dark-menu: #f4ecd8;

  /* Text Colors */
  --text-primary: #5c4a3a;
  --text-secondary: #8b6f47;
  --text-tertiary: #a88c5f;

  /* Accent Colors */
  --accent-color: #8b6f47;
  --accent-color-hover: #a88c5f;

  /* Borders */
  --border-color: #d9d0be;
}

/* Vintage paper texture effect */
body {
  background-image: url('data:image/svg+xml,...') !important;
}
```

## 🌲 Forest Dark

A nature-inspired dark theme with green accents.

```css
:root {
  /* Fonts */
  --interface-font: 'Source Sans Variable', sans-serif;
  --editor-font: 'Lora', serif;

  /* Base Colors */
  --dark-bg: #1a2314;
  --dark-secondary: #23301c;
  --dark-tertiary: #2d3d26;
  --dark-quaternary: #384a31;
  --dark-menu: #1a2314;

  /* Text Colors */
  --text-primary: #d4e8d4;
  --text-secondary: #95c995;
  --text-tertiary: #6fa96f;

  /* Accent Colors */
  --accent-color: #7cbd7c;
  --accent-color-hover: #95d995;

  /* Borders */
  --border-color: #384a31;
}
```

## 🌊 Ocean Blue

A calming blue theme for focused writing.

```css
:root {
  /* Fonts */
  --interface-font: 'Roboto', sans-serif;
  --editor-font: 'Georgia', serif;

  /* Base Colors */
  --dark-bg: #0d1b2a;
  --dark-secondary: #1b263b;
  --dark-tertiary: #415a77;
  --dark-quaternary: #778da9;
  --dark-menu: #0d1b2a;

  /* Text Colors */
  --text-primary: #e0e1dd;
  --text-secondary: #778da9;
  --text-tertiary: #415a77;

  /* Accent Colors */
  --accent-color: #4a90e2;
  --accent-color-hover: #67a5eb;

  /* Borders */
  --border-color: #1b263b;
}
```

## 🌅 Sunset Warm

A warm, orange-toned theme perfect for evening writing.

```css
:root {
  /* Fonts */
  --interface-font: 'Poppins', sans-serif;
  --editor-font: 'Playfair Display', serif;

  /* Base Colors */
  --dark-bg: #2d1810;
  --dark-secondary: #3d2218;
  --dark-tertiary: #4d2c20;
  --dark-quaternary: #5d3628;
  --dark-menu: #2d1810;

  /* Text Colors */
  --text-primary: #f5e6d3;
  --text-secondary: #e6b88a;
  --text-tertiary: #d89b61;

  /* Accent Colors */
  --accent-color: #ff9f45;
  --accent-color-hover: #ffb366;

  /* Borders */
  --border-color: #4d2c20;
}
```

## 🎨 High Contrast

Maximum contrast for accessibility.

```css
:root {
  /* Fonts */
  --interface-font: 'Arial', sans-serif;
  --editor-font: 'Arial', sans-serif;
  --base-font-size: 16px;

  /* Base Colors */
  --dark-bg: #000000;
  --dark-secondary: #1a1a1a;
  --dark-tertiary: #333333;
  --dark-quaternary: #4d4d4d;
  --dark-menu: #000000;

  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #ffff00;
  --text-tertiary: #ffffff;

  /* Accent Colors */
  --accent-color: #ffff00;
  --accent-color-hover: #ffff66;

  /* Borders */
  --border-color: #ffffff;
}
```

## 💜 Purple Dream

A dreamy purple theme with soft gradients.

```css
:root {
  /* Fonts */
  --interface-font: 'Nunito', sans-serif;
  --editor-font: 'Libre Baskerville', serif;

  /* Base Colors */
  --dark-bg: #1a0f2e;
  --dark-secondary: #271644;
  --dark-tertiary: #3d2459;
  --dark-quaternary: #52326e;
  --dark-menu: #1a0f2e;

  /* Text Colors */
  --text-primary: #e8d5ff;
  --text-secondary: #c199ff;
  --text-tertiary: #9966ff;

  /* Accent Colors */
  --accent-color: #9966ff;
  --accent-color-hover: #b380ff;

  /* Borders */
  --border-color: #52326e;
}

/* Subtle gradient on sidebar */
.sidebar {
  background: linear-gradient(180deg, #1a0f2e 0%, #271644 100%) !important;
}
```

## 🌙 Midnight Writer

A deep dark theme for distraction-free night writing.

```css
:root {
  /* Fonts */
  --interface-font: 'IBM Plex Sans', sans-serif;
  --editor-font: 'IBM Plex Serif', serif;

  /* Base Colors */
  --dark-bg: #0a0a0a;
  --dark-secondary: #141414;
  --dark-tertiary: #1e1e1e;
  --dark-quaternary: #282828;
  --dark-menu: #0a0a0a;

  /* Text Colors */
  --text-primary: #d0d0d0;
  --text-secondary: #808080;
  --text-tertiary: #606060;

  /* Accent Colors */
  --accent-color: #4a4a4a;
  --accent-color-hover: #5e5e5e;

  /* Borders */
  --border-color: #1e1e1e;

  /* Reduced editor zoom for more screen space */
  --editor-zoom: 100%;
}

/* Hide distractions */
.toolbar {
  opacity: 0.5;
  transition: opacity 0.3s;
}

.toolbar:hover {
  opacity: 1;
}
```

## 🎓 Academic

A professional theme for academic writing.

```css
:root {
  /* Fonts */
  --interface-font: 'Source Sans 3', sans-serif;
  --editor-font: 'Linux Libertine', serif;
  --base-font-size: 15px;

  /* Base Colors */
  --dark-bg: #fafafa;
  --dark-secondary: #f0f0f0;
  --dark-tertiary: #e6e6e6;
  --dark-quaternary: #d0d0d0;
  --dark-menu: #ffffff;

  /* Text Colors */
  --text-primary: #2c2c2c;
  --text-secondary: #5c5c5c;
  --text-tertiary: #8c8c8c;

  /* Accent Colors */
  --accent-color: #1a5490;
  --accent-color-hover: #2668b0;

  /* Borders */
  --border-color: #d0d0d0;
}

/* Increase line spacing for better readability */
.editor-content {
  line-height: 1.8 !important;
}
```

---

## 🎯 Using These Examples

To use any of these examples:

1. Copy the CSS code
2. Paste it into your `theme.css` file
3. Customize the colors and fonts to your liking
4. Test in Tintero
5. Adjust as needed

## 🔗 Sharing Your Theme

If you create an interesting theme variation, consider:

- Publishing it as a separate repository
- Adding a preview screenshot
- Sharing it with the Tintero community
- Creating a pull request to add it to this examples file

Happy theming! 🎨
