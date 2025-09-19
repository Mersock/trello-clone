import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

let socket: Socket;

export const useSocket = (): ISocketContext => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { isConnected, socket };
};
