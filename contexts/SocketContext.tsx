
import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socket';
import { SocketMessage, Equipment } from '../types';

interface SocketContextType {
    isConnected: boolean;
    lastMessage: SocketMessage | null;
    connectSocket: (initialData: Equipment[]) => void;
}

const SocketContext = createContext<SocketContextType>({
    isConnected: false,
    lastMessage: null,
    connectSocket: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);

    useEffect(() => {
        // Inscreve para ouvir mensagens do serviço
        const unsubscribe = socketService.subscribe((msg) => {
            if (msg.type === 'CONNECTION') {
                setIsConnected(msg.payload.status === 'connected');
            } else {
                setLastMessage(msg);
            }
        });

        return () => {
            unsubscribe();
            socketService.disconnect();
        };
    }, []);

    const connectSocket = (initialData: Equipment[]) => {
        socketService.connect(initialData);
    };

    return (
        <SocketContext.Provider value={{ isConnected, lastMessage, connectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
