import React from 'react';
import { useFleet } from '../contexts/FleetContext';
import { normalizeStatus, STATUS_LABELS, formatDateTime, STATUS_COLORS } from '../constants';
import { BarChart3, PieChart, Activity, AlertTriangle, Clock, Truck, Zap, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
    // Acesso direto aos dados em cache na memória
    const { vagas } = useFleet();

    // Cálculos de Totais (Instantâneo)
    const total = vagas.length || 1;
    const workingCount = vagas.filter(v => normalizeStatus(v.status) === 'trabalhando').length;
    const stoppedCount = vagas.filter(v => normalizeStatus(v.status) === 'parado').length;
    const maintenanceCount = vagas.filter(v => normalizeStatus(v.status) === 'manutencao').length;
    
    // Porcentagens
    const workingPct = (workingCount / total) * 100;
    const stoppedPct = (stoppedCount / total) * 100;
    const maintPct = (maintenanceCount / total) * 100;

    const pieGradient = `conic-gradient(#10b981 0% ${workingPct}%, #ef4444 ${workingPct}% ${workingPct + stoppedPct}%, #f59e0b ${workingPct + stoppedPct}% ${workingPct + stoppedPct + maintPct}%, #cbd5e1 ${workingPct + stoppedPct + maintPct}% 100%)`;

    // Geração de Dados Horários Simulados
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
        let baseVal = 0;
        if (i < 6) baseVal = Math.random() * 20; 
        else if (i < 12) baseVal = 60 + Math.random() * 30;
        else if (i === 12 || i === 13) baseVal = 40 + Math.random() * 20; 
        else if (i < 18) baseVal = 70 + Math.random() * 25; 
        else baseVal = 30 + Math.random() * 30; 
        
        return Math.min(Math.round(baseVal), 100);
    });

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                    <BarChart3 size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
                    <p className="text-slate-500 text-sm">Inteligência operacional e KPIs</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Activity size={60} className="text-emerald-500"/></div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Em Operação</span>
                    <div className="text-4xl font-bold text-slate-800 mt-2">{workingCount}</div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{width: `${workingPct}%`}}></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><AlertTriangle size={60} className="text-red-500"/></div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Parado</span>
                    <div className="text-4xl font-bold text-slate-800 mt-2">{stoppedCount}</div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{width: `${stoppedPct}%`}}></div>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Zap size={60} className="text-indigo-500"/></div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Produtividade Média</span>
                    <div className="text-4xl font-bold text-slate-800 mt-2">78%</div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{width: `78%`}}></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Calendar size={60} className="text-slate-400"/></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ciclo Médio</span>
                    <div className="text-4xl font-bold text-slate-800 mt-2">4.5h</div>
                     <p className="text-xs text-slate-400 mt-2">Por operação completa</p>
                </div>
            </div>

            {/* PAINEL HORA A HORA */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" /> 
                        Performance Hora a Hora (24h)
                    </h3>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Alta</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Média</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><span className="w-2 h-2 rounded-full bg-red-400"></span> Baixa</span>
                    </div>
                </div>
                
                <div className="h-64 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2">
                    {hourlyData.map((val, hour) => {
                        let barColor = 'bg-red-400';
                        if (val > 40) barColor = 'bg-amber-400';
                        if (val > 70) barColor = 'bg-emerald-400';

                        return (
                            <div key={hour} className="flex-1 flex flex-col justify-end group cursor-pointer relative h-full">
                                <div 
                                    className={`w-full rounded-t-sm sm:rounded-t-md transition-all duration-300 relative flex flex-col justify-end opacity-80 group-hover:opacity-100 ${barColor}`} 
                                    style={{height: `${val}%`}}
                                >
                                     <div className="w-full h-1 bg-white/30 rounded-t-sm sm:rounded-t-md"></div>
                                </div>
                                <span className="text-[10px] text-slate-400 text-center mt-2 font-mono border-t border-transparent group-hover:border-slate-300 pt-1">
                                    {hour.toString().padStart(2, '0')}h
                                </span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                    <div className="bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap text-center">
                                        <span className="font-bold block text-sm">{hour}:00 - {hour}:59</span>
                                        <span className="text-emerald-300 font-bold">{val}% Produtividade</span>
                                    </div>
                                    <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="w-full h-[1px] bg-slate-200 mt-[-24px]"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Distribuição */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <h3 className="text-sm font-bold text-slate-700 mb-6 w-full flex items-center gap-2">
                        <PieChart size={16} className="text-indigo-500" /> Distribuição da Frota
                    </h3>
                    <div className="relative w-56 h-56 rounded-full shadow-inner mb-6 transition-all hover:scale-105 duration-500" style={{ background: pieGradient }}>
                        <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-slate-800">{total}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Veículos</span>
                            </div>
                        </div>
                    </div>
                     <div className="w-full grid grid-cols-2 gap-3">
                        <div className="flex justify-between text-xs items-center p-2 bg-slate-50 rounded-lg"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Operando</span> <span className="font-bold">{Math.round(workingPct)}%</span></div>
                        <div className="flex justify-between text-xs items-center p-2 bg-slate-50 rounded-lg"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Parado</span> <span className="font-bold">{Math.round(stoppedPct)}%</span></div>
                    </div>
                </div>

                 {/* Ranking Top Veículos */}
                 <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <Truck size={16} className="text-emerald-500" /> Top Eficiência Operacional
                    </h3>
                    <div className="space-y-6">
                        {vagas.slice(0, 5).map((v, i) => (
                             <div key={i} className="flex items-center gap-4 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                 <div className={`font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full ${i === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                                     {i+1}
                                 </div>
                                 <div className="flex-1">
                                     <div className="flex justify-between mb-1">
                                         <span className="text-sm font-bold text-slate-700">{v.nome}</span>
                                         <span className="text-sm font-bold text-emerald-600">9{8-i}%</span>
                                     </div>
                                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-emerald-500 rounded-full" style={{width: `9${8-i}%`}}></div>
                                     </div>
                                 </div>
                                 <div className="text-xs font-mono text-slate-400 border border-slate-200 px-2 py-1 rounded bg-white">
                                     {v.placa}
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Tabela Detalhada */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Activity size={20} className="text-indigo-500" /> Detalhe Operacional por Vaga
                        </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 sticky top-0 z-10 text-xs uppercase font-bold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Vaga</th>
                                    <th className="px-6 py-4">Placa</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Atualização</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {vagas.map(v => {
                                    const status = normalizeStatus(v.status);
                                    const label = STATUS_LABELS[status];
                                    const style = STATUS_COLORS[status] || STATUS_COLORS['sem-apropriacao'];
                                    
                                    return (
                                        <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-800">{v.nome}</td>
                                            <td className="px-6 py-4">
                                                 <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200 text-xs">{v.placa}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border.replace('border-', 'border-opacity-20 ')}`}>
                                                    {label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                                                {formatDateTime(v.horario)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}