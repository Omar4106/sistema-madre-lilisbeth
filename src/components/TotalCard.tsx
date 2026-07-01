import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TotalCardProps {
  totalPieces: number;
  totalMoney: number;
  totalNumbers?: number;
}

export const TotalCard: React.FC<TotalCardProps> = ({
  totalPieces,
  totalMoney,
  totalNumbers = 0,
}) => {
  const progress = (totalNumbers / 100) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6" />
        <h2 className="text-xl font-bold">TOTAL GENERAL</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <div className="text-blue-100 text-sm mb-1">Pedazos vendidos</div>
          <div className="text-3xl font-bold">{totalPieces}</div>
        </div>
        <div>
          <div className="text-blue-100 text-sm mb-1">Dinero recaudado</div>
          <div className="text-3xl font-bold">${totalMoney.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-blue-100 mb-2">
          <span>Progreso del día</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-blue-900/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
