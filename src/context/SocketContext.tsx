import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

let socket: Socket;

export const useSocket = (boardId: string): ISocketContext => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket = io();
    const initSocket = async () => {
      await fetch('/api/socket');

      socket.on('connect', () => {
        setIsConnected(true);
        socket.emit('join-board', boardId);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });
    };
    initSocket();

    return () => {
      socket.emit('leave-board', boardId);
      socket.disconnect();
    };
  }, [boardId]);

  return { isConnected, socket };
};
