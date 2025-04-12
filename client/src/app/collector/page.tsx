// "use client";
// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Box } from "lucide-react"; // Import Box from lucide-react
// import { Contract } from "web3-eth-contract";

// interface CollectorDashboardProps {
//   contract: Contract<any>;
//   account: string;
// }

// const CollectorDashboard: React.FC<CollectorDashboardProps> = ({
//   contract,
//   account,
// }) => {
//   const [productId, setProductId] = useState("");
//   const [error, setError] = useState("");

//   const collectProduct = async () => {
//     try {
//       await contract.methods.collectProduct(productId).send({ from: account });
//       setProductId("");
//     } catch (error: any) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-lg backdrop-blur-sm bg-white/90 shadow-xl border-0">
//         <CardHeader className="text-center space-y-4">
//           <div className="flex justify-center">
//             <div className="bg-green-100 p-3 rounded-full">
//               <Box className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//               Collect Products
//             </CardTitle>
//             <p className="text-gray-500 mt-2">
//               Manage your product collections
//             </p>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//           <Input
//             placeholder="Product ID"
//             value={productId}
//             onChange={(e) => setProductId(e.target.value)}
//             className="h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
//           />
//           <Button
//             onClick={collectProduct}
//             className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
//           >
//             Collect Product
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CollectorDashboard;
