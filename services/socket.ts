import { Equipment, SocketMessage, LogEvent } from '../types';
import { calculateDuration } from '../constants';

/**
 * SERVIÇO DE WEBSOCKET SIMULADO
 * Simula atualizações em tempo real com lógica de eventos contínua.
 */

type SocketListener = (message: SocketMessage) => void;

class MockWebSocketService {
    private listeners: SocketListener[] = [];
    private intervalId: any = null;
    private isConnected: boolean = false;
    
    // Dados para simulação (Estado em Memória do Servidor)
    private mockEquipments: Equipment[] = [];

    constructor() {}

    public connect(initialData: Equipment[]) {
        if (this.isConnected) return;
        
        console.log('[WebSocket] Conectando ao servidor de telemetria...');
        this.mockEquipments = initialData;
        this.isConnected = true;
        
        this.notify({ type: 'CONNECTION', payload: { status: 'connected' }, timestamp: Date.now() });
        this.startSimulation();
    }

    public disconnect() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.isConnected = false;
        this.notify({ type: 'CONNECTION', payload: { status: 'disconnected' }, timestamp: Date.now() });
        console.log('[WebSocket] Desconectado.');
    }

    public subscribe(listener: SocketListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify(message: SocketMessage) {
        this.listeners.forEach(listener => listener(message));
    }

    // LÓGICA DE SIMULAÇÃO INTELIGENTE
    private startSimulation() {
        this.intervalId = setInterval(() => {
            if (!this.mockEquipments.length) return;

            // 1. Escolhe um equipamento aleatório
            const randomIndex = Math.floor(Math.random() * this.mockEquipments.length);
            const eq = this.mockEquipments[randomIndex];

            // 2. Gera um novo status aleatório
            const statuses = ['Trabalhando', 'Parado', 'Manutenção'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Se o status for o mesmo, não faz nada (mantém o evento atual contando tempo)
            if (eq.status === newStatus) return;

            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // 3. LÓGICA DE FECHAMENTO DE EVENTO:
            // Clonamos a lista de eventos para não mutar diretamente sem controle
            let updatedEventos: LogEvent[] = [...eq.eventos];
            
            // Se houver um evento anterior, finalizamos ele
            if (updatedEventos.length > 0) {
                const lastEventIndex = updatedEventos.length - 1;
                const lastEvent = { ...updatedEventos[lastEventIndex] };
                
                // Define data fim como AGORA
                lastEvent.dataFim = timeString;
                
                // Calcula duração real: (Agora - Inicio do Evento Anterior)
                if (lastEvent.dataInicio) {
                    lastEvent.tempoTotal = calculateDuration(lastEvent.dataInicio, timeString);
                }
                
                updatedEventos[lastEventIndex] = lastEvent;
            }

            // 4. LÓGICA DE ABERTURA DE NOVO EVENTO:
            const newEvent: LogEvent = {
                descricao: `Mudança para ${newStatus}`,
                dataInicio: timeString,
                dataFim: undefined, // Ainda está aberto
                tempoTotal: '00:00', // Começa zerado
                status: newStatus
            };
            
            updatedEventos.push(newEvent);

            // Mantém apenas os últimos 10 eventos para não explodir a memória do navegador
            if (updatedEventos.length > 10) {
                updatedEventos = updatedEventos.slice(-10);
            }

            // 5. Cria o objeto atualizado
            const updatedEquipment: Equipment = {
                ...eq,
                status: newStatus,
                horario: now.toISOString(), // Atualiza timestamp geral do veículo
                eventos: updatedEventos
            };

            // Atualiza nossa base local simulada
            this.mockEquipments[randomIndex] = updatedEquipment;

            // 6. Envia o evento "PUSH" para o frontend
            const message: SocketMessage = {
                type: 'UPDATE',
                payload: updatedEquipment,
                timestamp: Date.now()
            };

            this.notify(message);

        }, 5000); // Atualiza a cada 5 segundos
    }
}

export const socketService = new MockWebSocketService();