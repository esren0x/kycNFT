import { create } from "zustand";
import axios from "axios";

type KycStatus = "not_started" | "in_progress" | "completed" | "failed";

interface KycState {
  kycStatus: KycStatus;
  initializeKyc: (
    walletAddress: string,
    signature: string
  ) => Promise<{ token: string }>;
  checkKycStatus: (walletAddress: string) => Promise<void>;
  setKycStatus: (status: KycStatus) => void;
}

export const useKyc = create<KycState>((set) => ({
  kycStatus: "not_started",

  initializeKyc: async (walletAddress: string, signature: string) => {
    try {
      const response = await axios.post("/api/kyc/initialize", {
        walletAddress,
        signature,
      });

      if (response.data.success) {
        set({ kycStatus: "in_progress" });
        return { token: response.data.token };
      } else {
        throw new Error(response.data.error || "Failed to initialize KYC");
      }
    } catch (error) {
      console.error("Failed to initialize KYC:", error);
      set({ kycStatus: "failed" });
      throw error;
    }
  },

  checkKycStatus: async (walletAddress: string) => {
    try {
      const response = await axios.get(
        `/api/kyc/status?walletAddress=${walletAddress}`
      );

      if (response.data.status) {
        set({ kycStatus: response.data.status });
      }
    } catch (error) {
      console.error("Failed to check KYC status:", error);
    }
  },

  setKycStatus: (status: KycStatus) => {
    set({ kycStatus: status });
  },
}));
