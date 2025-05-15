import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

export const WalletInfo = () => {
  const { publicKey } = useWallet();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-innovator font-semibold mb-3">
        Wallet Information
      </h2>
      <div className="space-y-2 text-sm">
        {publicKey && (
          <p className="flex items-center font-abcd">
            <span className="font-medium w-24">Public Key:</span>
            <span className="text-gray-600 font-mono text-xs truncate">
              {publicKey}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
