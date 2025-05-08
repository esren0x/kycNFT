import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProviders from "@/components/WalletProviders";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <WalletProviders>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </WalletProviders>
      </body>
    </html>
  );
}
