"use client";
import Link from "next/link";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
export const Header = () => {
  const { publicKey } = useWallet();
  return (
    <header className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 hover:opacity-80 transition-opacity"
            >
              kyc NFT
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/verify"
              className="text-gray-600 hover:text-primary-600 transition-colors relative group"
            >
              Verify
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/kyc"
              className="text-gray-600 hover:text-primary-600 transition-colors relative group"
            >
              Get Verified
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <div className="flex items-center">
            {publicKey ? (
              <WalletMultiButton className="!bg-gradient-to-r !from-primary-600 !to-secondary-600 hover:!opacity-90 !transition-opacity !rounded-lg !shadow-sm" />
            ) : (
              <div className="h-[48px] w-[165px]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
