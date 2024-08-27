import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/lib/useTheme';
import { Moon, Sun } from "lucide-react";

// Define the props interface to include className
interface ModeToggleProps {
  className?: string;
}

export function ModeToggle({ className }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">(
    theme === "system"
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
  );

  // Detect system theme on initial load and check for user preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      setCurrentTheme(savedTheme);
    } else if (theme === "system") {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      setCurrentTheme(systemTheme);
    }
  }, [setTheme, theme]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme: "dark" | "light" = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save user preference
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`ghost ${className}`} // Apply the passed className
      onClick={toggleTheme} // Toggle theme on button click
    >
      <Sun className={`h-[1.1rem] w-[1.2rem] transition-all ${currentTheme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <Moon className={`absolute h-[1.1rem] w-[1.2rem] transition-all ${currentTheme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}