import { useEffect, useState } from "react";
import { Asset, AssetList } from "@chain-registry/types";
import { StdFee } from "@cosmjs/amino";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { cosmos } from "juno-network";
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

const castToSigningStargateClient = (client: unknown): SigningStargateClient => {
  return client as SigningStargateClient;
};

export const sendTokens = (
  getSigningStargateClient: () => Promise<SigningStargateClient>,
  setResp: (resp: string) => any,
  address: string
) => {
  return async () => {
    const stargateClient = castToSigningStargateClient(await getSigningStargateClient());
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