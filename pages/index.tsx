import { Asset, AssetList } from "@chain-registry/types";
import { StdFee } from "@cosmjs/amino";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { cosmos } from "juno-network";
import { useEffect, useState } from "react";
import { useStyles } from "../style";

import {
  Button,
  Card,
  CardContent,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";

const chainName = "cosmoshub";

const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;

const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === "uatom"
) as Asset;

const sendTokens = (
  getSigningStargateClient: () => Promise<SigningStargateClient>,
  setResp: (resp: string) => any,
  address: string
) => {
  return async () => {
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !address) {
      console.error("stargateClient undefined or address undefined.");
      return;
    }

    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

    const msg = send({
      amount: [
        {
          denom: coin.base,
          amount: "1",
        },
      ],
      toAddress: address,
      fromAddress: address,
    });

    const fee: StdFee = {
      amount: [
        {
          denom: coin.base,
          amount: "1",
        },
      ],
      gas: "86364",
    };
    try {
      const response = await stargateClient.signAndBroadcast(
        address,
        [msg],
        fee
      );
      setResp(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(error);
    }
  };
};

export default function () {
  const [balance, setBalance] = useState(new BigNumber(0));
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { client } = useWalletClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [txHash, setTxHash] = useState("");
  const [resp, setResp] = useState("");

  const {
    getSigningStargateClient,
    address,
    getRpcEndpoint,
    connect,
    isWalletConnected,
    disconnect,
  } = useChain(chainName);

  const classes = useStyles();

  useEffect(() => {
    const getBalance = async () => {
      if (!address) {
        setBalance(new BigNumber(0));
        return;
      }

      let rpcEndpoint = await getRpcEndpoint();

      if (!rpcEndpoint) {
        console.info("no rpc endpoint — using a fallback");
        rpcEndpoint = `https://rpc.cosmos.directory/${chainName}`;
      }
      const client = await cosmos.ClientFactory.createRPCQueryClient({
        rpcEndpoint:
          typeof rpcEndpoint === "string"
            ? rpcEndpoint
            : (rpcEndpoint as ExtendedHttpEndpoint).url,
      });

      const balance = await client.cosmos.bank.v1beta1.balance({
        address,
        denom: chainassets?.assets[0].base as string,
      });

      const exp = coin.denom_units.find((unit) => unit.denom === coin.display)
        ?.exponent as number;

      const a = new BigNumber(balance.balance?.amount || 0);
      const amount = a.multipliedBy(10 ** -exp);
      setBalance(amount);
    };
    getBalance();
  }, [address, getRpcEndpoint]);

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

 /*  const handleSendTokens = async () => {
    if (!recipient || !amount) {
      setErrorMessage("Recipient and amount are required.");
      return;
    }
    setErrorMessage("");

    sendTokens(getSigningStargateClient, setResp, address);
  } */;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <div>
            {!isWalletConnected && (
              <Button
                onClick={() => connect()}
                variant="contained"
                color="primary"
                className={classes.textField}
              >
                Connect
              </Button>
            )}
            <Typography variant="h6">Chain Name: {chainName}</Typography>
            <Typography variant="h6">Address: {address}</Typography>
            <Typography variant="h6">
              Balance: {Number(balance)} ATOM{" "}
            </Typography>
            <div className={classes.progressBarContainer}>
              <div
                className={classes.progressBar}
                style={{ width: `${(Number(balance) / 100) * 100}%` }}
              ></div>
            </div>
            <TextField
              label="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              fullWidth
              className={classes.textField}
            />
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              fullWidth
              className={classes.textField}
            />
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
            {txHash && (
              <Typography variant="body1">
                Transaction Hash: {txHash}
              </Typography>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {isWalletConnected && (
                <Button
                  onClick={() => disconnect()}
                  variant="contained"
                  color="secondary"
                  className={classes.textField}
                >
                  Disconnect
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => null}
                className={classes.textField}
              >
                Send Tokens
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </div>
  );
}
