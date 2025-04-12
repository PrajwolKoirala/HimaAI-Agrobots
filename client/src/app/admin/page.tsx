"use client";

import React, { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/web3Context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { History, AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserPlus } from "lucide-react";
import { DashboardProps } from "@/lib/type";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard: React.FC<DashboardProps> = ({ contract, account }) => {
  const [transactions, setTransactions] = useState<
    {
      transactionHash: string;
      blockNumber: number;
      event: string;
      from: string | null;
      to: string | null;
      amount: string | null;
      productId: number | null;
      newState: number | null;
      timestamp: Date | null | Date;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { web3 } = useWeb3();
  const [revertingTx, setRevertingTx] = useState<Number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<
    { address: string; role: string; modifiedAt?: string }[]
  >([]);
  const [newUserAddress, setNewUserAddress] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [userError, setUserError] = useState("");

  const AVAILABLE_ROLES = [
    "FARMER",
    "COLLECTOR",
    "TRANSPORTER",
    "DISTRIBUTOR",
    "RETAILER",
    "CONSUMER",
  ];

  const fetchUsers = async () => {
    try {
      const localUsers = JSON.parse(
        localStorage.getItem("modifiedUsers") || "[]"
      );
      const registeredUsers = new Set();
      const fetchedUsers = [];

      // Get all events from contract
      const events = await contract.getPastEvents("allEvents", {
        fromBlock: 0,
        toBlock: "latest",
      });

      // Process contract events to get users
      for (const event of events) {
        if (event.returnValues.from) {
          const address = event.returnValues.from;
          if (!registeredUsers.has(address)) {
            registeredUsers.add(address);
            const role = await contract.methods.userRoles(address).call();
            if (role) {
              fetchedUsers.push({ address, role });
            }
          }
        }
      }

      // Merge with local modifications
      const mergedUsers = fetchedUsers.map((user) => {
        const localUser = localUsers.find(
          (u: { address: string }) =>
            u.address.toLowerCase() === user.address.toLowerCase()
        );
        return localUser || user;
      });

      setUsers(mergedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserError("Failed to fetch users");
    }
  };

  const handleAddUser = () => {
    if (!web3 || !web3.utils.isAddress(newUserAddress)) {
      setUserError("Invalid Ethereum address");
      return;
    }

    if (!AVAILABLE_ROLES.includes(newUserRole)) {
      setUserError("Invalid role selected");
      return;
    }

    const newUser = {
      address: newUserAddress,
      role: newUserRole,
      modifiedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Save to localStorage
    const localUsers = JSON.parse(
      localStorage.getItem("modifiedUsers") || "[]"
    );
    localStorage.setItem(
      "modifiedUsers",
      JSON.stringify([...localUsers, newUser])
    );

    setNewUserAddress("");
    setNewUserRole("");
    setUserError("");
  };

  // Change user role (UI only)
  const handleChangeRole = (address: string, newRole: string) => {
    const updatedUsers = users.map((user) =>
      user.address.toLowerCase() === address.toLowerCase()
        ? { ...user, role: newRole, modifiedAt: new Date().toISOString() }
        : user
    );
    setUsers(updatedUsers);

    // Save to localStorage
    const localUsers = JSON.parse(
      localStorage.getItem("modifiedUsers") || "[]"
    );
    const filteredLocalUsers = localUsers.filter(
      (u: { address: string }) =>
        u.address.toLowerCase() !== address.toLowerCase()
    );
    localStorage.setItem(
      "modifiedUsers",
      JSON.stringify([
        ...filteredLocalUsers,
        { address, role: newRole, modifiedAt: new Date().toISOString() },
      ])
    );
  };

  useEffect(() => {
    if (contract && account) {
      fetchUsers();
    }
  }, [contract, account]);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const role = await contract.methods.userRoles(account).call();
        setIsAdmin(role === "ADMIN");
      } catch (error) {
        console.error("Error checking admin role:", error);
      }
    };

    if (contract && account) {
      checkAdminRole();
    }
  }, [contract, account]);

  const handleRevert = async (productId: number) => {
    try {
      if (!isAdmin) {
        setError("Only admin can revert transactions");
        return;
      }

      setRevertingTx(productId);
      setError("");

      // First estimate the gas
      const gasEstimate = await contract.methods
        .revertTransaction(productId)
        .estimateGas({ from: account });

      // Add 20% buffer to gas estimate
      const gas = Math.floor(gasEstimate * 1.2);

      await contract.methods.revertTransaction(productId).send({
        from: account,
        gas: gas,
      });

      await fetchTransactions();
    } catch (error) {
      console.error("Error reverting transaction:", error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        if ((error as any).code)
          console.error("Error code:", (error as any).code);
        if ((error as any).data)
          console.error("Error data:", (error as any).data);
        setError(error.message || "Failed to revert transaction");
      }
    } finally {
      setRevertingTx(null);
    }
  };

  const getStateName = (state: string): string => {
    const states: { [key: string]: string } = {
      "0": "Created",
      "1": "Collected",
      "2": "In Transit",
      "3": "With Distributor",
      "4": "With Retailer",
      "5": "Sold",
    };
    return states[state] || state;
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const paymentEvents = await contract.getPastEvents("PaymentProcessed", {
        fromBlock: 0,
        toBlock: "latest",
      });

      const stateEvents = await contract.getPastEvents("ProductStateChanged", {
        fromBlock: 0,
        toBlock: "latest",
      });

      const allTransactions = [...paymentEvents, ...stateEvents].map(
        (event) => ({
          transactionHash: event.transactionHash,
          // Convert BigInt to Number for blockNumber
          blockNumber: Number(event.blockNumber),
          event: event.event,
          from: event.returnValues.from || null,
          to: event.returnValues.to || null,
          amount: event.returnValues.amount
            ? web3
              ? web3.utils.fromWei(
                  event.returnValues.amount.toString(),
                  "ether"
                )
              : null
            : "0",
          productId: event.returnValues.productId
            ? Number(event.returnValues.productId)
            : null,
          newState: event.returnValues.newState
            ? Number(event.returnValues.newState)
            : null,
          timestamp: new Date(),
        })
      );

      // Get timestamps
      for (let tx of allTransactions) {
        if (!web3) {
          setError("Web3 not initialized");
          return;
        }
        const block = await web3.eth.getBlock(tx.blockNumber);
        tx.timestamp = new Date(Number(block.timestamp) * 1000);
      }

      // Sort using Number values
      allTransactions.sort((a, b) => b.blockNumber - a.blockNumber);

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (contract && account) {
      fetchTransactions();
    }
  }, [contract, account]);

  const handleRevertTransaction = async (productId: number) => {
    try {
      setError("");
      await contract.methods
        .revertTransaction(productId)
        .send({ from: account });
      await fetchTransactions(); // Refresh the list after reversion
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error reverting transaction:", error);
        setError(error.message || "Failed to revert transaction");
      }
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchTransactions();
    }
  }, [contract, account]);

  const getUserTransactionCounts = () => {
    const userTxCounts: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      if (tx.from) {
        userTxCounts[tx.from] = (userTxCounts[tx.from] || 0) + 1;
      }
    });
    return userTxCounts;
  };

  const getDailyTransactionCounts = () => {
    const dailyTxCounts: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      const date = tx.timestamp?.toISOString().split("T")[0];
      if (date) {
        dailyTxCounts[date] = (dailyTxCounts[date] || 0) + 1;
      }
    });
    return dailyTxCounts;
  };

  const getUserRoleCounts = () => {
    const roleCounts: { [key: string]: number } = {};
    users.forEach((user) => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    return roleCounts;
  };

  const userTransactionCounts = getUserTransactionCounts();
  const dailyTransactionCounts = getDailyTransactionCounts();
  const userRoleCounts = getUserRoleCounts();

  const userChartData = {
    labels: Object.keys(userTransactionCounts),
    datasets: [
      {
        label: "Number of Transactions",
        data: Object.values(userTransactionCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dailyChartData = {
    labels: Object.keys(dailyTransactionCounts),
    datasets: [
      {
        label: "Daily Transactions",
        data: Object.values(dailyTransactionCounts),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const roleChartData = {
    labels: Object.keys(userRoleCounts),
    datasets: [
      {
        label: "User Roles",
        data: Object.values(userRoleCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">
            <History className="w-4 h-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Transaction History</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTransactions}
                disabled={loading}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-4">Loading transactions...</div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 p-2">
                    <div style={{ height: "200px" }}>
                      <Line
                        data={dailyChartData}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-2">
                    <div style={{ height: "200px" }}>
                      <Pie
                        data={roleChartData}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>
                {transactions.map((tx, index) => (
                  <Card
                    key={`${tx.transactionHash}-${index}`}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{tx.event}</p>
                          <p className="text-sm text-gray-500">
                            {tx.timestamp?.toLocaleString()}
                          </p>
                        </div>
                        {tx.newState !== null && (
                          <Badge>{getStateName(tx.newState.toString())}</Badge>
                        )}
                      </div>
                      {tx.from && tx.to && (
                        <div className="mt-2 text-sm">
                          <p>From: {tx.from}</p>
                          <p>To: {tx.to}</p>
                          {tx.amount && <p>Amount: {tx.amount} ETH</p>}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Tx: {tx.transactionHash}
                      </p>

                      {isAdmin && tx.newState !== null && (
                        <div className="mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              tx.productId !== null &&
                              handleRevert(tx.productId)
                            }
                            disabled={revertingTx === tx.productId}
                          >
                            {revertingTx === tx.productId ? (
                              <>
                                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                                Reverting...
                              </>
                            ) : (
                              <>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Revert Transaction
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <CardHeader className="flex items-center gap-2 p-6">
              <UserPlus className="w-5 h-5 text-green-600" />
              <CardTitle className="text-xl font-semibold text-gray-700">
                Add New User
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {userError && (
                <Alert variant="destructive">
                  <AlertDescription>{userError}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-4">
                <Input
                  placeholder="Ethereum Address"
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-2"
                />
                <select
                  className="border rounded-md px-3 py-2 bg-gray-50 border-gray-200"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleAddUser}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold text-gray-700">
                Registered Users
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.address}>
                      <TableCell className="font-mono">
                        {user.address}
                      </TableCell>
                      <TableCell>
                        <select
                          className="border rounded-md px-2 py-1 bg-gray-50 border-gray-200"
                          value={user.role}
                          onChange={(e) =>
                            handleChangeRole(user.address, e.target.value)
                          }
                        >
                          {AVAILABLE_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {user.modifiedAt ? "Modified" : "Original"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
