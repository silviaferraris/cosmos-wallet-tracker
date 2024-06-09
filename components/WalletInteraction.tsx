import { Asset, AssetList } from '@chain-registry/types';
import { StdFee } from '@cosmjs/amino';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import { assets } from "chain-registry";
import { cosmos } from 'juno-network';
import { useState } from 'react';
const BigNumber = require('bignumber.js');

const chainName = 'cosmoshub';

const chainAssets: AssetList = assets.find(chain => chain.chain_name === chainName) as AssetList;
const coin: Asset = chainAssets.assets.find(asset => asset.base === 'uatom') as Asset;

const WalletInteraction = () => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const [isFetchingBalance, setFetchingBalance] = useState(false);
  const [response, setResponse] = useState('');

  const { getSigningStargateClient, address, status, getRpcEndpoint } = useChain(chainName);
  const { client } = useWalletClient();

  const getBalance = async () => {
    if (!address) return;
    setFetchingBalance(true);

    let rpcEndpoint = await getRpcEndpoint();
    if (!rpcEndpoint) {
      console.info('No RPC endpoint — using a fallback');
      rpcEndpoint = `https://rpc.cosmos.directory/${chainName}`;
    }

    const client = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint: typeof rpcEndpoint === 'string' ? rpcEndpoint : rpcEndpoint.url,
    });

    const balance = await client.cosmos.bank.v1beta1.balance({
      address,
      denom: coin.base,
    });

    const exponent = coin.denom_units.find(unit => unit.denom === coin.display)?.exponent as number;
    const amount = new BigNumber(balance.balance?.amount || 0).multipliedBy(10 ** -exponent);
    setBalance(amount);
    setFetchingBalance(false);
  };

  const sendTokens = async () => {
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !address) {
      console.error('stargateClient or address undefined');
      return;
    }

    const msg = cosmos.bank.v1beta1.MessageComposer.withTypeUrl.send({
      amount: [{ denom: coin.base, amount: '1' }],
      toAddress: address,
      fromAddress: address,
    });

    const fee: StdFee = { amount: [{ denom: coin.base, amount: '1' }], gas: '86364' };

    try {
      const response = await stargateClient.signAndBroadcast(address, [msg], fee);
      setResponse(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Cosmos Wallet Interaction</h1>
      {status === 'Connected' ? (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance.toString()}</p>
          <button onClick={getBalance} disabled={isFetchingBalance}>
            {isFetchingBalance ? 'Fetching Balance...' : 'Get Balance'}
          </button>
          <button onClick={sendTokens}>Send 1 uatom to Self</button>
          <pre>{response}</pre>
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default WalletInteraction;
