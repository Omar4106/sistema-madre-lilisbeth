import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Hash, DollarSign, CheckCircle } from 'lucide-react';
import { NumberData } from '../types';

interface StatsViewProps {
  numbers: NumberData[];
  totalPieces: number;
  totalMoney: number;
  mostSoldNumber: number | null;
  leastSoldNumber: number | null;
}

export const StatsView: React.FC<StatsViewProps> = ({
  numbers,
  totalPieces,
  totalMoney,
  mostSoldNumber,
  leastSoldNumber,
}) => {
  const soldNumbers = numbers.filter((n) => n.sold > 0);
  const unsoldNumbers = numbers.filter((n) => n.sold === 0);
  const averagePerNumber = soldNumbers.length > 0 ? totalPieces / soldNumbers.length : 0;

  const sortedBySold = [...numbers].sort((a, b) => b.sold - a.sold);
  const top10 = sortedBySold.filter((n) => n.sold > 0).slice(0, 10);
  const bottom10 = sortedBySold
    .filter((n) => n.sold > 0)
    .reverse()
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dinero generado</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                ${totalMoney.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pedazos vendidos</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{totalPieces}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Números vendidos</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {soldNumbers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Hash className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sin vender</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {unsoldNumbers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Número más vendido
            </h3>
          </div>
          {mostSoldNumber !== null ? (
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {mostSoldNumber.toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {numbers.find((n) => n.number === mostSoldNumber)?.sold || 0} pedazos
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-400">Sin ventas</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Número menos vendido
            </h3>
          </div>
          {leastSoldNumber !== null ? (
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {leastSoldNumber.toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {numbers.find((n) => n.number === leastSoldNumber)?.sold || 0} pedazos
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-400">Sin ventas</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Promedio de venta</h3>
        </div>
        <p className="text-center text-3xl font-bold text-blue-600 dark:text-blue-400">
          {averagePerNumber.toFixed(2)} pedazos/nums
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Top 10 números más vendidos
          </h3>
          {top10.length > 0 ? (
            <div className="space-y-2">
              {top10.map((n, index) => (
                <div
                  key={n.number}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                      {n.number.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{n.sold} pedazos</span>
                    <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                      ${n.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">Sin ventas</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Top 10 números menos vendidos
          </h3>
          {bottom10.length > 0 ? (
            <div className="space-y-2">
              {bottom10.map((n, index) => (
                <div
                  key={n.number}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                      {n.number.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{n.sold} pedazos</span>
                    <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                      ${n.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">Sin ventas</p>
          )}
        </div>
      </div>
    </div>
  );
};
