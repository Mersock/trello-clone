import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import UserNavbar from '@/src/components/user-navbar';
import SubNavbar from '@/src/components/sub-navbar';
import { useAppSelector } from '@/src/hooks';

import BoardColumns from '@/src/components/board/columns';
import PropType from 'prop-types';
import { useSocket } from '@/src/context/SocketContext';
import { useDispatch } from 'react-redux';
import { fetchCards } from '@/src/slices/cards';

const Board = (): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);
  const { socket } = useSocket(board._id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket && board._id) {
      socket.on('create-card', () => {
        dispatch(fetchCards());
        console.log('care-card');
      });

      socket.on('delete-card', () => {
        dispatch(fetchCards());
        console.log('delete-card');
      });
    }
    return () => {
      if (socket && board._id) {
        socket.off('create-card');
        socket.off('delete-card');
      }
    };
  }, [socket, board, dispatch]);

  return (
    <Box
      backgroundImage={`url('${board.backgroundImage}')`}
      backgroundPosition="center"
      h="100vh"
      backgroundRepeat="no-repeat"
      backgroundSize="cover">
      <UserNavbar />
      <SubNavbar board={board} />
      <BoardColumns />
    </Box>
  );
};

Board.propTypes = {
  board: PropType.object
};

export default Board;
