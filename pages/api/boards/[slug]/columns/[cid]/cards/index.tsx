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
        const columns = await db.collection('cards').find({ boardId: slug }).toArray();
        res.send(columns);
        return;
      }

      case 'POST': {
        const {
          id,
          boardId,
          columnId,
          dateCreated,
          userId,
          title,
          type,
          description,
          sequence
        } = req.body;

        const data = {
          _id: id,
          boardId,
          columnId,
          title,
          type,
          dateCreated,
          userId,
          sequence,
          description
        };

        const card = await db.collection('cards').insertOne(data);

        io.to(boardId).emit('create-card');

        res.send(card);

        return;
      }

      case 'DELETE': {
        const { slug } = req.query;

        await db.collection('columns').remove({ boardId: slug });
        res.send({ message: 'All columns deleted' });

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
