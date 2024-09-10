import { io } from 'socket.io-client';

// export const socket = io('http://192.168.1.45:3001', {
//   transports: ['websocket']
// });


export const socket = io(process.env.EXPO_PUBLIC_BACKEND_URL, {
  transports: ['websocket']
});
