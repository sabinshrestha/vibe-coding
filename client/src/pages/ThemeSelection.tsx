import React, { useState } from 'react';
import './ThemeSelection.css';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    navbar: string;
    text: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default Purple',
    description: 'The classic Vibe Marketplace look with purple gradients.',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#f5f5f5',
      navbar: '#ffffff',
      text: '#333333',
      accent: '#f093fb',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'A calm and professional theme inspired by the ocean.',
    colors: {
      primary: '#0077b6',
      secondary: '#023e8a',
      background: '#f0f4f8',
      navbar: '#ffffff',
      text: '#2b2d42',
      accent: '#48cae4',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm and vibrant tones for a creative feel.',
    colors: {
      primary: '#f77f00',
      secondary: '#e63946',
      background: '#fff8f0',
      navbar: '#ffffff',
      text: '#3d3d3d',
      accent: '#fcbf49',
    },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'A nature-inspired theme with earthy greens.',
    colors: {
      primary: '#2d6a4f',
      secondary: '#1b4332',
      background: '#f1f8f4',
      navbar: '#ffffff',
      text: '#2d3436',
      accent: '#52b788',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'A sleek dark mode for late-night browsing.',
    colors: {
      primary: '#bb86fc',
      secondary: '#6200ea',
      background: '#121212',
      navbar: '#1e1e1e',
      text: '#e0e0e0',
      accent: '#03dac6',
    },
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    description: 'Elegant and modern with soft pink accents.',
    colors: {
      primary: '#b76e79',
      secondary: '#8e4585',
      background: '#fdf6f6',
      navbar: '#ffffff',
      text: '#4a3f3f',
      accent: '#f2a5b0',
    },
  },
];

function ThemePreview({ theme }: { theme: Theme }) {
  const { primary, secondary, background, navbar, text, accent } = theme.colors;

  return (
    <div className="theme-preview" style={{ background }}>
      <div className="theme-preview-navbar" style={{ background: navbar }}>
        <span className="theme-preview-dot" style={{ background: '#ff5f57' }} />
        <span className="theme-preview-dot" style={{ background: '#ffbd2e' }} />
        <span className="theme-preview-dot" style={{ background: '#28c840' }} />
      </div>
      <div className="theme-preview-body">
        <div className="theme-preview-sidebar" style={{ background: primary }} />
        <div className="theme-preview-content">
          <div className="theme-preview-line" style={{ background: text, width: '70%' }} />
          <div className="theme-preview-line" style={{ background: text, width: '50%' }} />
          <div className="theme-preview-card-row">
            <div className="theme-preview-mini-card" style={{ background: primary }} />
            <div className="theme-preview-mini-card" style={{ background: secondary }} />
            <div className="theme-preview-mini-card" style={{ background: accent }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ThemeSelection: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('vibe-theme') || 'default';
  });

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-navbar', theme.colors.navbar);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-accent', theme.colors.accent);

    localStorage.setItem('vibe-theme', themeId);
    setSelectedTheme(themeId);
  };

  const resetTheme = () => {
    applyTheme('default');
  };

  return (
    <div className="theme-selection">
      <h2>Choose Your Theme</h2>
      <p className="subtitle">Personalize the look and feel of your marketplace experience.</p>

      <div className="theme-grid">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`theme-card${selectedTheme === theme.id ? ' active' : ''}`}
            onClick={() => applyTheme(theme.id)}
          >
            <ThemePreview theme={theme} />
            <div className="theme-card-info">
              <h3>{theme.name}</h3>
              <p>{theme.description}</p>
              {selectedTheme === theme.id && <span className="theme-badge">Active</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="theme-apply-bar">
        <button className="theme-reset-btn" onClick={resetTheme}>
          Reset to Default
        </button>
      </div>
    </div>
  );
};
