"use client";

import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";

export default function WalletProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const walletsInfo = [
    new LeoWalletAdapter({
      appName: "KYC NFT",
    }),
  ];

  return (
    <WalletProvider
      wallets={walletsInfo}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
}
