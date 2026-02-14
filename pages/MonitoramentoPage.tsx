import React, { useState } from 'react';
import { RefreshCw, Search, Calendar, Filter, Clock } from 'lucide-react';
import { EquipmentCard } from '../components/EquipmentCard';
import { DetailPanel } from '../components/DetailPanel';
import { Equipment } from '../types';
import { useFleet } from '../contexts/FleetContext';

export default function MonitoramentoPage() {
  // Consome dados globais (já carregados)
  const { vagas, loading, refreshData, filters, updateFilters } = useFleet();
  
  const [selectedEquip, setSelectedEquip] = useState<Equipment | null>(null);
  const [filterText, setFilterText] = useState('');

  // Ao selecionar um equipamento, garantimos que pegamos a versão mais recente do estado global
  // Isso corrige bugs onde o painel lateral ficava desatualizado
  const activeEquipment = selectedEquip ? vagas.find(v => v.id === selectedEquip.id) || selectedEquip : null;

  const filteredVagas = vagas.filter(v => 
    v.nome.toLowerCase().includes(filterText.toLowerCase()) || 
    v.placa.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="flex h-full w-full">
      {/* Coluna Principal (Conteúdo) */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50">
        
        {/* Área Fixa Superior (Header + Filtros) */}
        <div className="flex-shrink-0 px-6 pt-6 pb-2 z-20 relative">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
              <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Monitoramento</h1>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">Visão geral da operação em tempo real</p>
              </div>
            </div>

            {/* Barra de Filtros (FIXA) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    
                    {/* Pesquisa Vaga/Placa */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Pesquisar Vaga ou Placa..." 
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 hidden lg:block self-center"></div>

                    {/* Controles de Data/Hora (Consumindo Contexto Global) */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300 transition-colors">
                            <Calendar size={16} className="text-blue-500"/>
                            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Data</span>
                            <input 
                              type="date" 
                              value={filters.date} 
                              onChange={(e) => updateFilters({ date: e.target.value })}
                              className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300 transition-colors">
                            <Clock size={16} className="text-emerald-500"/>
                            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Início</span>
                            <input 
                              type="time" 
                              value={filters.startTime} 
                              onChange={(e) => updateFilters({ startTime: e.target.value })}
                              className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300 transition-colors">
                            <Clock size={16} className="text-red-500"/>
                            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Fim</span>
                            <input 
                              type="time" 
                              value={filters.endTime} 
                              onChange={(e) => updateFilters({ endTime: e.target.value })}
                              className="bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer"
                            />
                        </div>
                        
                        <button onClick={() => refreshData()} className="p-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all active:scale-95 shadow-sm" title="Recarregar Dados">
                            <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Área Rolável (Grid de Cards) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-4">
            {loading && vagas.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                 <RefreshCw className="animate-spin mb-4 text-blue-200" size={40} />
                 <p className="animate-pulse">Sincronizando frota...</p>
               </div>
            ) : filteredVagas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                 <div className="bg-slate-50 p-4 rounded-full mb-3"><Filter size={24} className="text-slate-400"/></div>
                 <p className="text-slate-600 font-medium">Nenhum veículo encontrado.</p>
                 <p className="text-sm text-slate-400 mt-1">Tente ajustar os filtros de horário.</p>
                 <button onClick={() => { setFilterText(''); updateFilters({ startTime: '', endTime: '' }); }} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Limpar Filtros</button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${selectedEquip ? 'xl:grid-cols-2' : 'xl:grid-cols-4'} gap-5 transition-all`}>
                {filteredVagas.map((vaga) => (
                  <EquipmentCard 
                    key={vaga.id} 
                    data={vaga} 
                    onClick={setSelectedEquip} 
                    isSelected={selectedEquip?.id === vaga.id}
                  />
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Painel Lateral Direito */}
      {activeEquipment && (
        <div className="w-[420px] border-l border-slate-200 bg-white h-full relative flex-shrink-0 transition-all duration-300 shadow-2xl z-30">
            <DetailPanel equipment={activeEquipment} onClose={() => setSelectedEquip(null)} />
        </div>
      )}
    </div>
  );
}