import { io } from 'socket.io-client';

export const socket = io('http://192.168.1.47:3001', {
  transports: ['websocket']
});


// export const socket = io('https://simplecode.online', {
//   transports: ['websocket']
// });
