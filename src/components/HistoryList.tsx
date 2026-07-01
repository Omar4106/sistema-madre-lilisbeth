import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Eye, Download, Share2, Image, Trash2, FileText } from 'lucide-react';
import { Modal } from './Modal';
import { DayRecord } from '../types';
import { downloadTxt } from '../storage';

interface HistoryListProps {
  history: DayRecord[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onDelete }) => {
  const [selectedRecord, setSelectedRecord] = React.useState<DayRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleGenerateImage = useCallback(async (record: DayRecord) => {
    if (!detailRef.current) return;
    try {
      const canvas = await html2canvas(detailRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      const date = record.date.replace(/\s/g, '-');
      a.download = `Ventas-${date}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  }, []);

  const handleShare = useCallback(async (record: DayRecord) => {
    if (!detailRef.current) return;
    try {
      const canvas = await html2canvas(detailRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'resumen.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Resumen de Ventas - Sistema Lilisbeth',
            files: [file],
          });
        } else {
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `Ventas-${record.date.replace(/\s/g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <FileText className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">No hay historial de ventas</p>
        <p className="text-sm">Los registros aparecerán al reiniciar el día</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record) => (
        <div
          key={record.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{record.date}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{record.time}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ${record.totalMoney.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {record.totalPieces} pedazos
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRecord(record)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button
              onClick={() => downloadTxt(record)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              TXT
            </button>
            <button
              onClick={() => handleGenerateImage(record)}
              className="flex items-center gap-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Image className="w-4 h-4" />
              Imagen
            </button>
            <button
              onClick={() => handleShare(record)}
              className="flex items-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            <button
              onClick={() => setShowDeleteConfirm(record.id)}
              className="flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>
      ))}

      {selectedRecord && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          title="Detalle del Registro"
        >
          <div
            ref={detailRef}
            className="bg-gray-800 rounded-xl p-6 text-white"
          >
            <div className="text-center mb-4">
              <p className="font-semibold">{selectedRecord.date}</p>
              <p className="text-sm text-gray-400">{selectedRecord.time}</p>
            </div>

            <div className="border-t border-gray-600 pt-4 mb-4">
              <h4 className="font-semibold mb-3">Números Vendidos</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedRecord.numbers.map((n) => (
                  <div
                    key={n.number}
                    className="flex justify-between text-sm bg-gray-700/50 rounded-lg p-2"
                  >
                    <span className="font-mono">{n.number.toString().padStart(2, '0')}</span>
                    <span className="text-gray-300">{n.sold} pedazos</span>
                    <span className="text-green-400">${n.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Números vendidos:</span>
                <span>{selectedRecord.totalNumbers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total pedazos:</span>
                <span>{selectedRecord.totalPieces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total recaudado:</span>
                <span className="text-green-400">${selectedRecord.totalMoney.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => downloadTxt(selectedRecord)}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar TXT
            </button>
            <button
              onClick={() => handleGenerateImage(selectedRecord)}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Image className="w-4 h-4" />
              Descargar Imagen
            </button>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        title="Eliminar Registro"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ¿Está seguro de que desea eliminar este registro?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (showDeleteConfirm) {
                  onDelete(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }
              }}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
