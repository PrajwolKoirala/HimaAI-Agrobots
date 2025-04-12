"use client";
import React, { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/web3Context";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Product } from "@/lib/type";
import { Wheat } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const FarmerDashboard = () => {
  const { contract, account, web3 } = useWeb3();
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [error, setError] = useState("");

  const createProduct = async () => {
    try {
      if (!web3) {
        setError("Web3 not initialized");
        return;
      }
      await contract.methods
        .createProduct(productName, web3.utils.toWei(basePrice, "ether"))
        .send({ from: account });

      setProductName("");
      setBasePrice("");
      await fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    }
  };

  const fetchProducts = async () => {
    try {
      if (!contract || !web3) {
        console.error("Contract or web3 not initialized");
        return;
      }

      const count = await contract.methods.productCount().call();
      const fetchedProducts = [];

      for (let i = 1; i <= count; i++) {
        try {
          const basicInfo = await contract.methods.getProductBasicInfo(i).call();
          const fees = await contract.methods.getProductFees(i).call();
          const actors = await contract.methods.getProductActors(i).call();

          if (
            basicInfo.isValid &&
            account && actors.farmer.toLowerCase() === account.toLowerCase()
          ) {
            fetchedProducts.push({
              id: basicInfo.id,
              name: basicInfo.name,
              price: web3.utils.fromWei(basicInfo.basePrice, "ether"),
              state: basicInfo.state,
              collectorFee: web3.utils.fromWei(fees.collectorFee, "ether"),
              transporterFee: web3.utils.fromWei(fees.transporterFee, "ether"),
              distributorFee: web3.utils.fromWei(fees.distributorFee, "ether"),
              retailerFee: web3.utils.fromWei(fees.retailerFee, "ether"),
            });
          }
        } catch (err) {
          console.error(`Error fetching product ${i}:`, err);
          continue;
        }
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchProducts();
    }
  }, [contract, account]);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="flex items-center gap-2 p-6">
          <Wheat className="w-6 h-6 text-green-600" />
          <CardTitle className="text-xl font-semibold text-gray-700">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-md p-2"
          />
          <Input
            placeholder="Base Price (ETH)"
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-md p-2"
          />
          <Button
            onClick={createProduct}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!productName || !basePrice}
          >
            Create Product
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold text-gray-700">
            My Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.length === 0 ? (
              <p className="text-gray-500 col-span-2 text-center py-4">
                No products found. Create your first product above.
              </p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;