declare module 'socket.io-client' {
  export type Socket = {
    id?: string;
    on: (event: string, cb: (...args: any[]) => void) => void;
    off: (event: string, cb?: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
    disconnect: () => void;
    connected?: boolean;
  };
  const io: any;
  export default io;
}
