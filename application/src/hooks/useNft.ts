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

const MINTING_STATUS_KEY = "nft_minting_status";

// Helper functions for managing wallet-specific minting status
const getMintingStatuses = (): Record<string, boolean> => {
  const stored = localStorage.getItem(MINTING_STATUS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const setMintingStatus = (walletAddress: string, isMinting: boolean) => {
  const statuses = getMintingStatuses();
  if (isMinting) {
    statuses[walletAddress] = true;
  } else {
    delete statuses[walletAddress];
  }
  localStorage.setItem(MINTING_STATUS_KEY, JSON.stringify(statuses));
};

const clearMintingStatus = (walletAddress: string) => {
  setMintingStatus(walletAddress, false);
};

const isWalletMinting = (walletAddress: string): boolean => {
  const statuses = getMintingStatuses();
  return !!statuses[walletAddress];
};

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
  nftStatus:
    | "unverified"
    | "not_minted"
    | "minting"
    | "minted"
    | "expired"
    | "checking"
    | "error";
  isExpired: boolean | null;
  expirationBlock: number | null;
  transactionId: string | null;
  checkNftStatus: (walletAddress: string) => Promise<void>;
  resetNftStatus: () => void;
  setTransactionId: (txId: string) => void;
  startPolling: (walletAddress: string) => void;
  stopPolling: () => void;
  onMintStarted: (walletAddress: string) => void;
}

let pollingInterval: NodeJS.Timeout | null = null;

export const useNft = create<NftState>((set, get) => ({
  nftStatus: "checking",
  isExpired: null,
  expirationBlock: null,
  transactionId: null,
  checkNftStatus: async (walletAddress: string) => {
    try {
      // Check local storage first for this specific wallet
      console.log("Checking NFT status for wallet:", walletAddress);

      const ownerId = await getOwnerIdFromMapping(walletAddress);
      console.log("ownerId", ownerId);

      if (ownerId && !!(await checkIfHasNFT(ownerId))) {
        const expirationBlock = await getNFTExpirationBlock(ownerId);
        const blockHeight = await fetchBlockHeight();
        clearMintingStatus(walletAddress); // Clear minting status for this wallet if NFT is found
        set({
          nftStatus: "minted",
          isExpired: expirationBlock ? expirationBlock < blockHeight : null,
          expirationBlock: expirationBlock,
        });
      } else {
        const isMinting = isWalletMinting(walletAddress);
        console.log("Is wallet minting?", isMinting);

        if (isMinting) {
          // Call the endpoint to verify if the minting transaction has failed
          const response = await fetch("/api/kyc/verify-error", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletAddress }),
          });
          const data = await response.json();
          if (!data.hasError) {
            console.log("Setting state to minting");
            set({ nftStatus: "minting" });
            return;
          } else {
            console.log("Setting state to error");
            set({ nftStatus: "error" });
            return;
          }
        }

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
    // We don't clear all minting statuses here anymore since it's wallet-specific
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
  onMintStarted: (walletAddress: string) => {
    console.log("Starting mint for wallet:", walletAddress);
    setMintingStatus(walletAddress, true);
    console.log("Set minting status in localStorage");
    set({ nftStatus: "minting" });
    console.log("Updated zustand state to minting");
  },
}));
