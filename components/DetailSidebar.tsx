import React from 'react';
import { X, MapPin, Power, Activity } from 'lucide-react';
import { Equipment } from '../types';
import { STATUS_COLORS, STATUS_LABELS, normalizeStatus, formatDateTime } from '../constants';

interface DetailSidebarProps {
  equipment: Equipment | null;
  onClose: () => void;
}

export const DetailSidebar: React.FC<DetailSidebarProps> = ({ equipment, onClose }) => {
  if (!equipment) return null;

  const statusKey = normalizeStatus(equipment.status);
  const label = STATUS_LABELS[statusKey];
  const style = STATUS_COLORS[statusKey] || STATUS_COLORS['sem-apropriacao'];
  const events = equipment.eventos || [];

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-[420px] bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-out z-50 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold tracking-wider uppercase mb-1">
              <MapPin size={12} />
              {equipment.nome.split(' - ')[0]}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{equipment.placa}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
          <div className={`flex items-center justify-between gap-4 mb-8 p-4 rounded-xl border ${style.bg} ${style.border.replace('border-', 'border-opacity-20 ')}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white/60`}>
                <Activity className={style.text} size={20} />
              </div>
              <span className={`font-bold text-lg ${style.text}`}>
                {label.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 px-3 py-1 rounded-full">
              <Power className={statusKey === 'trabalhando' ? 'text-emerald-500' : 'text-slate-400'} size={14} />
              <span className="font-medium">{statusKey === 'trabalhando' ? 'ON' : 'OFF'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide">ID do Veículo</span>
              <span className="font-semibold text-slate-700">{equipment.nome.split(' - ')[1] || 'N/A'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide">Última atualização</span>
              <span className="font-semibold text-slate-700">{formatDateTime(equipment.horario)}</span>
            </div>
          </div>
          {/* ... Resto do código mantido igual ... */}
        </div>
      </div>
    </>
  );
};