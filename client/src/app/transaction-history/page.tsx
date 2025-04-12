"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface TransactionHistoryProps {
  web3: any;
  contract: any;
  account: string;
}

interface HistoryItem {
  event: string;
  transactionHash: string;
  from: string;
  gasUsed: number;
  gasPrice: string;
  timestamp: string;
  blockNumber: number;
  cost: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  web3,
  contract,
  account,
}) => {
  const [productId, setProductId] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactionHistory = async () => {
    if (!contract || !productId) return;

    setLoading(true);
    try {
      const product = await contract.methods.getProduct(productId).call();

      const events = await contract.getPastEvents("allEvents", {
        fromBlock: 0,
        toBlock: "latest",
        filter: { productId: productId },
      });

      // Get transaction details for each event
      const historyWithDetails = await Promise.all(
        events.map(async (event: any) => {
          const tx = await web3.eth.getTransaction(event.transactionHash);
          const receipt = await web3.eth.getTransactionReceipt(
            event.transactionHash
          );
          const block = await web3.eth.getBlock(event.blockNumber);

          return {
            event: event.event,
            transactionHash: event.transactionHash,
            from: tx.from,
            gasUsed: receipt.gasUsed,
            gasPrice: tx.gasPrice,
            timestamp: new Date(
              Number(block.timestamp) * 1000
            ).toLocaleString(),
            blockNumber: event.blockNumber,
            cost: web3.utils.fromWei(
              (BigInt(receipt.gasUsed) * BigInt(tx.gasPrice)).toString(),
              "ether"
            ),
          };
        })
      );

      setHistory(historyWithDetails);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
    setLoading(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <Button onClick={fetchTransactionHistory} disabled={loading}>
            View History
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">Loading transaction history...</div>
        )}

        {history.length > 0 && (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.transactionHash} className="relative">
                {index !== 0 && (
                  <div className="absolute left-6 -top-4 h-4 w-0.5 bg-gray-200" />
                )}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                  <div className="mt-1">
                    {item.event === "ProductCreated" ? (
                      <AlertCircle className="text-blue-500" />
                    ) : (
                      <CheckCircle2 className="text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {item.event === "ProductCreated"
                          ? "Product Created"
                          : item.event === "ProductStateChanged"
                          ? "State Changed"
                          : item.event}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {item.timestamp}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>From: {item.from}</p>
                      <p>Transaction: {item.transactionHash}</p>
                      <p>Block: {item.blockNumber}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Gas Used: {item.gasUsed}</p>
                        <p>
                          Gas Price: {web3.utils.fromWei(item.gasPrice, "gwei")}{" "}
                          gwei
                        </p>
                        <p>Transaction Cost: {item.cost} ETH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
