"use client";

import { useEffect, useState } from "react";
import { getAllOwnersInformation } from "../../lib/mappings";
import { fetchBlockHeight } from "../../lib/utils";
import NFT from "../nft";
import { OwnerInformation } from "@/lib/mappings";

export function SkeletonCard() {
  return (
    <div className="relative w-80 rounded-xl overflow-hidden bg-gray-200 p-[16px] shadow-lg animate-pulse">
      <div className="bg-gray-300 rounded-xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-24 bg-gray-400 rounded"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        </div>
        <div className="w-full h-48 bg-gray-400 rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div>
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-400 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [owners, setOwners] = useState<OwnerInformation[]>([]);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ownersData, blockHeightData] = await Promise.all([
          getAllOwnersInformation(),
          fetchBlockHeight(),
        ]);
        setOwners(ownersData);
        setBlockHeight(blockHeightData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <div className="text-3xl font-bold text-primary-600">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  owners.length
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Active NFTs
              </h3>
              <div className="text-3xl font-bold text-primary-600">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  ownersWithExpired.filter((owner) => !owner.expired).length
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Expired NFTs
              </h3>
              <div className="text-3xl font-bold text-secondary-600">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  ownersWithExpired.filter((owner) => owner.expired).length
                )}
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : owners.map((owner) => (
                  <NFT owner={owner} key={owner.ownerId} />
                ))}
          </div>

          {/* Empty State */}
          {!loading && owners.length === 0 && (
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
