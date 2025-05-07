import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProviders from "@/components/WalletProviders";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aleo Wallet KYC",
  description: "KYC verification for Aleo wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProviders>
          <main className="min-h-screen bg-gray-100">{children}</main>
        </WalletProviders>
      </body>
    </html>
  );
}
