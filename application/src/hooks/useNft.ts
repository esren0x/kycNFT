import { create } from "zustand";

interface NftState {
  nftStatus: "not_minted" | "minted" | "expired";
  expirationDate: Date | null;
  checkNftStatus: (walletAddress: string) => Promise<void>;
  mockMintNft: (walletAddress: string) => Promise<void>;
}

export const useNft = create<NftState>((set) => ({
  nftStatus: "not_minted",
  expirationDate: null,

  checkNftStatus: async (walletAddress: string) => {
    // Mock implementation - in real app, this would call the Aleo program
    try {
      // For now, we'll just check if there's a KYC status
      const response = await fetch(
        `/api/kyc/status?walletAddress=${walletAddress}`
      );
      const data = await response.json();

      if (data.status === "completed") {
        // Mock: Set expiration to 1 year from now
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        set({
          nftStatus: "minted",
          expirationDate,
        });
      } else {
        set({
          nftStatus: "not_minted",
          expirationDate: null,
        });
      }
    } catch (error) {
      console.error("Failed to check NFT status:", error);
      set({
        nftStatus: "not_minted",
        expirationDate: null,
      });
    }
  },

  mockMintNft: async (walletAddress: string) => {
    // Mock implementation - in real app, this would call the Aleo program
    return new Promise((resolve) => {
      setTimeout(() => {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        set({
          nftStatus: "minted",
          expirationDate,
        });
        resolve();
      }, 5000); // 5 second delay as requested
    });
  },
}));
