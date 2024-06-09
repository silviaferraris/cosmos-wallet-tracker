import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { ChainProvider } from '@cosmos-kit/react';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import { assets, chains } from 'chain-registry';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [loadingWallets, setLoadingWallets] = useState<boolean>(true);

  useEffect(() => {
    setLoadingWallets(false);
  }, []);

  if (loadingWallets) {
    return <>Loading...</>;
  }

  return (
    <ChainProvider
      chains={chains}
      assetLists={assets}
      wallets={[...keplrWallets]}
      defaultNameService="stargaze"
    >
      <Component {...pageProps} />
    </ChainProvider>
  );
};

export default MyApp;
