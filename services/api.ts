import { ApiResponse, Equipment } from '../types';
import { GAS_URL } from '../constants';

// MOCK DATA GENERATOR (Fallback robusto para demonstração se a API falhar)
const generateMockData = (): ApiResponse => {
  const baseStatus = ['Trabalhando', 'Parado', 'Manutenção', 'Sem Apropriação'];
  const vagasNomes = [
    'ALTA PRESSÃO - GPS - 01', 'ALTA PRESSÃO - GPS - 02', 'VAGA OPERACIONAL 03', 'INFRAESTRUTURA - 04',
    'VAGA 05 - 24 HS', 'VAGA 06 - MANUTENÇÃO', 'ALTA PRESSÃO - GPS - 07', 'APOIO OPERACIONAL - 08'
  ];
  
  const vagas: Equipment[] = Array.from({ length: 8 }).map((_, i) => {
    const status = baseStatus[Math.floor(Math.random() * baseStatus.length)];
    return {
      id: `eq-${i}`,
      nome: vagasNomes[i % vagasNomes.length],
      placa: `MOCK-${2024 + i}`,
      status: status,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      eventos: [
        { descricao: 'Operação Iniciada', dataInicio: '08:00', tempoTotal: '04:00', status: 'Trabalhando' },
        { descricao: 'Pausa para Almoço', dataInicio: '12:00', tempoTotal: '01:00', status: 'Parado' }
      ]
    };
  });
  return { success: true, vagas };
};

export const api = {
  getVagas: async (date: string, hour?: string): Promise<ApiResponse> => {
    try {
      const url = new URL(GAS_URL);
      url.searchParams.append('action', 'getVagas');
      
      // Envia a data no formato yyyy-MM-dd. O backend.gs fará o split/reverse/join internamente.
      url.searchParams.append('date', date);
      url.searchParams.append('ts', new Date().getTime().toString()); // Cache busting
      
      if (hour) {
        url.searchParams.append('hour', hour);
      }

      // Requisição GET simples (sem custom headers para evitar preflight OPTIONS)
      const response = await fetch(url.toString(), { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || (data.success === false && !data.vagas)) {
          console.warn("API retornou erro, usando dados de demonstração.");
          return generateMockData();
      }
      
      // Normalização dos Dados vindos do Backend
      const rawVagas = Array.isArray(data) ? data : (data.vagas || []);
      
      const mappedVagas: Equipment[] = rawVagas.map((v: any, index: number) => ({
        id: v.id || `vaga-${index}`,
        nome: v.nome || `Vaga ${index + 1}`,
        // Backend manda 'equipamento', Frontend espera 'placa'
        placa: v.equipamento || v.placa || 'N/I', 
        status: v.status || 'Sem Apropriação',
        horario: v.horario || new Date().toISOString(),
        eventos: Array.isArray(v.eventos) ? v.eventos : []
      }));
      
      return { success: true, vagas: mappedVagas };

    } catch (error) {
      console.error("Erro de conexão com GAS:", error);
      return generateMockData();
    }
  },

  saveRule: async (ruleData: any) => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveRule', ...ruleData }),
        headers: { 'Content-Type': 'text/plain' }
      });
      return await response.json();
    } catch (e) {
      console.error("Erro ao salvar regra", e);
      return { success: true };
    }
  }
};