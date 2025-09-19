import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { Server as SocketIOServer } from 'socket.io';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query;

  const { db, client } = await connectToDatabase();
  const io: SocketIOServer = (res as any).socket.server.io;

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const columns = await db.collection('columns').find({ boardId: slug }).toArray();
        res.send(columns);

        return;
      }

      case 'POST': {
        const {
          id,
          boardId,
          boardName,
          columnName,
          dateCreated,
          userId,
          cards,
          sequence
        } = req.body;

        const data = {
          _id: id,
          boardId,
          boardName,
          columnName,
          dateCreated,
          userId,
          sequence
        };

        const board = await db.collection('columns').insertOne(data);
        res.send(board);

        return;
      }
      case 'PATCH': {
        io.to(slug).emit('update-sequence-column');
        res.send({ message: 'Update to Socket new sequence column' });
        return;
      }

      default:
        res.send({ message: 'DB error' });
        break;
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 });
  }
}
