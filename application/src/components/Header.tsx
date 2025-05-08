"use client";
import Link from "next/link";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
export const Header = () => {
  const { publicKey } = useWallet();
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Aleo KYC
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/verify"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Verify
            </Link>
            <Link
              href="/status"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Status
            </Link> */}
          </nav>
          <div className="flex items-center">
            {publicKey && (
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
