import { getAllOwnersInformation } from "../../lib/mappings";
import { fetchBlockHeight } from "../../lib/utils";
import NFT from "../nft";

export default async function Gallery() {
  const owners = await getAllOwnersInformation();
  const blockHeight = await fetchBlockHeight();

  const ownersWithExpired = owners.map((owner) => ({
    ...owner,
    expired: owner.expirationBlock
      ? owner.expirationBlock < blockHeight
      : false,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-4">
              NFT Gallery
            </h1>
            <p className="text-xl text-gray-600">
              Browse all verified wallets on the Aleo network
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Total Verified
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {owners.length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Active NFTs
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {ownersWithExpired.filter((owner) => !owner.expired).length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Expired NFTs
              </h3>
              <p className="text-3xl font-bold text-secondary-600">
                {ownersWithExpired.filter((owner) => owner.expired).length}
              </p>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {owners.map((owner) => (
              <NFT owner={owner} key={owner.ownerId} />
            ))}
          </div>

          {/* Empty State */}
          {owners.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No NFTs Found
              </h3>
              <p className="text-gray-500">
                Be the first to get verified and mint your KYC NFT!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
