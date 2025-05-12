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
  nftStatus: "unverified" | "not_minted" | "minted" | "expired";
  isExpired: boolean | null;
  expirationBlock: number | null;
  checkNftStatus: (walletAddress: string) => Promise<void>;
  resetNftStatus: () => void;
  // mockMintNft: (walletAddress: string) => Promise<void>;
}

export const useNft = create<NftState>((set) => ({
  nftStatus: "not_minted",
  isExpired: null,
  expirationBlock: null,
  checkNftStatus: async (walletAddress: string) => {
    try {
      const ownerId = await getOwnerIdFromMapping(walletAddress);
      const hasNFT = !!(await checkIfHasNFT(ownerId));
      const expirationBlock = await getNFTExpirationBlock(ownerId);
      const blockHeight = await fetchBlockHeight();

      if (hasNFT) {
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
    });
  },

  // mockMintNft: async (walletAddress: string) => {
  //   // Mock implementation - in real app, this would call the Aleo program
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       set({
  //         nftStatus: "minted",
  //         isExpired: false,
  //         expirationBlock: 1000000,
  //       });
  //       resolve();
  //     }, 5000); // 5 second delay as requested
  //   });
  // },
}));
