import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

export const WalletInfo = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Wallet Information</h2>
      <div className="space-y-2 text-sm">
        <p className="flex items-center">
          <span className="font-medium w-24">Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              connected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </p>
        {publicKey && (
          <p className="flex items-center">
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
