import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { formatDate, formatTime } from '../storage';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDateTime, setShowDateTime] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowDateTime(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Sistema Conteo de Números Lilisbeth
          </h1>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              showDateTime ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-blue-100 text-sm md:text-base">{formatDate(currentTime)}</p>
            <p className="text-blue-200 text-lg font-semibold">{formatTime(currentTime)}</p>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-300" />
          ) : (
            <Moon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </header>
  );
};
