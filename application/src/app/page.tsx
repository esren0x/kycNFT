"use client";

import { useState, useEffect } from "react";
import { useKyc } from "@/hooks/useKyc";
import { useNft } from "@/hooks/useNft";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletInfo } from "@/components/WalletInfo";
import { NftStatus } from "@/components/NftStatus";
import { KycStatus } from "@/components/KycStatus";

export default function Home() {
  const { publicKey, signMessage, wallet } = useWallet();
  const { initializeKyc, kycStatus, checkKycStatus, setKycStatus } = useKyc();
  const { nftStatus, expirationDate, checkNftStatus, mockMintNft } = useNft();
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      checkNftStatus(publicKey);
    }
  }, [publicKey, checkNftStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (publicKey && kycStatus !== "failed" && kycStatus !== "completed") {
        checkKycStatus(publicKey);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [publicKey, checkKycStatus, kycStatus]);

  useEffect(() => {
    if (kycStatus === "completed" && publicKey) {
      mockMintNft(publicKey);
    }
  }, [kycStatus, publicKey, mockMintNft]);

  const handleStartKyc = async () => {
    if (!publicKey || !signMessage) return;

    setIsLoading(true);
    try {
      const message =
        "Please sign this message to verify your wallet ownership for KYC";
      const bytes = new TextEncoder().encode(message);
      const signatureBytes = await (
        wallet?.adapter as LeoWalletAdapter
      ).signMessage(bytes);
      const signature = new TextDecoder().decode(signatureBytes);
      const response = await initializeKyc(publicKey, signature);
      setAccessToken(response.token);
    } catch (error) {
      console.error("Failed to start KYC:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenExpiration = async () => {
    if (!publicKey) return;

    try {
      const response = await initializeKyc(publicKey, "");
      setAccessToken(response.token);
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  };

  const handleMessage = (type: string, payload: Record<string, unknown>) => {
    console.log("WebSDK Message:", type, payload);

    if (type === "idCheck.onApplicantStatusChanged") {
      const reviewResult = payload.reviewResult as { reviewAnswer: string };
      const reviewStatus = payload.reviewStatus as string;

      if (reviewStatus === "completed") {
        if (reviewResult.reviewAnswer === "GREEN") {
          checkKycStatus(publicKey!);
        } else {
          // If the review answer is not GREEN, mark as failed
          setKycStatus("failed");
        }
      }
    }
  };

  const handleError = (error: Error) => {
    console.error("WebSDK Error:", error);
  };

  return (
    <div className=" flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {publicKey ? (
              <div className="space-y-6">
                <WalletInfo />

                {nftStatus === "minted" ? (
                  <NftStatus
                    status={nftStatus}
                    expirationDate={expirationDate}
                  />
                ) : (
                  <KycStatus
                    status={kycStatus}
                    isLoading={isLoading}
                    onStartKyc={handleStartKyc}
                    accessToken={accessToken}
                    onTokenExpiration={handleTokenExpiration}
                    onMessage={handleMessage}
                    onError={handleError}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-600 mb-6">
                  Please connect your wallet to start the KYC process and mint
                  your NFT
                </p>
                {!publicKey && (
                  <div className="flex justify-center">
                    <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
