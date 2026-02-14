import React, { useState } from 'react';
import { Settings, User, Globe, Shield, Database, BellRing, Save } from 'lucide-react';

export default function ConfiguracoesPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
                {saved && <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full animate-pulse">Alterações Salvas!</span>}
            </div>
            
            <div className="space-y-6">
                
                {/* Section 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm uppercase tracking-wider">Geral</div>
                    
                    <div className="divide-y divide-slate-100">
                        <div className="p-6 flex gap-4 items-center hover:bg-slate-50 transition-colors group">
                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:scale-110 transition-transform"><User size={24}/></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">Perfil de Administrador</h3>
                                <p className="text-sm text-slate-500">Gerenciar conta admin e permissões de acesso</p>
                            </div>
                            <button className="text-blue-600 text-sm font-bold border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors" onClick={handleSave}>Editar</button>
                        </div>

                        <div className="p-6 flex gap-4 items-center hover:bg-slate-50 transition-colors group">
                            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform"><Database size={24}/></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">Banco de Dados (Google Sheets)</h3>
                                <p className="text-sm text-slate-500">Status: <span className="text-emerald-600 font-bold">Conectado via Apps Script</span></p>
                            </div>
                            <button className="text-slate-500 text-sm font-medium hover:text-slate-800" onClick={() => window.open('https://docs.google.com/spreadsheets', '_blank')}>Abrir Planilha</button>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm uppercase tracking-wider">Preferências</div>
                     <div className="p-6 flex gap-4 items-center hover:bg-slate-50 transition-colors group">
                        <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:scale-110 transition-transform"><BellRing size={24}/></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800">Notificações de Sistema</h3>
                            <p className="text-sm text-slate-500">Configurar alertas sonoros e pop-ups</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-blue-600 rounded-full cursor-pointer">
                            <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all"></span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                     <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95" onClick={handleSave}>
                        <Save size={18} /> Salvar Tudo
                     </button>
                </div>
            </div>
            
            <div className="mt-12 text-center text-slate-400 text-xs font-mono">
                System Version 2.1.0 • Build 2024.05.20
            </div>
        </div>
    );
}