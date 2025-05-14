"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NFT from "../app/nft";
import { getAllOwnersInformation, OwnerInformation } from "../lib/mappings";
import { SkeletonCard } from "../app/gallery/page";

export default function RecentNFTs() {
  const [recentOwners, setRecentOwners] = useState<OwnerInformation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const owners = await getAllOwnersInformation();
        setRecentOwners(owners.slice(0, 3)); // Get only the 3 most recent owners
      } catch (error) {
        console.error("Error fetching owners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recently Verified Wallets
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : recentOwners.map((owner) => (
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
  );
}
