import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { socketService } from '../services/socket';
import { Equipment, SocketMessage } from '../types';

interface FleetContextType {
    vagas: Equipment[];
    loading: boolean;
    isConnected: boolean;
    lastUpdated: Date | null;
    refreshData: (date?: string, start?: string, end?: string) => Promise<void>;
    filters: {
        date: string;
        startTime: string;
        endTime: string;
    };
    updateFilters: (newFilters: Partial<{ date: string; startTime: string; endTime: string }>) => void;
}

const FleetContext = createContext<FleetContextType>({
    vagas: [],
    loading: true,
    isConnected: false,
    lastUpdated: null,
    refreshData: async () => {},
    filters: { date: '', startTime: '', endTime: '' },
    updateFilters: () => {},
});

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [vagas, setVagas] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    
    // Estado global de filtros. "date" inicia como yyyy-MM-dd
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: ''
    });

    const fetchData = useCallback(async (date: string, start: string, end: string) => {
        try {
            // Chamamos a API passando a data crua (yyyy-MM-dd)
            // O backend.gs fará o parsing necessário
            const res = await api.getVagas(date, start);
            
            if (res.success) {
                setVagas(res.vagas);
                setLastUpdated(new Date());
                
                // Reconecta o socket (simulador) com os novos dados reais vindos da planilha
                socketService.connect(res.vagas);
            }
        } catch (err) {
            console.error("Erro ao buscar dados globais", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 1. Carga Inicial
    useEffect(() => {
        fetchData(filters.date, filters.startTime, filters.endTime);
        
        // Listener Global de Socket
        const unsubscribe = socketService.subscribe((msg: SocketMessage) => {
            if (msg.type === 'CONNECTION') {
                setIsConnected(msg.payload.status === 'connected');
            } else if (msg.type === 'UPDATE') {
                const updatedEquip = msg.payload as Equipment;
                
                setVagas(currentVagas => {
                    const exists = currentVagas.some(v => v.id === updatedEquip.id);
                    if (exists) {
                        return currentVagas.map(v => v.id === updatedEquip.id ? updatedEquip : v);
                    }
                    return currentVagas;
                });
                setLastUpdated(new Date());
            }
        });

        return () => {
            unsubscribe();
            socketService.disconnect();
        };
    }, []); 

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const merged = { ...filters, ...newFilters };
        setFilters(merged);
        setLoading(true); 
        fetchData(merged.date, merged.startTime, merged.endTime);
    };

    return (
        <FleetContext.Provider value={{ 
            vagas, 
            loading, 
            isConnected, 
            lastUpdated, 
            refreshData: () => fetchData(filters.date, filters.startTime, filters.endTime),
            filters,
            updateFilters
        }}>
            {children}
        </FleetContext.Provider>
    );
};

export const useFleet = () => useContext(FleetContext);