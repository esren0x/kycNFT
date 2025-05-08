interface NftStatusProps {
  status: string;
  expirationDate: Date | null;
}

export const NftStatus = ({ status, expirationDate }: NftStatusProps) => {
  if (status === "not_minted") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-yellow-600 mb-2">
          No NFT Found
        </h2>
        <p className="text-gray-600">
          Complete the KYC process to mint your NFT.
        </p>
      </div>
    );
  }

  if (status === "minted" && expirationDate) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-green-600 mb-2">
          NFT Minted Successfully!
        </h2>
        <p className="text-gray-600 mb-2">Your KYC NFT is valid until:</p>
        <p className="text-gray-800 font-semibold">
          {expirationDate.toLocaleDateString()}
        </p>
      </div>
    );
  }

  return null;
};
