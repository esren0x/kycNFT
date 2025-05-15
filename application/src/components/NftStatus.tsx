import { fetchBlockHeight } from "../lib/utils";
import { useEffect, useState } from "react";

interface EstimatedExpirationTimeProps {
  expirationBlock: number | null;
}

const EstimatedExpirationTime = ({
  expirationBlock,
}: EstimatedExpirationTimeProps) => {
  const [estimatedDate, setEstimatedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateExpiration = async () => {
      setIsLoading(true);
      setError(null);
      setEstimatedDate(null);

      if (expirationBlock === null || expirationBlock <= 0) {
        setError("Invalid expiration block provided.");
        setIsLoading(false);
        return;
      }

      try {
        // Assuming fetchBlockHeight is async: () => Promise<number>
        const currentBlock = await fetchBlockHeight();

        if (typeof currentBlock !== "number" || isNaN(currentBlock)) {
          setError("Failed to fetch a valid current block height.");
          setIsLoading(false);
          return;
        }

        if (currentBlock >= expirationBlock) {
          setError("The expiration time has passed or is current.");
          setIsLoading(false);
          return;
        }

        const blocksRemaining = expirationBlock - currentBlock;
        const secondsRemaining = blocksRemaining * 3; // 3 seconds per block

        const expirationTimestamp = Date.now() + secondsRemaining * 1000;
        setEstimatedDate(new Date(expirationTimestamp));
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(
            "An unexpected error occurred while calculating expiration."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    calculateExpiration();
  }, [expirationBlock]);

  if (isLoading) {
    return (
      <div>
        <p className="font-abcd">Estimated Expiration Time:</p>
        <p className="font-abcd">Calculating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="font-abcd">Estimated Expiration Time:</p>
        <p style={{ color: "red" }} className="font-abcd">
          Error: {error}
        </p>
      </div>
    );
  }

  if (estimatedDate) {
    return (
      <div>
        <p className="font-abcd">Estimated Expiration Time:</p>
        <p className="font-abcd">
          <strong className="font-abcd">
            {estimatedDate.toLocaleString()}
          </strong>
        </p>
      </div>
    );
  }

  // Fallback message
  return (
    <div>
      <p className="font-abcd">Estimated Expiration Time:</p>
      <p className="font-abcd">Unable to determine expiration time.</p>
    </div>
  );
};

interface NftStatusProps {
  status: string;
  expirationBlock: number | null;
  isExpired: boolean | null;
}

export const NftStatus = ({
  status,
  expirationBlock,
  isExpired,
}: NftStatusProps) => {
  if (status === "not_minted") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <svg
            className="w-8 h-8 text-primary-600"
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
        <h2 className="text-2xl font-innovator font-semibold text-primary-600 mb-2">
          No NFT Found
        </h2>
        <p className="text-gray-600 font-abcd">
          Complete the KYC process to mint your NFT.
        </p>
      </div>
    );
  }

  if (status === "minted") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <svg
            className="w-8 h-8 text-primary-600"
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

        {!isExpired ? (
          <>
            <h2 className="text-2xl font-innovator font-semibold text-primary-600 mb-2">
              NFT Minted Successfully!
            </h2>
            <p className="text-gray-600 mb-2 font-abcd">
              Your KYC NFT is valid until the block:
            </p>
            <p className="text-gray-800 font-semibold font-abcd">
              {expirationBlock}
            </p>
            <EstimatedExpirationTime expirationBlock={expirationBlock} />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-innovator font-semibold text-red-600 mb-2">
              NFT Expired
            </h2>
            <p className="text-gray-600 mb-2 font-abcd">
              Your KYC NFT validity has expired on the block:
            </p>
            <p className="text-gray-800 font-semibold font-abcd">
              {expirationBlock}
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
};
