import {
  Transaction,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { Wallet } from "@demox-labs/aleo-wallet-adapter-react";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { create } from "zustand";
import { PROGRAM_ID } from "../app/constants";

interface MappingItem {
  key: string;
  value: string;
}

const getOwnerIdFromMapping = async (walletAddress: string) => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/nft_owners`
  );
  const data = await response.json();

  //response: {"result":[{"key":"2279379920989854330923140866036463803122508934459349902748446721113771297556field","value":"aleo1xjq48lapjm8mnklr97clfktsl7ddh23jjvjkznl8e9qdajf0lc9q3w5ea3"},{"key":"7716021543827584735088846097352185901935192404164267147972454864599550586848field","value":"aleo1xjq48lapjm8mnklr97clfktsl7ddh23jjvjkznl8e9qdajf0lc9q3w5ea3"}],"cursor":3208318}

  return data.result.find((item: MappingItem) => item.value === walletAddress)
    ?.key;
};

const checkIfHasNFT = async (ownerId: string) => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/address_token_validity`
  );

  // Response: {"result":[{"key":"2279379920989854330923140866036463803122508934459349902748446721113771297556field","value":"true"},{"key":"7716021543827584735088846097352185901935192404164267147972454864599550586848field","value":"true"}],"cursor":3208321}

  const data = await response.json();
  return data.result.find((item: MappingItem) => item.key === ownerId)?.value;
};

const getNFTExpirationBlock = async (ownerId: string) => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/kyc_expiry_date`
  );
  const data = await response.json();
  const value = data.result.find(
    (item: MappingItem) => item.key === ownerId
  )?.value;
  if (!value) return null;
  // Remove 'u64' suffix and convert to integer
  return parseInt(value.replace("u64", ""));
};

const fetchBlockHeight = async () => {
  try {
    const response = await fetch(
      "https://api.explorer.provable.com/v1/mainnet/latest/height"
    );

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching block height:", err);
  }
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
  nftStatus: "not_minted" | "minted" | "expired";
  isExpired: boolean | null;
  expirationBlock: number | null;
  checkNftStatus: (walletAddress: string) => Promise<void>;
  mockMintNft: (walletAddress: string) => Promise<void>;
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

  mockMintNft: async (walletAddress: string) => {
    // Mock implementation - in real app, this would call the Aleo program
    return new Promise((resolve) => {
      setTimeout(() => {
        set({
          nftStatus: "minted",
          isExpired: false,
          expirationBlock: 1000000,
        });
        resolve();
      }, 5000); // 5 second delay as requested
    });
  },
}));
