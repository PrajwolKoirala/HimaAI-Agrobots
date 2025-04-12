// src/app/providers.tsx
"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from "viem";
import { Web3Provider } from "@/contexts/web3Context";
import { LanguageProvider } from '@/contexts/LanguageContext'
// Create a client
const queryClient = new QueryClient();

const config = createConfig({
  chains: [{
    id: 1337,
    name: "Ganache",
    network: "ganache",
    nativeCurrency: {
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["http://127.0.0.1:7545"] },
      public: { http: ["http://127.0.0.1:7545"] }
    }
  }],
  transports: {
    1337: http("http://127.0.0.1:7545")
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>

      <WagmiConfig config={config}>
        <Web3Provider>{children}</Web3Provider>
      </WagmiConfig>
      </LanguageProvider>
    </QueryClientProvider>
  );
}