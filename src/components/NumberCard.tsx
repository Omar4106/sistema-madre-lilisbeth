import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Minus, Plus, Edit2, PlusCircle } from 'lucide-react';
import { NumberData } from '../types';
import { Modal } from './Modal';

interface NumberCardProps {
  data: NumberData;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetQuantity: (quantity: number) => void;
  onAddQuantity: (quantity: number) => void;
}

export const NumberCard: React.FC<NumberCardProps> = ({
  data,
  onIncrement,
  onDecrement,
  onSetQuantity,
  onAddQuantity,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const incrementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incrementIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const decrementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decrementIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startIncrementHold = useCallback(() => {
    onIncrement();
    incrementTimerRef.current = setTimeout(() => {
      incrementIntervalRef.current = setInterval(() => {
        onIncrement();
      }, 50);
    }, 500);
  }, [onIncrement]);

  const stopIncrementHold = useCallback(() => {
    if (incrementTimerRef.current) {
      clearTimeout(incrementTimerRef.current);
      incrementTimerRef.current = null;
    }
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
  }, []);

  const startDecrementHold = useCallback(() => {
    onDecrement();
    decrementTimerRef.current = setTimeout(() => {
      decrementIntervalRef.current = setInterval(() => {
        onDecrement();
      }, 50);
    }, 500);
  }, [onDecrement]);

  const stopDecrementHold = useCallback(() => {
    if (decrementTimerRef.current) {
      clearTimeout(decrementTimerRef.current);
      decrementTimerRef.current = null;
    }
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopIncrementHold();
      stopDecrementHold();
    };
  }, [stopIncrementHold, stopDecrementHold]);

  const handleEditSave = () => {
    const quantity = parseInt(inputValue, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      onSetQuantity(quantity);
      setShowEditModal(false);
      setInputValue('');
      triggerSuccess();
    }
  };

  const handleAddSave = () => {
    const quantity = parseInt(inputValue, 10);
    if (!isNaN(quantity) && quantity > 0) {
      onAddQuantity(quantity);
      setShowAddModal(false);
      setInputValue('');
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700 relative ${
          showSuccess ? 'ring-2 ring-green-500 ring-offset-2' : ''
        }`}
      >
        {showSuccess && (
          <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center pointer-events-none transition-opacity duration-500" />
        )}

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

          <div className="flex justify-center gap-2 mb-3">
            <button
              onMouseDown={startDecrementHold}
              onMouseUp={stopDecrementHold}
              onMouseLeave={stopDecrementHold}
              onTouchStart={startDecrementHold}
              onTouchEnd={stopDecrementHold}
              disabled={data.sold === 0}
              className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center transition-all duration-200 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 select-none"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onMouseDown={startIncrementHold}
              onMouseUp={stopIncrementHold}
              onMouseLeave={stopIncrementHold}
              onTouchStart={startIncrementHold}
              onTouchEnd={stopIncrementHold}
              className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-900/50 active:scale-95 select-none"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              Editar
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <PlusCircle className="w-3 h-3" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setInputValue('');
        }}
        title={`Editar cantidad del número ${data.number.toString().padStart(2, '0')}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Cantidad:
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`${data.sold}`}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowEditModal(false);
                setInputValue('');
              }}
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleEditSave}
              disabled={inputValue === ''}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setInputValue('');
        }}
        title={`Agregar cantidad al número ${data.number.toString().padStart(2, '0')}`}
      >
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Cantidad actual: <span className="font-bold text-gray-800 dark:text-gray-200">{data.sold}</span>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Cantidad a agregar:
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl"
              autoFocus
            />
          </div>
          {inputValue && !isNaN(parseInt(inputValue, 10)) && (
            <div className="text-center text-sm text-green-600 dark:text-green-400">
              Resultado: {data.sold + parseInt(inputValue, 10)} pedazos = ${(data.sold + parseInt(inputValue, 10)) * 0.2}0
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setInputValue('');
              }}
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddSave}
              disabled={inputValue === '' || parseInt(inputValue, 10) <= 0}
              className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700"
            >
              Agregar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
