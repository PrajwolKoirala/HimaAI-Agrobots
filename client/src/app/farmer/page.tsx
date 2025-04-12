// "use client";
// import React, { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Contract } from "web3-eth-contract";
// import { Badge, Wheat } from "lucide-react";
// import { Product } from "@/lib/type";

// interface FarmerDashboardProps {
//   contract: Contract<any>;
//   account: string;
// }

// const ProductCard: React.FC<Product>  = ({ product }) => {
//   const stateColors = {
//     Created: "bg-blue-100 text-blue-800",
//     CollectedByCollector: "bg-purple-100 text-purple-800",
//     WithTransporter: "bg-yellow-100 text-yellow-800",
//     WithDistributor: "bg-green-100 text-green-800",
//     WithRetailer: "bg-pink-100 text-pink-800",
//     Sold: "bg-gray-100 text-gray-800",
//   };

//   return (
//     <Card>
//       <CardContent className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold">{product.name}</h3>
//           <Badge className={stateColors[product.state]}>{product.state}</Badge>
//         </div>
//         <p className="text-sm text-gray-500">ID: {product.id}</p>
//         <p className="text-sm text-gray-500">Price: {product.price} ETH</p>
//       </CardContent>
//     </Card>
//   );
// };

// const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
//   contract,
//   account,
// }) => {
//   const [products, setProducts] = useState([]);
//   const [productName, setProductName] = useState("");
//   const [productPrice, setProductPrice] = useState("");
//   const [error, setError] = useState("");

//   const createProduct = async () => {
//     try {
//       await contract.methods
//         .createProduct(productName, productPrice)
//         .send({ from: account });
//       setProductName("");
//       setProductPrice("");
//       fetchProducts();
//     } catch (error: any) {
//       setError(error.message);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const count = await contract.methods.productCount().call();
//       const fetchedProducts = [];
//       for (let i = 1; i <= count; i++) {
//         const product = await contract.methods.getProduct(i).call();
//         if (product.farmer === account) {
//           fetchedProducts.push({
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             state: product.state,
//           });
//         }
//       }
//       setProducts(fetchedProducts);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex-col items-center justify-center p-4">
//       <Card className="w-full max-w-lg backdrop-blur-sm bg-white/90 shadow-xl border-0">
//         <CardHeader className="text-center space-y-4">
//           <div className="flex justify-center">
//             <div className="bg-green-100 p-3 rounded-full">
//               <Wheat className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//               Create New Product
//             </CardTitle>
//             <p className="text-gray-500 mt-2">
//               Manage your agricultural products
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
//             placeholder="Product Name"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             className="h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
//           />
//           <Input
//             placeholder="Product Price (ETH)"
//             type="number"
//             value={productPrice}
//             onChange={(e) => setProductPrice(e.target.value)}
//             className="h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
//           />
//           <Button
//             onClick={createProduct}
//             className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
//           >
//             Create Product
//           </Button>
//         </CardContent>
//       </Card>

//       <Card className="w-full max-w-lg mt-6 backdrop-blur-sm bg-white/90 shadow-xl border-0">
//         <CardHeader className="text-center space-y-4">
//           <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//             My Products
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 gap-4">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FarmerDashboard;
