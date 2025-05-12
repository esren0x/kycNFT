"use client";
import { OwnerInformation } from "@/lib/mappings";

export default function NFT({ owner }: { owner: OwnerInformation }) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (hasNFT: boolean) => {
    return hasNFT ? "bg-green-500" : "bg-red-500";
  };

  // Create a string of repeated addresses for the circular text
  const circulatingText = owner.walletAddress.toUpperCase();

  // Define the card dimensions and corner radius
  const width = 320;
  const height = 400;
  const radius = 16;
  const borderWidth = 16;
  const textPadding = 4; // Padding for the text path from the border edges

  // Create a path that follows the border with padding
  const borderPath = `
    M ${radius + borderWidth / 2 + textPadding},${
    borderWidth / 2 + textPadding
  } 
    h ${width - 2 * (radius + borderWidth / 2 + textPadding)} 
    a ${radius},${radius} 0 0 1 ${radius},${radius} 
    v ${height - 2 * (radius + borderWidth / 2 + textPadding)} 
    a ${radius},${radius} 0 0 1 -${radius},${radius} 
    h -${width - 2 * (radius + borderWidth / 2 + textPadding)} 
    a ${radius},${radius} 0 0 1 -${radius},-${radius} 
    v -${height - 2 * (radius + borderWidth / 2 + textPadding)} 
    a ${radius},${radius} 0 0 1 ${radius},-${radius} 
    z
  `;

  return (
    <div className="relative w-80 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 p-[16px] shadow-lg">
      {/* SVG for circulating text */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          {/* Define the path for the text to follow */}
          <path
            id="borderPath"
            d={borderPath}
            fill="none"
            stroke="rgba(255,0,0,0.5)"
            strokeWidth="1"
          />
        </defs>

        <text textRendering="optimizeSpeed">
          <textPath
            startOffset="-100%"
            fill="white"
            fontFamily="'Courier New', monospace"
            fontSize="12px"
            xlinkHref="#borderPath"
          >
            {circulatingText}
            <animate
              additive="sum"
              attributeName="startOffset"
              from="0%"
              to="100%"
              begin="0s"
              dur="30s"
              repeatCount="indefinite"
            />
          </textPath>
          <textPath
            startOffset="0%"
            fill="white"
            fontFamily="'Courier New', monospace"
            fontSize="12px"
            xlinkHref="#borderPath"
          >
            {circulatingText}
            <animate
              additive="sum"
              attributeName="startOffset"
              from="0%"
              to="100%"
              begin="0s"
              dur="30s"
              repeatCount="indefinite"
            />
          </textPath>
          <textPath
            startOffset="50%"
            fill="white"
            fontFamily="'Courier New', monospace"
            fontSize="12px"
            xlinkHref="#borderPath"
          >
            {circulatingText}
            <animate
              additive="sum"
              attributeName="startOffset"
              from="0%"
              to="100%"
              begin="0s"
              dur="30s"
              repeatCount="indefinite"
            />
          </textPath>
          <textPath
            startOffset="-50%"
            fill="white"
            fontFamily="'Courier New', monospace"
            fontSize="12px"
            xlinkHref="#borderPath"
          >
            {circulatingText}
            <animate
              additive="sum"
              attributeName="startOffset"
              from="0%"
              to="100%"
              begin="0s"
              dur="30s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>

      <div className="bg-black rounded-xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-20">
          <h2 className="text-xl font-bold text-white">KYC NFT</h2>
          <div
            className={`${getStatusColor(owner.hasNFT)} w-3 h-3 rounded-full`}
          />
        </div>

        {/* NFT Image Area with Geometric Shapes */}
        <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          {/* Background shapes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            {/* Hexagon pattern */}
            <path
              d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="1"
              className="animate-pulse"
            />
            {/* Circle */}
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="1"
              className="animate-spin-slow"
            />
            {/* Square */}
            <rect
              x="60"
              y="60"
              width="80"
              height="80"
              fill="none"
              stroke="url(#gradient3)"
              strokeWidth="1"
              className="animate-pulse"
            />

            {/* Gradients */}
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient
                id="gradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient
                id="gradient3"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/40 text-sm font-mono">KYC VERIFIED</div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="space-y-3 relative z-20">
          <div>
            <p className="text-gray-400 text-sm">Owner Address</p>
            <p className="text-white font-mono text-sm">
              {formatAddress(owner.walletAddress)}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Owner ID</p>
            <p className="text-white font-mono text-sm">
              {formatAddress(owner.ownerId)}
            </p>
          </div>

          {owner.expirationBlock && (
            <div>
              <p className="text-gray-400 text-sm">Expiration Block</p>
              <p className="text-white font-mono text-sm">
                {owner.expirationBlock}
              </p>
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <div
                className={`${getStatusColor(
                  owner.hasNFT
                )} w-2 h-2 rounded-full`}
              />
              <p className="text-white text-sm">
                {owner.hasNFT ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
