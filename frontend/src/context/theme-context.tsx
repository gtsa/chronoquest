import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'darkMode' | 'brightMode';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialTheme = (): Theme => {
    const saved = localStorage.getItem('theme');
    return saved === 'brightMode' || saved === 'darkMode' ? saved : 'darkMode';
  };
  
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  
  // Load saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved === 'brightMode' || saved === 'darkMode') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', theme); // fallback
    }
  }, []);

  // Apply the theme whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'darkMode' ? 'brightMode' : 'darkMode'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
