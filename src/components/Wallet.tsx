import { useWallet } from "@crossmint/client-sdk-react-ui";

const Wallet = () => {
  const { wallet, status, error, getOrCreateWallet } = useWallet();
  console.log(wallet, status, error);

  return (
    <div>
      {status === "loading-error" && error && (
        <div className="border-2 border-red-500 text-red-500 font-bold py-4 px-8 rounded-lg">
          Error: {error.message}
        </div>
      )}
      {status === "in-progress" && (
        <div className="border-2 border-yellow-500 text-yellow-500 font-bold py-4 px-8 rounded-lg">
          Loading...
        </div>
      )}
      {status === "loaded" && wallet && (
        <div className="border-2 border-green-500 text-green-500 font-bold py-4 px-8 rounded-lg">
          Wallet: {wallet.address}
        </div>
      )}
      {status === "not-loaded" && (
        <div className="border-2 border-gray-500 text-gray-500 font-bold py-4 px-8 rounded-lg">
          Wallet not loaded
        </div>
      )}
      <button 
        onClick={() => getOrCreateWallet()} 
        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
      >
        Get or Create Wallet
      </button>
    </div>
  );
}

export default Wallet;
