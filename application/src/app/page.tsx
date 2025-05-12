import { getAllOwnersInformation } from "../lib/mappings";
import NFT from "./nft";
import Link from "next/link";

export default async function Home() {
  const owners = await getAllOwnersInformation();
  const recentOwners = owners.slice(0, 3); // Get only the 3 most recent owners for the gallery

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-6">
              KYC Verification on Aleo Chain
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Secure, decentralized KYC verification for Aleo wallets. Verify
              once, use everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kyc"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Verified
              </Link>
              <Link
                href="/verify"
                className="px-8 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Verify Wallet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose kycNFT?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">For Users</h3>
                <p className="text-gray-600">
                  Complete KYC once and use your verified status across multiple
                  services on Aleo chain.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">For Companies</h3>
                <p className="text-gray-600">
                  Integrate KYC verification into your service without building
                  your own KYC infrastructure.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
                <p className="text-gray-600">
                  Simple API endpoints to verify wallet KYC status. Integrate in
                  minutes, not months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live NFT Gallery */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Recently Verified Wallets
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentOwners.map((owner) => (
                <NFT owner={owner} key={owner.ownerId} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/gallery"
                className="inline-block px-6 py-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                View All NFTs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* API Integration Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Simple API Integration
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`// Verify wallet KYC status
GET https://kyc-nft.vercel.app/api/verify?wallet=aleo1...

// Response
{
  "verified": true,
  "expirationBlock": 123456,
  "ownerId": "abc123..."
}`}</code>
              </pre>
            </div>
            <div className="text-center">
              <Link
                href="/docs"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                View API Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the growing network of verified Aleo wallets and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kyc"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Verified Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
