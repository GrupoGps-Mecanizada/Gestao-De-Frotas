
export type StatusType = 'trabalhando' | 'parado' | 'manutencao' | 'sem-apropriacao';

export interface LogEvent {
  descricao: string;
  dataInicio: string; // "YYYY-MM-DD HH:mm:ss"
  dataFim?: string;
  tempoTotal: string; // "HH:mm:ss"
  status?: string;
}

export interface Equipment {
  id: string;
  nome: string; // Vaga name e.g. "ALTA PRESSÃO - GPS - 01"
  placa: string; // License plate
  status: string; // Raw status from API
  horario: string; // Last update
  eventos: LogEvent[];
}

export interface DashboardStats {
  trabalhando: number;
  parado: number;
  manutencao: number;
  semApropriacao: number;
}

export interface ApiResponse {
  success: boolean;
  vagas: Equipment[];
}

export interface Rule {
  id: number;
  name: string;
  condition: string;
  active: boolean;
  icon: 'power' | 'alert' | 'wrench';
}

// WebSocket Types
export type SocketMessageType = 'UPDATE' | 'ALERT' | 'CONNECTION';

export interface SocketMessage {
    type: SocketMessageType;
    payload: any;
    timestamp: number;
}
