
import { useEffect } from 'react';
import { useOSStore } from '../../os/stores/os-store';
import { Theme } from '../../../types';

const THEMES: Record<Theme, Record<string, string>> = {
  bone: {
    '--os-bg': '#e8e4d9',
    '--os-window': '#fdfdfd',
    '--os-accent': '#ff7e33',
    '--os-accent-hover': '#e0651e',
    '--os-accent-border': '#c2410c',
    '--os-text': '#121212',
    '--os-border': '#121212',
    '--os-muted': '#78716c',
  },
  night: {
    '--os-bg': '#0a0a0a',
    '--os-window': '#1a1a1a',
    '--os-accent': '#22c55e', // Hacker Green
    '--os-accent-hover': '#16a34a',
    '--os-accent-border': '#14532d',
    '--os-text': '#e5e5e5',
    '--os-border': '#404040',
    '--os-muted': '#a3a3a3',
  },
  seraph: {
    '--os-bg': '#2e1065', // Deep Purple
    '--os-window': '#4c1d95',
    '--os-accent': '#f472b6', // Pink
    '--os-accent-hover': '#ec4899',
    '--os-accent-border': '#831843',
    '--os-text': '#f3e8ff',
    '--os-border': '#c084fc',
    '--os-muted': '#d8b4fe',
  },
  gruvbox: {
    '--os-bg': '#282828', // Dark background
    '--os-window': '#32302f', // Slightly lighter window
    '--os-accent': '#fe8019', // Gruvbox Orange
    '--os-accent-hover': '#d65d0e',
    '--os-accent-border': '#af3a03',
    '--os-text': '#ebdbb2', // Light FG
    '--os-border': '#928374', // Grayish border
    '--os-muted': '#a89984',
  }
};

/**
 * Hook that applies the current theme's CSS variables to the document root.
 * Call once at the top level (e.g. App component).
 */
export const useThemeManager = () => {
  const { theme } = useOSStore();

  useEffect(() => {
    const root = document.documentElement;
    const themeVars = THEMES[theme] || THEMES.bone;
    
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [theme]);
};
