import {
  Transaction,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { Wallet } from "@demox-labs/aleo-wallet-adapter-react";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { create } from "zustand";
import { PROGRAM_ID } from "../app/constants";
import { checkIfHasNFT, getNFTExpirationBlock } from "../lib/mappings";
import { getOwnerIdFromMapping } from "../lib/mappings";
import { fetchBlockHeight } from "../lib/utils";

export const verifyKyc = async (walletAddress: string, wallet: Wallet) => {
  console.log("will verify kyc");
  const tx = Transaction.createTransaction(
    "at13nh0m0s8qmyn0qhvywcczudkyu9r8w82flwked2ss04ulr70ns9qppkukq",
    WalletAdapterNetwork.TestnetBeta,
    PROGRAM_ID,
    "verify_kyc",
    [walletAddress],
    150195,
    false
  );
  await (wallet.adapter as LeoWalletAdapter).requestTransaction(tx);
};

interface NftState {
  nftStatus: "unverified" | "not_minted" | "minting" | "minted" | "expired";
  isExpired: boolean | null;
  expirationBlock: number | null;
  transactionId: string | null;
  checkNftStatus: (walletAddress: string) => Promise<void>;
  resetNftStatus: () => void;
  setTransactionId: (txId: string) => void;
  startPolling: (walletAddress: string) => void;
  stopPolling: () => void;
}

let pollingInterval: NodeJS.Timeout | null = null;

export const useNft = create<NftState>((set, get) => ({
  nftStatus: "not_minted",
  isExpired: null,
  expirationBlock: null,
  transactionId: null,
  checkNftStatus: async (walletAddress: string) => {
    try {
      const ownerId = await getOwnerIdFromMapping(walletAddress);
      console.log("ownerId", ownerId);

      if (ownerId && !!(await checkIfHasNFT(ownerId))) {
        const expirationBlock = await getNFTExpirationBlock(ownerId);
        const blockHeight = await fetchBlockHeight();
        set({
          nftStatus: "minted",
          isExpired: expirationBlock ? expirationBlock < blockHeight : null,
          expirationBlock: expirationBlock,
        });
      } else {
        set({
          nftStatus: "not_minted",
          isExpired: null,
        });
      }
    } catch (error) {
      console.error("Failed to check NFT status:", error);
      set({
        nftStatus: "not_minted",
        isExpired: null,
      });
    }
  },
  resetNftStatus: () => {
    set({
      nftStatus: "unverified",
      isExpired: null,
      expirationBlock: null,
      transactionId: null,
    });
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },
  setTransactionId: (txId: string) => {
    set({
      transactionId: txId,
      nftStatus: "minting",
    });
  },
  startPolling: (walletAddress: string) => {
    // Clear any existing polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Start polling every 10 seconds
    pollingInterval = setInterval(async () => {
      await get().checkNftStatus(walletAddress);

      // If NFT is found, stop polling
      if (get().nftStatus === "minted") {
        get().stopPolling();
      }
    }, 10000);
  },
  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },
}));
