import socketIOClient from 'socket.io-client';
import constants from './constants';

let io = null;

let { socket_url } = constants;

export const getIo = () => {
    if (!io) {
        io = socketIOClient(socket_url);
    }
    return io;
}