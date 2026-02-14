import React, { useState } from 'react';
import { Plus, Bell, Trash2, ArrowLeft, X, Save, AlertOctagon } from 'lucide-react';
import { Rule } from '../types';
import { api } from '../services/api';

export default function AlarmesPage() {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, name: 'Alerta de Ociosidade', condition: 'Motor Desligado > 60 min', active: true, icon: 'power' },
    { id: 2, name: 'Perda de Comunicação', condition: 'Sem Sinal > 120 min', active: true, icon: 'alert' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', conditionType: 'idle', threshold: '60' });

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id: number) => {
      if(window.confirm('Deseja excluir esta regra?')) {
          setRules(rules.filter(r => r.id !== id));
      }
  }

  const handleAddRule = async () => {
      let conditionText = '';
      let icon: any = 'alert';
      
      switch(newRule.conditionType) {
          case 'idle': 
            conditionText = `Motor Desligado > ${newRule.threshold} min`; 
            icon = 'power';
            break;
          case 'nosignal': 
            conditionText = `Sem Sinal > ${newRule.threshold} min`; 
            icon = 'alert';
            break;
          case 'maintenance': 
            conditionText = `Em Manutenção > ${newRule.threshold} min`; 
            icon = 'wrench';
            break;
          default: conditionText = `Genérico > ${newRule.threshold} min`;
      }

      const rule: Rule = {
          id: Date.now(),
          name: newRule.name || 'Nova Regra',
          condition: conditionText,
          active: true,
          icon: icon
      };
      setRules([...rules, rule]);
      await api.saveRule(rule);
      setIsModalOpen(false);
      setNewRule({ name: '', conditionType: 'idle', threshold: '60' });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Alarmes</h1>
                <p className="text-slate-500 text-sm">Regras automáticas para notificações de anomalia</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
                <Plus size={18} /> Criar Nova Regra
            </button>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertOctagon className="text-blue-500"/> Nova Regra de Alarme
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-1 rounded-full hover:bg-slate-200"><X size={18} className="text-slate-500" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome da Regra</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Ex: Alerta Crítico de Ociosidade"
                                value={newRule.name}
                                onChange={e => setNewRule({...newRule, name: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tipo de Condição</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newRule.conditionType}
                                onChange={e => setNewRule({...newRule, conditionType: e.target.value})}
                            >
                                <option value="idle">Ociosidade (Motor Desligado)</option>
                                <option value="nosignal">Perda de Conexão (Sem Sinal)</option>
                                <option value="maintenance">Tempo em Manutenção Excedido</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Limite de Tempo (Minutos)</label>
                            <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="60"
                                value={newRule.threshold}
                                onChange={e => setNewRule({...newRule, threshold: e.target.value})}
                            />
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                onClick={handleAddRule}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Save size={18} /> Salvar e Ativar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="space-y-4">
            {rules.map(rule => (
                <div key={rule.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-5 mb-4 sm:mb-0">
                        <div className={`p-4 rounded-2xl shadow-sm ${rule.icon === 'power' ? 'bg-red-50 text-red-500' : rule.icon === 'wrench' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'}`}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-800">{rule.name}</h4>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono border border-slate-200">IF</span> 
                                {rule.condition}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                         
                         <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleRule(rule.id)}>
                            <span className={`text-xs font-bold uppercase ${rule.active ? 'text-blue-600' : 'text-slate-400'}`}>
                                {rule.active ? 'Ativado' : 'Desativado'}
                            </span>
                            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${rule.active ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}>
                                <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                            </div>
                         </div>

                         <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

                         <button onClick={() => deleteRule(rule.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                             <Trash2 size={20} />
                         </button>
                    </div>
                </div>
            ))}
            {rules.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Nenhuma regra configurada.</p>
                </div>
            )}
        </div>
    </div>
  );
}