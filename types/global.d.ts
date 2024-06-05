// types/global.d.ts

import { Keplr } from '@keplr-wallet/types';

declare global {
  interface Window {
    keplr: Keplr;
    getOfflineSigner: (chainId: string) => OfflineSigner;
  }
}
