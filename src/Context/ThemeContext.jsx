import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'light'; 
  });

  const [isManuallyToggled, setIsManuallyToggled] = useState(false);

  const applyTheme = (newTheme, manualToggle = false) => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    root.classList.add(newTheme);
    
    root.setAttribute('data-theme', newTheme);
    
    if (manualToggle) {
      localStorage.setItem('app-theme', newTheme);
      setIsManuallyToggled(true);
    }
    
    setTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    
    if (savedTheme) {
      applyTheme(savedTheme);
      setIsManuallyToggled(true);
    } else {
      applyTheme(theme);
      setIsManuallyToggled(false);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!isManuallyToggled) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, true); 
  };

  const resetToSystem = () => {
    localStorage.removeItem('app-theme');
    setIsManuallyToggled(false);
    
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  };

  // Context value
  const value = {
    theme,
    toggleTheme,
    isManuallyToggled,
    resetToSystem
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;