import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const getRoot = () => {
  const pluginRoot = document.getElementById('plugin-root');

  if (pluginRoot) {
    return pluginRoot;
  }

  const root = document.getElementById('root');

  if (root) {
    return root;
  }

  console.warn("Creating plugin-root as fallback");
  const newRoot = document.createElement('div');
  newRoot.id = 'plugin-root';
  document.body.appendChild(newRoot);

  return newRoot;
};

const rootElement = getRoot();

if (rootElement) {
  Object.assign(rootElement.style, {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#000000',
    color: '#ffffff',
    margin: '0',
    padding: '0'
  });

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Failed to find or create root element for Full Focus Mode plugin");
}

if (typeof window.registerPlugin !== 'undefined' && typeof window.TinteroPlugin !== 'undefined') {
  const plugin = new window.TinteroPlugin();

  plugin.onActivate = () => {

  };

  window.registerPlugin(plugin);
} else {
  console.warn('Tintero Plugin SDK not found. Running in standalone/dev mode.');
}
