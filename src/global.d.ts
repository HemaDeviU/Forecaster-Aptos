// global.d.ts

interface MartianAccount {
    address: string;
    publicKey: string;
  }
  
  interface Martian {
    connect: () => Promise<{ address: string; publicKey: string }>;
    account: () => Promise<MartianAccount>;
    isConnected: () => Promise<boolean>;
    disconnect: () => Promise<void>;
  }
  
  interface Window {
    martian?: Martian;
  }