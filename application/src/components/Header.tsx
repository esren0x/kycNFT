"use client";
import Link from "next/link";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useState } from "react";

export const Header = () => {
  const { publicKey } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-innovator font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 hover:opacity-80 transition-opacity"
            >
              VerifyIT
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/verify"
              className="text-gray-600 hover:text-primary-600 transition-colors relative group font-abcd"
            >
              Verify
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/kyc"
              className="text-gray-600 hover:text-primary-600 transition-colors relative group font-abcd"
            >
              Get Verified
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/gallery"
              className="text-gray-600 hover:text-primary-600 transition-colors relative group font-abcd"
            >
              Gallery
            </Link>
            <Link
              href="/docs"
              className="text-gray-600 hover:text-primary-600 transition-colors relative group font-abcd"
            >
              Docs
            </Link>
          </nav>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center">
            {publicKey ? (
              <WalletMultiButton className="!bg-gradient-to-r !from-primary-600 !to-secondary-600 hover:!opacity-90 !transition-opacity !rounded-lg !shadow-sm" />
            ) : (
              <div className="h-[48px] w-[165px]" />
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-2">
          <Link
            href="/verify"
            className="block px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 font-abcd"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Verify
          </Link>
          <Link
            href="/kyc"
            className="block px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 font-abcd"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Verified
          </Link>
          <Link
            href="/gallery"
            className="block px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 font-abcd"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/docs"
            className="block px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 font-abcd"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Docs
          </Link>
          <div className="px-4 py-2">
            {publicKey ? (
              <WalletMultiButton className="!bg-gradient-to-r !from-primary-600 !to-secondary-600 hover:!opacity-90 !transition-opacity !rounded-lg !shadow-sm w-full" />
            ) : (
              <div className="h-[48px] w-full bg-gray-200 rounded-lg animate-pulse" />
            )}
          </div>
        </div>
      )}
    </header>
  );
};
