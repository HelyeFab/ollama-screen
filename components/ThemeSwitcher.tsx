'use client';

import { FiSun, FiMoon, FiDroplet } from 'react-icons/fi';
import { GiForest, GiSunset } from 'react-icons/gi';
import { BsStars } from 'react-icons/bs';
import { useTheme, Theme, themeLabels } from '@/contexts/ThemeContext';
import { Dropdown, DropdownItem } from './ui';
import { ReactNode } from 'react';

const themeIcons: Record<Theme, ReactNode> = {
  light: <FiSun size={18} />,
  dark: <FiMoon size={18} />,
  ocean: <FiDroplet size={18} />,
  forest: <GiForest size={18} />,
  sunset: <GiSunset size={18} />,
  midnight: <BsStars size={18} />,
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themeItems: DropdownItem[] = Object.entries(themeLabels).map(
    ([value, label]) => ({
      label: value === theme ? `${label} ✓` : label,
      value,
      icon: themeIcons[value as Theme],
    })
  );

  return (
    <Dropdown
      trigger={
        <button
          className="p-2 rounded-lg hover:bg-theme-bg-tertiary transition-colors flex items-center gap-2 text-theme-text-primary"
          title={`Current theme: ${themeLabels[theme]}`}
        >
          {themeIcons[theme]}
        </button>
      }
      items={themeItems}
      onSelect={(value) => {
        console.log('Switching to theme:', value);
        setTheme(value as Theme);
      }}
      align="right"
    />
  );
}
