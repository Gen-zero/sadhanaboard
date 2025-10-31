declare module 'socket.io-client' {
  export type Socket = {
    id?: string;
    on: (event: string, cb: (...args: unknown[]) => void) => void;
    off: (event: string, cb?: (...args: unknown[]) => void) => void;
    emit: (event: string, ...args: unknown[]) => void;
    disconnect: () => void;
    connected?: boolean;
  };
  const io: (...args: unknown[]) => Socket;
  export default io;
}