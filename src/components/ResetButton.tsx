import React, { useState, useRef } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ResetButtonProps {
  onReset: () => void;
  totalPieces: number;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  totalPieces,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startHold = () => {
    setHolding(true);
    setProgress(0);

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 3.33;
      });
    }, 50);

    timerRef.current = window.setTimeout(() => {
      stopHold();
      setShowConfirm(true);
    }, 3000);
  };

  const stopHold = () => {
    setHolding(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  };

  const handleConfirm = () => {
    onReset();
    setShowConfirm(false);
  };

  if (totalPieces === 0) return null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            Mantenga presionado el botón durante 3 segundos para guardar y reiniciar
          </p>
          <button
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            className="relative w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold overflow-hidden transition-all duration-200"
          >
            <div
              className="absolute inset-0 bg-orange-600"
              style={{ width: `${progress}%` }}
            />
            <div className="relative flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              <span>Toque acá más para guardar y reiniciar</span>
            </div>
          </button>
          {holding && (
            <p className="mt-2 text-orange-500 text-sm">
              Continúe presionando... {Math.round(progress)}%
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Reinicio"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ¿Desea guardar las ventas del día?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold transition-colors hover:bg-orange-600"
            >
              Guardar y Reiniciar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
