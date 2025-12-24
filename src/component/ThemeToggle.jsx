// src/components/ThemeToggle.jsx (بديل)
import React from 'react';
import { useTheme } from '../Context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="swap swap-rotate">
      {/* Hidden checkbox */}
      <input 
        type="checkbox" 
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      
      {/* Sun icon */}
      <SunIcon className="swap-off w-6 h-6 fill-current text-yellow-500" />
      
      {/* Moon icon */}
      <MoonIcon className="swap-on w-6 h-6 fill-current text-blue-400" />
    </label>
  );
};

export default ThemeToggle;