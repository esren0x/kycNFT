/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useNft } from "@/hooks/useNft";
import { convertANSDomainToWalletAddress } from "@/lib/ans";
import { KycLoadingSkeleton } from "@/components/KycLoadingSkeleton";
import { EstimatedExpirationTime } from "./NftStatus";
export default function VerifyWallet() {
  const { publicKey } = useWallet();
  const {
    nftStatus,
    isExpired,
    expirationBlock,
    checkNftStatus,
    resetNftStatus,
  } = useNft();
  const [inputAddress, setInputAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inputAddress && !publicKey) {
      resetNftStatus();
    }
  }, [inputAddress, publicKey, resetNftStatus]);

  useEffect(() => {
    if (publicKey) {
      setInputAddress(publicKey.toString());
      handleVerify(publicKey.toString());
    } else if (inputAddress) {
      setInputAddress("");
    }
  }, [publicKey]);

  useEffect(() => {
    console.log("nftStatus", nftStatus);
    console.log("inputAddress", inputAddress);
    console.log("publicKey", publicKey);
  }, [nftStatus, inputAddress, publicKey]);

  const handleVerify = async (address: string) => {
    setIsLoading(true);
    setError(null);
    if (address.endsWith(".ans")) {
      const convertedAddress = await convertANSDomainToWalletAddress(address);
      console.log("Converted address:", convertedAddress);
      if (!convertedAddress || convertedAddress == "Private Registration") {
        setError(
          "Invalid ANS domain. Please enter a valid Aleo domain or wallet address."
        );
        setIsLoading(false);
        return;
      }
      address = convertedAddress;
    }
    try {
      console.log("Checking NFT status for wallet:", address);
      await checkNftStatus(address);
    } catch (err) {
      setError(
        "Failed to verify wallet status. Please check the address and try again."
      );
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress.trim()) {
      handleVerify(inputAddress.trim());
    }
  };

  const getStatusDisplay = () => {
    if ((!publicKey && !inputAddress) || nftStatus === "unverified") {
      return null;
    }
    if (nftStatus === "minted") {
      return (
        <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-center">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <h3 className="text-lg font-innovator font-semibold text-green-700">
              Wallet is KYC Verified
            </h3>
          </div>
          {expirationBlock && (
            <div className="flex text-sm gap-2 flex-col text-green-600 items-center">
              <p className="mt-2 text-sm font-abcd">
                Expiration Block: {expirationBlock}
                {isExpired && " (Expired)"}
              </p>
              <EstimatedExpirationTime expirationBlock={expirationBlock} />
            </div>
          )}
        </div>
      );
    } else if (nftStatus === "not_minted") {
      return (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-center">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <h3 className="text-lg font-innovator font-semibold text-red-700">
              Wallet is not KYC Verified
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-600 font-abcd">
            This wallet has not completed the KYC verification process.
          </p>
        </div>
      );
    } else if (nftStatus === "checking") {
      return <KycLoadingSkeleton />;
    }
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-innovator font-bold text-gray-900 mb-6">
        Verify Wallet KYC Status
      </h2>

      {/* Manual Address Input */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="walletAddress"
              className="block text-sm font-medium text-gray-700 mb-1 font-abcd"
            >
              Enter Aleo Wallet Address or ANS Domain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="walletAddress"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="aleo1... or your.ans"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-abcd"
              />
              <button
                type="submit"
                disabled={isLoading || !inputAddress.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-abcd"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 font-abcd">or</span>
        </div>
      </div>

      {/* Connect Wallet Button */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4 font-abcd">
          Connect your wallet to verify its status
        </p>
        <div className="flex justify-center">
          <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700" />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600 font-abcd">{error}</p>
        </div>
      )}

      {/* Status Display */}
      {getStatusDisplay()}

      {/* Connected Wallet Status */}
      {publicKey && nftStatus === "not_minted" && (
        <div className="mt-4 text-center">
          <button
            onClick={() => handleVerify(publicKey)}
            disabled={isLoading}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium font-abcd"
          >
            Check my wallet status
          </button>
        </div>
      )}
    </div>
  );
}
