import { AppState, NumberData, DayRecord } from '../types';

const STORAGE_KEY = 'lilisbeth-numeros-data';
const THEME_KEY = 'lilisbeth-numeros-theme';
const HISTORY_KEY = 'lilisbeth-numeros-history';

const PRICE_PER_PIECE = 0.20;

export function initializeNumbers(): NumberData[] {
  const numbers: NumberData[] = [];
  for (let i = 1; i <= 99; i++) {
    numbers.push({
      number: i,
      sold: 0,
      total: 0,
    });
  }
  return numbers;
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY);

    const numbers = saved ? JSON.parse(saved) : initializeNumbers();
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const darkMode = savedTheme ? JSON.parse(savedTheme) : false;

    return { numbers, history, darkMode };
  } catch {
    return {
      numbers: initializeNumbers(),
      history: [],
      darkMode: false,
    };
  }
}

export function saveNumbers(numbers: NumberData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(numbers));
}

export function saveHistory(history: DayRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function saveTheme(darkMode: boolean): void {
  localStorage.setItem(THEME_KEY, JSON.stringify(darkMode));
}

export function incrementNumber(numbers: NumberData[], num: number): NumberData[] {
  return numbers.map((item) => {
    if (item.number === num) {
      const newSold = item.sold + 1;
      return {
        ...item,
        sold: newSold,
        total: Number((newSold * PRICE_PER_PIECE).toFixed(2)),
      };
    }
    return item;
  });
}

export function decrementNumber(numbers: NumberData[], num: number): NumberData[] {
  return numbers.map((item) => {
    if (item.number === num && item.sold > 0) {
      const newSold = item.sold - 1;
      return {
        ...item,
        sold: newSold,
        total: Number((newSold * PRICE_PER_PIECE).toFixed(2)),
      };
    }
    return item;
  });
}

export function calculateTotals(numbers: NumberData[]) {
  const soldNumbers = numbers.filter((n) => n.sold > 0);
  const totalPieces = numbers.reduce((sum, n) => sum + n.sold, 0);
  const totalMoney = Number(
    numbers.reduce((sum, n) => sum + n.total, 0).toFixed(2)
  );

  const sortedBySold = [...soldNumbers].sort((a, b) => b.sold - a.sold);
  const mostSoldNumber = sortedBySold[0]?.number ?? null;
  const leastSoldNumber = sortedBySold[sortedBySold.length - 1]?.number ?? null;

  const averagePerNumber = soldNumbers.length > 0 ? totalPieces / soldNumbers.length : 0;

  return {
    totalNumbers: soldNumbers.length,
    totalPieces,
    totalMoney,
    mostSoldNumber,
    leastSoldNumber,
    averagePerNumber: Number(averagePerNumber.toFixed(2)),
    soldNumbers,
  };
}

export function generateDayRecord(numbers: NumberData[]): DayRecord {
  const now = new Date();
  const stats = calculateTotals(numbers);

  return {
    id: now.toISOString(),
    date: formatDate(now),
    time: formatTime(now),
    numbers: stats.soldNumbers,
    totalNumbers: stats.totalNumbers,
    totalPieces: stats.totalPieces,
    totalMoney: stats.totalMoney,
    mostSoldNumber: stats.mostSoldNumber,
    leastSoldNumber: stats.leastSoldNumber,
    averagePerNumber: stats.averagePerNumber,
  };
}

export function formatDate(date: Date): string {
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${day} de ${month} de ${year}`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function generateTxtContent(record: DayRecord): string {
  const lines: string[] = [];
  lines.push('========================================');
  lines.push('SISTEMA CONTEO DE NÚMEROS LILISBETH');
  lines.push('');
  lines.push(`Fecha: ${record.date}`);
  lines.push(`Hora: ${record.time}`);
  lines.push('');
  lines.push('LISTA DE NÚMEROS VENDIDOS');
  lines.push('');

  record.numbers.forEach((n) => {
    const numStr = n.number.toString().padStart(2, '0');
    lines.push(`${numStr} = ${n.sold} pedazos = $${n.total.toFixed(2)}`);
  });

  lines.push('');
  lines.push('TOTAL DE NÚMEROS DIFERENTES');
  lines.push(record.totalNumbers.toString());
  lines.push('');
  lines.push('TOTAL DE PEDAZOS');
  lines.push(record.totalPieces.toString());
  lines.push('');
  lines.push('TOTAL RECAUDADO');
  lines.push(`$${record.totalMoney.toFixed(2)}`);
  lines.push('========================================');

  return lines.join('\n');
}

export function downloadTxt(record: DayRecord): void {
  const content = generateTxtContent(record);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().split('T')[0];
  a.download = `Ventas-${date}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
