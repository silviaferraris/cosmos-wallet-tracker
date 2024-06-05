import { useEffect, useState } from 'react';

const Home = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const initializeKeplr = async () => {
      if (!window.keplr) {
        alert('Please install Keplr extension');
        return;
      }

      const chainId = 'osmo-test-4';

      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      setAddress(accounts[0].address);

      const url = `https://lcd-osmosis.blockapsis.com/cosmos/bank/v1beta1/balances/${accounts[0].address}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.balances && data.balances.length > 0) {
        setBalance(data.balances[0].amount);
      }
    };

    initializeKeplr();
  }, []);

 /* const sendTokens = async () => {
    if (!recipient || !amount) {
      alert('Please enter recipient address and amount');
      return;
    }

    const chainId = 'osmo-test-4';
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);

    const accounts = await offlineSigner.getAccounts();
    const account = accounts[0];

    const fee = {
      amount: [{ denom: 'uosmo', amount: '5000' }],
      gas: '200000',
    };

    const msgSend = {
      type: 'cosmos-sdk/MsgSend',
      value: {
        from_address: account.address,
        to_address: recipient,
        amount: [{ denom: 'uosmo', amount: String(amount) }],
      },
    };

    const tx = {
      msg: [msgSend],
      fee: fee,
      chain_id: chainId,
      memo: '',
    };

    const signedTx = await window.keplr.signAmino(chainId, account.address, tx);
    const result = await window.keplr.sendTx(chainId, signedTx, 'sync');

    if (result.code !== undefined) {
      alert('Failed to send transaction: ' + result.log);
    } else {
      alert('Transaction successful!');
    }
  };
  */

  return (
    <div className="container">
      <h1>Wallet Balance Tracker</h1>
      <p>Your Address: {address}</p>
      <p>Balance: {balance}</p>
      <progress value={balance} max="100"></progress>
      {/** */}
     
    </div>
  );
};

export default Home;
