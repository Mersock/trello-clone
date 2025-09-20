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
import { fetchColumns } from '@/src/slices/columns';

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

      socket.on('update-card', () => {
        dispatch(fetchCards());
        console.log('update-card');
      });

      socket.on('update-sequence-column', () => {
        dispatch(fetchColumns());
        console.log('update-sequence-column');
      });

      socket.on('add-column', () => {
        dispatch(fetchColumns());
        console.log('add-column');
      });

      socket.on('update-column', () => {
        dispatch(fetchColumns());
        console.log('update-column');
      });

      socket.on('delete-column', () => {
        dispatch(fetchColumns());
        console.log('delete-column');
      });
    }
    return () => {
      if (socket && board._id) {
        socket.off('create-card');
        socket.off('delete-card');
        socket.off('update-card');
        socket.off('update-sequence-column');
        socket.off('update-column');
        socket.off('add-column');
        socket.off('delete-column');
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
