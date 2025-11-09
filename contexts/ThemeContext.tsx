'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'midnight';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme configurations with CSS variables
const themeConfigs: Record<Theme, Record<string, string>> = {
  light: {
    '--bg-primary': '249 250 251',      // gray-50
    '--bg-secondary': '255 255 255',    // white
    '--bg-tertiary': '243 244 246',     // gray-100
    '--text-primary': '17 24 39',       // gray-900
    '--text-secondary': '75 85 99',     // gray-600
    '--text-tertiary': '156 163 175',   // gray-400
    '--border': '229 231 235',          // gray-200
    '--accent': '59 130 246',           // blue-500
    '--accent-hover': '37 99 235',      // blue-600
  },
  dark: {
    '--bg-primary': '17 24 39',         // gray-900
    '--bg-secondary': '31 41 55',       // gray-800
    '--bg-tertiary': '55 65 81',        // gray-700
    '--text-primary': '249 250 251',    // gray-50
    '--text-secondary': '209 213 219',  // gray-300
    '--text-tertiary': '156 163 175',   // gray-400
    '--border': '75 85 99',             // gray-600
    '--accent': '59 130 246',           // blue-500
    '--accent-hover': '37 99 235',      // blue-600
  },
  ocean: {
    '--bg-primary': '236 254 255',      // cyan-50
    '--bg-secondary': '207 250 254',    // cyan-100
    '--bg-tertiary': '165 243 252',     // cyan-200
    '--text-primary': '22 78 99',       // cyan-900
    '--text-secondary': '21 94 117',    // cyan-800
    '--text-tertiary': '14 116 144',    // cyan-700
    '--border': '103 232 249',          // cyan-300
    '--accent': '6 182 212',            // cyan-500
    '--accent-hover': '8 145 178',      // cyan-600
  },
  forest: {
    '--bg-primary': '240 253 244',      // green-50
    '--bg-secondary': '220 252 231',    // green-100
    '--bg-tertiary': '187 247 208',     // green-200
    '--text-primary': '20 83 45',       // green-900
    '--text-secondary': '21 128 61',    // green-800
    '--text-tertiary': '22 163 74',     // green-700
    '--border': '134 239 172',          // green-300
    '--accent': '34 197 94',            // green-500
    '--accent-hover': '22 163 74',      // green-600
  },
  sunset: {
    '--bg-primary': '255 247 237',      // orange-50
    '--bg-secondary': '255 237 213',    // orange-100
    '--bg-tertiary': '254 215 170',     // orange-200
    '--text-primary': '124 45 18',      // orange-900
    '--text-secondary': '154 52 18',    // orange-800
    '--text-tertiary': '194 65 12',     // orange-700
    '--border': '253 186 116',          // orange-300
    '--accent': '249 115 22',           // orange-500
    '--accent-hover': '234 88 12',      // orange-600
  },
  midnight: {
    '--bg-primary': '15 23 42',         // slate-900
    '--bg-secondary': '30 41 59',       // slate-800
    '--bg-tertiary': '51 65 85',        // slate-700
    '--text-primary': '248 250 252',    // slate-50
    '--text-secondary': '226 232 240',  // slate-200
    '--text-tertiary': '148 163 184',   // slate-400
    '--border': '71 85 105',            // slate-600
    '--accent': '139 92 246',           // violet-500
    '--accent-hover': '124 58 237',     // violet-600
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const config = themeConfigs[newTheme];
    const root = document.documentElement;

    // Apply CSS variables
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set data attribute for theme
    root.setAttribute('data-theme', newTheme);

    // Update class for compatibility with existing dark mode styles
    if (newTheme === 'dark' || newTheme === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    console.log('Applied theme:', newTheme, 'Dark class:', root.classList.contains('dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const themeLabels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  ocean: 'Ocean',
  forest: 'Forest',
  sunset: 'Sunset',
  midnight: 'Midnight',
};
