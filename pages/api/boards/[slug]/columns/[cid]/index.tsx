import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { Server as SocketIOServer } from 'socket.io';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cid, slug } = req.query;

  const { db, client } = await connectToDatabase();
  const io: SocketIOServer = (res as any).socket.server.io;

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'PATCH': {
        const board = await db
          .collection('columns')
          .updateOne({ _id: cid }, { $set: { ...req.body } });

        io.to(slug).emit('update-column');

        res.send(board);

        break;
      }

      case 'DELETE': {
        await db.collection('cards').remove({ columnId: cid });
        await db.collection('columns').deleteOne({ _id: cid });

        io.to(slug).emit('delete-column');

        res.send({ messsage: 'Deleted' });

        break;
      }

      default:
        res.send({ message: 'Invalid request type' });
        break;
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 });
  }
}
