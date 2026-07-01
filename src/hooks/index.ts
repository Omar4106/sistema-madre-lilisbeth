import { useState, useEffect, useCallback } from 'react';
import { NumberData, DayRecord } from '../types';
import {
  loadState,
  saveNumbers,
  saveHistory,
  saveTheme,
  incrementNumber,
  decrementNumber,
  initializeNumbers,
  calculateTotals,
  generateDayRecord,
} from '../storage';

export function useAppState() {
  const [numbers, setNumbers] = useState<NumberData[]>(() => {
    const state = loadState();
    return state.numbers;
  });

  const [history, setHistory] = useState<DayRecord[]>(() => {
    const state = loadState();
    return state.history;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const state = loadState();
    return state.darkMode;
  });

  useEffect(() => {
    saveNumbers(numbers);
  }, [numbers]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveTheme(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleIncrement = useCallback((num: number) => {
    setNumbers((prev) => incrementNumber(prev, num));
  }, []);

  const handleDecrement = useCallback((num: number) => {
    setNumbers((prev) => decrementNumber(prev, num));
  }, []);

  const handleReset = useCallback(() => {
    const record = generateDayRecord(numbers);
    setHistory((prev) => [record, ...prev]);
    setNumbers(initializeNumbers());
  }, [numbers]);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return {
    numbers,
    history,
    darkMode,
    setDarkMode,
    handleIncrement,
    handleDecrement,
    handleReset,
    handleDeleteHistory,
    totals: calculateTotals(numbers),
  };
}
