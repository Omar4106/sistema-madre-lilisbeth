import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Copy, Download, Share2, Image } from 'lucide-react';
import { Modal } from './Modal';
import { NumberData } from '../types';
import { formatDate, formatTime } from '../storage';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  soldNumbers: NumberData[];
  totalNumbers: number;
  totalPieces: number;
  totalMoney: number;
  mostSoldNumber: number | null;
  leastSoldNumber: number | null;
  averagePerNumber: number;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  soldNumbers,
  totalNumbers,
  totalPieces,
  totalMoney,
  mostSoldNumber,
  leastSoldNumber,
  averagePerNumber,
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  const generateSummaryText = useCallback(() => {
    const now = new Date();
    const lines: string[] = [];
    lines.push('==================================');
    lines.push('RESUMEN DEL DÍA');
    lines.push(`Fecha: ${formatDate(now)}`);
    lines.push(`Hora: ${formatTime(now)}`);
    lines.push('---');
    lines.push('LISTA DE NÚMEROS VENDIDOS');
    soldNumbers.forEach((n) => {
      lines.push(
        `${n.number.toString().padStart(2, '0')} - Vendido: ${n.sold} pedazos - Total: $${n.total.toFixed(2)}`
      );
    });
    lines.push('---');
    lines.push(`TOTAL DE NÚMEROS DIFERENTES: ${totalNumbers}`);
    lines.push(`TOTAL DE PEDAZOS VENDIDOS: ${totalPieces}`);
    lines.push(`TOTAL RECAUDADO: $${totalMoney.toFixed(2)}`);
    lines.push('---');
    if (mostSoldNumber !== null)
      lines.push(`Número más vendido: ${mostSoldNumber.toString().padStart(2, '0')}`);
    if (leastSoldNumber !== null)
      lines.push(`Número menos vendido: ${leastSoldNumber.toString().padStart(2, '0')}`);
    lines.push(`Promedio por número: ${averagePerNumber.toFixed(2)}`);
    lines.push('==================================');
    return lines.join('\n');
  }, [
    soldNumbers,
    totalNumbers,
    totalPieces,
    totalMoney,
    mostSoldNumber,
    leastSoldNumber,
    averagePerNumber,
  ]);

  const handleCopy = useCallback(() => {
    const text = generateSummaryText();
    navigator.clipboard.writeText(text);
    alert('Resumen copiado al portapapeles');
  }, [generateSummaryText]);

  const handleExportTxt = useCallback(() => {
    const text = generateSummaryText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `Resumen-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateSummaryText]);

  const handleGenerateImage = useCallback(async () => {
    if (!summaryRef.current) return;
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `Resumen-${date}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!summaryRef.current) return;
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'resumen.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Resumen de Ventas - Sistema Lilisbeth',
            text: generateSummaryText(),
            files: [file],
          });
        } else {
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `Resumen-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [generateSummaryText]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resumen del Día">
      <div
        ref={summaryRef}
        className="bg-gray-800 rounded-xl p-6 text-white mb-6"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Sistema Conteo de Números Lilisbeth</h3>
          <p className="text-gray-300">{formatDate(new Date())}</p>
          <p className="text-gray-300">{formatTime(new Date())}</p>
        </div>

        <div className="border-t border-gray-600 pt-4 mb-4">
          <h4 className="font-semibold mb-3">Lista de Números Vendidos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {soldNumbers.map((n) => (
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

        <div className="border-t border-gray-600 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Total de números diferentes:</span>
            <span className="font-bold">{totalNumbers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total de pedazos vendidos:</span>
            <span className="font-bold">{totalPieces}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total recaudado:</span>
            <span className="font-bold text-green-400">${totalMoney.toFixed(2)}</span>
          </div>
          {mostSoldNumber !== null && (
            <div className="flex justify-between">
              <span className="text-gray-300">Número más vendido:</span>
              <span className="font-bold">{mostSoldNumber.toString().padStart(2, '0')}</span>
            </div>
          )}
          {leastSoldNumber !== null && (
            <div className="flex justify-between">
              <span className="text-gray-300">Número menos vendido:</span>
              <span className="font-bold">{leastSoldNumber.toString().padStart(2, '0')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Promedio por número:</span>
            <span className="font-bold">{averagePerNumber.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copiar
        </button>
        <button
          onClick={handleExportTxt}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar TXT
        </button>
        <button
          onClick={handleGenerateImage}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
        >
          <Image className="w-4 h-4" />
          Generar Imagen
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Compartir
        </button>
      </div>
    </Modal>
  );
};
