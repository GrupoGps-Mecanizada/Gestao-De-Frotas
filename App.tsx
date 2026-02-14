import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import MonitoramentoPage from './pages/MonitoramentoPage';
import AlarmesPage from './pages/AlarmesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import { FleetProvider } from './contexts/FleetContext';

type Page = 'monitoramento' | 'analytics' | 'alarmes' | 'configuracoes';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('monitoramento');

  return (
    <FleetProvider>
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
          {/* Fixed Sidebar */}
          <Sidebar currentPage={currentPage} onNavigate={(p) => setCurrentPage(p)} />

          {/* Main Content Area */}
          <main className="flex-1 ml-64 h-full overflow-hidden relative flex flex-col">
            {currentPage === 'monitoramento' && <MonitoramentoPage />}
            {currentPage === 'analytics' && <AnalyticsPage />}
            {currentPage === 'alarmes' && <AlarmesPage />}
            {currentPage === 'configuracoes' && <ConfiguracoesPage />}
          </main>
        </div>
    </FleetProvider>
  );
}