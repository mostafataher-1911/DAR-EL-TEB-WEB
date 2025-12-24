// src/Context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // عند أول تحميل: استخدام النظام فقط
  const [theme, setTheme] = useState(() => {
    // عند أول تحميل: دائماً نستخدم النظام
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'light'; // Default
  });

  // حالة لتتبع ما إذا تم التبديل يدوياً
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);

  // تطبيق الـ theme
  const applyTheme = (newTheme, manualToggle = false) => {
    const root = document.documentElement;
    
    // إزالة القديم
    root.classList.remove('light', 'dark');
    
    // إضافة الجديد
    root.classList.add(newTheme);
    
    // لـ DaisyUI
    root.setAttribute('data-theme', newTheme);
    
    // إذا تم التبديل يدوياً، نحفظ التفضيل
    if (manualToggle) {
      localStorage.setItem('app-theme', newTheme);
      setIsManuallyToggled(true);
    }
    
    // تحديث الـ state
    setTheme(newTheme);
  };

  // عند التحميل الأولي
  useEffect(() => {
    // التحقق إذا كان المستخدم قد غير يدوياً من قبل
    const savedTheme = localStorage.getItem('app-theme');
    
    if (savedTheme) {
      // إذا كان قد غير يدوياً من قبل، نستخدم التفضيل المحفوظ
      applyTheme(savedTheme);
      setIsManuallyToggled(true);
    } else {
      // إذا لم يغير من قبل، نستخدم النظام فقط
      applyTheme(theme);
      setIsManuallyToggled(false);
    }

    // استماع لتغير النظام (اختياري)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // إذا لم يتم التبديل يدوياً، نتبع النظام
      if (!isManuallyToggled) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // تبديل الـ theme يدوياً
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, true); // true تعني أنه تغيير يدوي
  };

  // إعادة ضبط للنظام (اختياري)
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