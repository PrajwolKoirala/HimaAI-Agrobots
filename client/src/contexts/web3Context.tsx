// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useConnect, useDisconnect, useAccount } from 'wagmi';
// import { injected } from '@wagmi/connectors';
// import Web3 from 'web3';
// import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/web3Config';

// interface Web3ContextType {
//   connect: () => Promise<void>;
//   disconnect: () => void;
//   contract: any | null;
//   account: string | null;
//   isActive: boolean;
//   web3: Web3 | null;
//   error: string | null;
// }

// const Web3Context = createContext<Web3ContextType | null>(null);

// export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
//   const [web3, setWeb3] = useState<Web3 | null>(null);
//   const [contract, setContract] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const { connect: connectWagmi } = useConnect({
//     connector: injected(),
//   });
//   const { disconnect: disconnectWagmi } = useDisconnect();
//   const { address, isConnected } = useAccount();

//   useEffect(() => {
//     if (window.ethereum) {
//       const web3Instance = new Web3(window.ethereum);
//       setWeb3(web3Instance);

//       const contractInstance = new web3Instance.eth.Contract(
//         CONTRACT_ABI,
//         CONTRACT_ADDRESS
//       );
//       setContract(contractInstance);
//     } else {
//       setError('Ethereum provider not found');
//     }
//   }, []);

//   const connect = async () => {
//     try {
//       await connectWagmi();
//     } catch (err) {
//       console.error('Connection error:', err);
//       setError('Failed to connect');
//     }
//   };

//   const disconnect = () => {
//     disconnectWagmi();
//   };

//   return (
//     <Web3Context.Provider
//       value={{
//         connect,
//         disconnect,
//         contract,
//         account: address || null,
//         isActive: isConnected,
//         web3,
//         error,
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// };

// export const useWeb3 = () => {
//   const context = useContext(Web3Context);
//   if (!context) {
//     throw new Error('useWeb3 must be used within a Web3Provider');
//   }
//   return context;
// };


'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/web3Config';

interface Web3ContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  contract: any | null;
  account: string | null;
  isActive: boolean;
  web3: Web3 | null;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use wagmi v2 hooks
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const contractInstance = new web3Instance.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
      setContract(contractInstance);
    } else {
      setError('Ethereum provider not found');
    }
  }, []);

  const connect = async () => {
    try {
      await connectAsync({ connector: injected() });
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect');
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Failed to disconnect');
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        contract,
        account: address || null,
        isActive: isConnected,
        web3,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};