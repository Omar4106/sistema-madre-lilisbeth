import React, { useState, useMemo } from 'react';
import { Search, Calculator, History, BarChart3, HelpCircle } from 'lucide-react';
import {
  Header,
  NumberCard,
  TotalCard,
  SummaryModal,
  ResetButton,
  HistoryList,
  StatsView,
} from './components';
import { useAppState } from './hooks';
import { TabType } from './types';

function App() {
  const {
    numbers,
    history,
    darkMode,
    setDarkMode,
    handleIncrement,
    handleDecrement,
    handleReset,
    handleDeleteHistory,
    totals,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const filteredNumbers = useMemo(() => {
    if (!searchQuery.trim()) return numbers;
    const query = searchQuery.trim();
    const numQuery = parseInt(query, 10);
    if (!isNaN(numQuery) && numQuery >= 1 && numQuery <= 99) {
      return numbers.filter((n) => n.number === numQuery);
    }
    if (query.length === 1 || query.length === 2) {
      return numbers.filter((n) => n.number.toString().padStart(2, '0').includes(query));
    }
    return numbers;
  }, [numbers, searchQuery]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'main', label: 'Números', icon: <Calculator className="w-4 h-4" /> },
    { id: 'history', label: 'Historial', icon: <History className="w-4 h-4" /> },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'main' && (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar número (ej: 25, 05)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <TotalCard
              totalPieces={totals.totalPieces}
              totalMoney={totals.totalMoney}
            />

            <div className="my-6">
              <button
                onClick={() => setShowSummary(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                Toque acá más para saber el total
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
              {filteredNumbers.map((num) => (
                <NumberCard
                  key={num.number}
                  data={num}
                  onIncrement={() => handleIncrement(num.number)}
                  onDecrement={() => handleDecrement(num.number)}
                />
              ))}
            </div>

            {filteredNumbers.length === 0 && searchQuery && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No se encontraron números con &quot;{searchQuery}&quot;
              </div>
            )}

            <ResetButton
              onReset={handleReset}
              totalPieces={totals.totalPieces}
            />
          </>
        )}

        {activeTab === 'history' && (
          <>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Historial de Ventas
            </h2>
            <HistoryList history={history} onDelete={handleDeleteHistory} />
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Estadísticas del Día
            </h2>
            <StatsView
              numbers={numbers}
              totalPieces={totals.totalPieces}
              totalMoney={totals.totalMoney}
              mostSoldNumber={totals.mostSoldNumber}
              leastSoldNumber={totals.leastSoldNumber}
            />
          </>
        )}

        <SummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          soldNumbers={totals.soldNumbers}
          totalNumbers={totals.totalNumbers}
          totalPieces={totals.totalPieces}
          totalMoney={totals.totalMoney}
          mostSoldNumber={totals.mostSoldNumber}
          leastSoldNumber={totals.leastSoldNumber}
          averagePerNumber={totals.averagePerNumber}
        />
      </div>
    </div>
  );
}

export default App;
