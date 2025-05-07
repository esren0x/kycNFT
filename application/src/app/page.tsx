"use client";

import { useState, useEffect } from "react";
import { useKyc } from "@/hooks/useKyc";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

export const WalletInfo = () => {
  const { wallet, publicKey, connected, wallets } = useWallet();

  return (
    <>
      <div>
        <p>Public Key: {publicKey}</p>
        <p>Wallet: {wallet ? wallet.toString() : ""}</p>
        <p>Wallets: {wallets.length}</p>
        <p>Connected: {connected ? "true" : "false"}</p>
      </div>
    </>
  );
};

export default function Home() {
  const { publicKey, signMessage, wallet } = useWallet();
  const { initializeKyc, kycStatus, checkKycStatus } = useKyc();
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check KYC status periodically
    const interval = setInterval(() => {
      if (publicKey && kycStatus !== "failed") {
        checkKycStatus(publicKey);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [publicKey, checkKycStatus, kycStatus]);

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
  };

  const handleError = (error: Error) => {
    console.error("WebSDK Error:", error);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Aleo Wallet KYC</h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <WalletMultiButton />
        {publicKey && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connected Wallet: {publicKey}
            </p>

            {!accessToken && kycStatus === "not_started" && (
              <button
                onClick={handleStartKyc}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Starting KYC..." : "Start KYC Process"}
              </button>
            )}

            {accessToken && (
              <div className="h-[600px]">
                <SumsubWebSdk
                  accessToken={accessToken}
                  expirationHandler={handleTokenExpiration}
                  config={{
                    lang: "en",
                    email: "", // Optional: Add user's email if available
                    phone: "", // Optional: Add user's phone if available
                  }}
                  options={{
                    addViewportTag: false,
                    adaptIframeHeight: true,
                  }}
                  onMessage={handleMessage}
                  onError={handleError}
                />
              </div>
            )}

            {kycStatus === "completed" && (
              <div className="text-center">
                <p className="text-green-600">KYC verification completed!</p>
              </div>
            )}

            {kycStatus === "failed" && (
              <div className="text-center">
                <p className="text-red-600">KYC verification failed</p>
                <button
                  onClick={handleStartKyc}
                  disabled={isLoading}
                  className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
