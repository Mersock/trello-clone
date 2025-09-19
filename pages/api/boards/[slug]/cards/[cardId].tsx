import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { Server as SocketIOServer } from 'socket.io';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId, slug } = req.query;

  const { db, client } = await connectToDatabase();
  const io: SocketIOServer = (res as any).socket.server.io;

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        res.send({ message: 'Get more details of the card' });
        return;
      }

      case 'DELETE': {
        await db.collection('cards').deleteOne({ _id: cardId });
        io.to(slug).emit('delete-card');
        res.send({ message: 'A card has been deleted' });

        return;
      }

      case 'PATCH': {
        await db
          .collection('cards')
          .updateOne({ _id: cardId, boardId: slug }, { $set: { ...req.body } });

        res.send({ message: 'Card updated' });
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
