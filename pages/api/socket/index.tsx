import { Server, Socket } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket as NetSocket } from 'net';
import { Server as HttpServer } from 'http';

interface SocketServer extends HttpServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket): void => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket: Socket) => {
      console.log('User connected', socket.id);

      socket.on('join-board', (boardId: string) => {
        socket.join(boardId);
        console.log(`User ${socket.id} joined board ${boardId}`);
      });

      socket.on('leave-board', (boardId: string) => {
        socket.leave(boardId);
        console.log(`User ${socket.id} left board ${boardId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
      });
    });
  }
  res.end();

  return;
};

export default SocketHandler;
