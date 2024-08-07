import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';
import { API_URL } from '../../constants';

interface WebSocketContextType {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log('Attempting to connect WebSocket for user:', user.id);
      const newSocket = io(`${API_URL}`);

      newSocket.on('connect', () => {
        console.log('WebSocket connected successfully');
        console.log(user);
        newSocket.emit('joinRoom', user.id);
        console.log('Emitted joinRoom event for user:', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      newSocket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      newSocket.on('notification', (notification) => {
        console.log('Received notification:', notification);
      });

      setSocket(newSocket);

      return () => {
        console.log('Cleaning up WebSocket connection');
        newSocket.close();
      };
    } else {
      console.log('User is undefined, WebSocket not connected');
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
