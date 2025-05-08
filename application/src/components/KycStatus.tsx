import SumsubWebSdk from "@sumsub/websdk-react";

interface KycStatusProps {
  status: string;
  isLoading: boolean;
  onStartKyc: () => void;
  accessToken: string | null;
  onTokenExpiration: () => void;
  onMessage: (type: string, payload: Record<string, unknown>) => void;
  onError: (error: Error) => void;
}

export const KycStatus = ({
  status,
  isLoading,
  onStartKyc,
  accessToken,
  onTokenExpiration,
  onMessage,
  onError,
}: KycStatusProps) => {
  if (!accessToken && status === "not_started") {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">
          Start Your KYC Verification
        </h2>
        <p className="text-gray-600 mb-6">
          Complete the verification process to mint your KYC NFT
        </p>
        <button
          onClick={onStartKyc}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Starting KYC...
            </>
          ) : (
            "Start KYC Process"
          )}
        </button>
      </div>
    );
  }

  if (accessToken && status !== "completed") {
    return (
      <div className="h-full border rounded-lg overflow-hidden">
        <SumsubWebSdk
          accessToken={accessToken}
          expirationHandler={onTokenExpiration}
          config={{
            lang: "en",
            email: "",
            phone: "",
          }}
          options={{
            addViewportTag: false,
            adaptIframeHeight: true,
          }}
          onMessage={onMessage}
          onError={onError}
        />
      </div>
    );
  }

  if (status === "completed") {
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
          Verification Completed!
        </h2>
        <p className="text-gray-600">
          Your KYC verification has been successfully completed. Your NFT will
          be minted shortly...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-600">
          Your KYC verification could not be completed. Please try again.
        </p>
      </div>
    );
  }

  return null;
};
