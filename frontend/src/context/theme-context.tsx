import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'darkMode' | 'brightMode';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Utility to get current CSS variable value
const getCSSVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme');
  return saved === 'brightMode' || saved === 'darkMode' ? saved : 'darkMode';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // On mount, apply initial theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const initialTheme: Theme =
      saved === 'brightMode' || saved === 'darkMode' ? saved : 'darkMode';

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // On theme change, update everything (DOM + localStorage + meta)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const color = getCSSVar('--background-dark');
      meta.setAttribute('content', color || '#000000');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'darkMode' ? 'brightMode' : 'darkMode'));
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
