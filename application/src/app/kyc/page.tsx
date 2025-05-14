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

export default function KYC() {
  const { publicKey, signMessage, wallet } = useWallet();
  const { initializeKyc, kycStatus, checkKycStatus, setKycStatus } = useKyc();
  const {
    nftStatus,
    isExpired,
    expirationBlock,
    checkNftStatus,
    setTransactionId,
    startPolling,
  } = useNft();
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
        console.log("Checking KYC status 2");
        checkKycStatus(publicKey);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [publicKey, checkKycStatus, kycStatus]);

  useEffect(() => {
    if (kycStatus === "completed" && publicKey && nftStatus !== "minted") {
      // Call the backend to trigger mint and get transactionId
      pollKycStatus();
    }
    // Only run when KYC is completed and NFT is not minted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kycStatus, publicKey, nftStatus]);

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
          console.log("KYC completed, checking status 1");
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

  const pollKycStatus = async () => {
    if (!publicKey) return;

    try {
      const response = await fetch(
        `/api/kyc/status?walletAddress=${publicKey}`
      );
      const data = await response.json();

      setKycStatus(data.status);

      if (data.transactionId) {
        setTransactionId(data.transactionId);
        startPolling(publicKey);
      }
    } catch (error) {
      console.error("Failed to check KYC status:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
            {publicKey ? (
              <div className="space-y-6">
                <WalletInfo />

                {nftStatus === "minted" ? (
                  <NftStatus
                    status={nftStatus}
                    expirationBlock={expirationBlock}
                    isExpired={isExpired}
                  />
                ) : kycStatus === "completed" ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                      <svg
                        className="animate-spin h-8 w-8 text-primary-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-primary-600 mb-2">
                      Minting Your NFT
                    </h2>
                    <p className="text-gray-600 mb-4">
                      We are minting your NFT. This may take a few minutes...
                    </p>
                    <p className="text-sm text-gray-500">
                      You can close this window. We will notify you when the
                      minting is complete.
                    </p>
                  </div>
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
                <h2 className="text-2xl font-semibold text-primary-600 mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-600 mb-6">
                  Please connect your wallet to start the KYC process and mint
                  your NFT
                </p>
                {!publicKey && (
                  <div className="flex justify-center">
                    <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700" />
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
