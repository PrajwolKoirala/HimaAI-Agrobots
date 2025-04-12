
"use client";
import React, { useState, useEffect, JSX, use } from "react";
import { useWeb3 } from "@/contexts/web3Context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";
import {
  History,
  Wheat,
  Box,
  Truck,
  Store,
  ShoppingBag,
  LogOut,
  Package,
  Check,
  ChevronsUpDown,
  Info,
  ArrowRight,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { districtsData, localBodiesData } from "@/lib/LocationData";
import { Select } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  DashboardProps,
  Product,
  ProductCardProps,
  ProductListProps,
  SearchableSelectProps,
} from "@/lib/type";
import { GoogleMap } from "@/lib/map";
import { useLanguage } from "@/contexts/LanguageContext";
import Head from "next/head";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@radix-ui/react-select";
import landing from './landing.png'
import ProductCard from "./ProductCard";
import exp from "constants";
const FarmerDashboard: React.FC<DashboardProps> = ({ contract, account }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [error, setError] = useState("");
    const { web3 } = useWeb3();
  
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
      } catch (error) {}
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
            // Call each method separately and access the returned object properties
            const basicInfo = await contract.methods
              .getProductBasicInfo(i)
              .call();
            const fees = await contract.methods.getProductFees(i).call();
            const actors = await contract.methods.getProductActors(i).call();
  
            if (
              basicInfo.isValid &&
              actors.farmer.toLowerCase() === account.toLowerCase()
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
  
    function addToCart(product: Product): void {
      throw new Error("Function not implemented.");
    }
  
    return (
      <div className="space-y-6">
        <Head>
          <title>Agrisupply chain</title>
        </Head>
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