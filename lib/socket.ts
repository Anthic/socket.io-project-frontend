
import { io, Socket } from "socket.io-client";

// 'Socket' here is imported from socket.io-client v4 which ships its own types.
// Use 'Socket' as a type by importing it alongside 'io'.

let socket: Socket | null = null;

export const getSocket = (token?: string | null): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000", {
      withCredentials: true,
      autoConnect: false,
      auth: token ? { token } : undefined,
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
export { socket };