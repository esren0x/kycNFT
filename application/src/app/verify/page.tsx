"use client";

import VerifyWallet from "@/components/VerifyWallet";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Verify Wallet KYC Status
            </h1>
            <p className="text-xl text-gray-600">
              Check if any Aleo wallet is KYC verified or connect your wallet to
              verify its status
            </p>
          </div>

          <VerifyWallet />

          <div className="mt-12 text-center text-gray-600">
            <p className="mb-4">
              Need to verify multiple wallets? Check out our{" "}
              <a
                href="/docs"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                API documentation
              </a>{" "}
              for programmatic verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
