export interface NumberData {
  number: number;
  sold: number;
  total: number;
}

export interface DayRecord {
  id: string;
  date: string;
  time: string;
  numbers: NumberData[];
  totalNumbers: number;
  totalPieces: number;
  totalMoney: number;
  mostSoldNumber: number | null;
  leastSoldNumber: number | null;
  averagePerNumber: number;
}

export interface AppState {
  numbers: NumberData[];
  history: DayRecord[];
  darkMode: boolean;
}

export type TabType = 'main' | 'history' | 'stats';
