import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { NumberData } from '../types';

interface NumberCardProps {
  data: NumberData;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const NumberCard: React.FC<NumberCardProps> = ({
  data,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {data.number.toString().padStart(2, '0')}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Vendidos
        </div>
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {data.sold}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Total
        </div>
        <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
          ${data.total.toFixed(2)}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onDecrement}
            disabled={data.sold === 0}
            className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center transition-all duration-200 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={onIncrement}
            className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-900/50 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
