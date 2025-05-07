"use client";

import { useState, useEffect } from "react";
import { useKyc } from "@/hooks/useKyc";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

const Header = () => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">Aleo KYC Verification</h1>
      <p className="text-blue-100 mt-2">
        Secure and compliant identity verification
      </p>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t py-6 mt-auto">
    <div className="container mx-auto px-4 text-center text-gray-600">
      <p>© 2024 Aleo KYC. All rights reserved.</p>
    </div>
  </footer>
);

const WalletInfo = () => {
  const { wallet, publicKey, connected, wallets } = useWallet();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Wallet Information</h2>
      <div className="space-y-2 text-sm">
        <p className="flex items-center">
          <span className="font-medium w-24">Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              connected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </p>
        {publicKey && (
          <p className="flex items-center">
            <span className="font-medium w-24">Public Key:</span>
            <span className="text-gray-600 font-mono text-xs truncate">
              {publicKey}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const { publicKey, signMessage, wallet } = useWallet();
  const { initializeKyc, kycStatus, checkKycStatus } = useKyc();
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (publicKey && kycStatus !== "failed") {
        checkKycStatus(publicKey);
      }
    }, 30000);

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-end mb-6">
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
            </div>

            {publicKey ? (
              <div className="space-y-6">
                <WalletInfo />

                {!accessToken && kycStatus === "not_started" && (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Start Your KYC Verification
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Complete the verification process to access all features
                    </p>
                    <button
                      onClick={handleStartKyc}
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Starting KYC...
                        </>
                      ) : (
                        "Start KYC Process"
                      )}
                    </button>
                  </div>
                )}

                {accessToken && kycStatus !== "completed" && (
                  <div className="h-[600px] border rounded-lg overflow-hidden">
                    <SumsubWebSdk
                      accessToken={accessToken}
                      expirationHandler={handleTokenExpiration}
                      config={{
                        lang: "en",
                        email: "",
                        phone: "",
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
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-green-600 mb-2">
                      Verification Completed!
                    </h2>
                    <p className="text-gray-600">
                      Your KYC verification has been successfully completed.
                    </p>
                  </div>
                )}

                {kycStatus === "failed" && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">
                      Verification Failed
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We couldn't complete your verification. Please try again.
                    </p>
                    <button
                      onClick={handleStartKyc}
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-600 mb-6">
                  Please connect your Aleo wallet to start the KYC verification
                  process
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
