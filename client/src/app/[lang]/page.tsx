"use client";
import React, { useState, useEffect, JSX, use } from "react";
import Web3 from "web3";
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
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import UserRegistration from "../registration/page";
import AdminDashboard from "../admin/page";
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
import { CategoryCard } from "../product-market-place/category-card";
import { Footer } from "../product-market-place/footer";
import { Separator } from "@radix-ui/react-select";
import landing from "./landing.png";
import Image from "next/image";
import { Suspense } from "react";

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  items,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? items.find((item) => item.id === Number(value))?.name
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChange(item.id.toString());
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </Suspense>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const stateColors = {
    Created: "bg-blue-100 text-blue-800",
    CollectedByCollector: "bg-purple-100 text-purple-800",
    WithTransporter: "bg-yellow-100 text-yellow-800",
    WithDistributor: "bg-green-100 text-green-800",
    WithRetailer: "bg-pink-100 text-pink-800",
    Sold: "bg-gray-100 text-gray-800",
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{product.name}</h3>
            <Badge className={stateColors[product.state]}>
              {product.state}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">ID: {product.id}</p>
          <p className="text-sm text-gray-500">Price: {product.price} ETH</p>
        </CardContent>
      </Card>
    </Suspense>
  );
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelect,
  selectedId,
  stateLabel,
}) => {
  if (!products.length) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className={`cursor-pointer transition-all ${
            selectedId === product.id ? "ring-2 ring-green-500" : ""
          } hover:shadow-lg transform hover:scale-105`}
          onClick={() => onSelect(product.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-700">{product.name}</h3>
              <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800">
                {stateLabel}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
            {product.basePrice && (
              <p className="text-sm text-gray-500">
                Base Price: {product.basePrice} ETH
              </p>
            )}
            {product.collectorFee && (
              <p className="text-sm text-gray-500">
                Collector Fee: {product.collectorFee} ETH
              </p>
            )}
            {product.transporterFee && (
              <p className="text-sm text-gray-500">
                Transporter Fee: {product.transporterFee} ETH
              </p>
            )}
            {product.distributorFee && (
              <p className="text-sm text-gray-500">
                Distributor Fee: {product.distributorFee} ETH
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

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
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

const CollectorDashboard: React.FC<DashboardProps> = ({
  contract,
  account,
}) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [collectorFee, setCollectorFee] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocalBody, setSelectedLocalBody] = useState("");
  const [distance, setDistance] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { web3 } = useWeb3();

  const filteredLocalBodies = localBodiesData.filter(
    (body) => body.districtId === Number(selectedDistrict)
  );

  const fetchAvailableProducts = async () => {
    try {
      setLoading(true);
      const count = await contract.methods.productCount().call();
      const products = [];

      for (let i = 1; i <= count; i++) {
        const productInfo = await contract.methods
          .getProductBasicInfo(i)
          .call();
        if (productInfo.isValid && Number(productInfo.state) === 0) {
          products.push({
            id: productInfo.id,
            name: productInfo.name,
            basePrice: web3
              ? web3.utils.fromWei(productInfo.basePrice, "ether")
              : "0",
            state: productInfo.state,
          });
        }
      }

      setAvailableProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch available products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchAvailableProducts();
    }
  }, [contract, account]);

  const collectProduct = async () => {
    try {
      if (!selectedProductId) {
        setError("Please select a product first");
        return;
      }

      if (!selectedDistrict || !selectedLocalBody || !distance) {
        setError("Please fill in all location details");
        return;
      }

      const product = availableProducts.find((p) => p.id === selectedProductId);
      if (!web3 || !product) {
        setError("Web3 or product not initialized");
        return;
      }
      const collectorFeeWei = web3.utils.toWei(collectorFee, "ether");
      const basePriceWei = web3.utils.toWei(product.basePrice || "0", "ether");

      await contract.methods
        .collectProduct(
          selectedProductId,
          collectorFeeWei,
          selectedDistrict,
          selectedLocalBody,
          distance
        )
        .send({ from: account, value: basePriceWei });

      setCollectorFee("");
      setSelectedProductId(null);
      setSelectedDistrict("");
      setSelectedLocalBody("");
      setDistance("");
      await fetchAvailableProducts();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
          <CardHeader className="flex items-center gap-2 p-6">
            <Box className="w-6 h-6 text-green-600" />
            <CardTitle className="text-xl font-semibold text-gray-700">
              Available Products for Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedProductId === product.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-700">
                        {product.name}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <p>Base Price: {product.basePrice} ETH</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedProductId && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">District</label>
                    <SearchableSelect
                      items={districtsData}
                      value={selectedDistrict}
                      onChange={(value) => {
                        setSelectedDistrict(value);
                        setSelectedLocalBody("");
                      }}
                      placeholder="Select District"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Local Body</label>
                    <SearchableSelect
                      items={filteredLocalBodies}
                      value={selectedLocalBody}
                      onChange={setSelectedLocalBody}
                      placeholder="Select Local Body"
                    />
                  </div>
                </div>

                <Input
                  placeholder="Distance (km)"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-2 mt-4"
                />

                <Input
                  placeholder="Your Collection Fee (ETH)"
                  type="number"
                  value={collectorFee}
                  onChange={(e) => setCollectorFee(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-2 mt-4"
                />

                <Button
                  onClick={collectProduct}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] mt-4"
                  disabled={
                    !collectorFee ||
                    !selectedDistrict ||
                    !selectedLocalBody ||
                    !distance
                  }
                >
                  Collect and Pay
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="w-full h-96 rounded-lg overflow-hidden">
          <GoogleMap />
        </div>
      </div>
    </Suspense>
  );
};

const TransporterDashboard: React.FC<DashboardProps> = ({
  contract,
  account,
}) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { web3 } = useWeb3();

  const fetchAvailableProducts = async () => {
    try {
      setLoading(true);
      const count = await contract.methods.productCount().call();
      const products = [];

      for (let i = 1; i <= count; i++) {
        const productInfo = await contract.methods
          .getProductBasicInfo(i)
          .call();
        if (productInfo.isValid && Number(productInfo.state) === 1) {
          const fees = await contract.methods.getProductFees(i).call();

          // Calculate transport fee based on distance (1 ETH per 100km)
          const distance = Number(productInfo.distance || 0);
          const transportFee = (distance / 100).toString();

          // Calculate total fee (collector fee + transport fee)
          const collectorFeeEth = web3
            ? web3.utils.fromWei(fees.collectorFee, "ether")
            : "0";
          const totalFee = (
            Number(collectorFeeEth) + Number(transportFee)
          ).toString();

          //PickupProduct
          products.push({
            id: productInfo.id,
            name: productInfo.name,
            collectorFee: collectorFeeEth,
            transporterFee: transportFee,
            totalFee: totalFee,
            distance: distance,
            district: productInfo.district || "N/A",
            localBody: productInfo.localBody || "N/A",
            state: productInfo.state,
          });
        }
      }

      setAvailableProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch available products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchAvailableProducts();
    }
  }, [contract, account]);

  //transportProduct
  const transportProduct = async () => {
    try {
      if (!selectedProductId) {
        setError("Please select a product first");
        return;
      }

      const product = availableProducts.find((p) => p.id === selectedProductId);
      if (!web3) {
        setError("Web3 not initialized");
        return;
      }
      if (!product || !product.transporterFee) {
        setError("Product or transporter fee is not defined");
        return;
      }
      if (!product || !product.collectorFee) {
        setError("Product or Collector fee is not defined");
        return;
      }

      const transporterFeeWei = web3.utils.toWei(
        product.transporterFee,
        "ether"
      );
      const collectorFeeWei = web3.utils.toWei(product.collectorFee, "ether");

      await contract.methods
        .transportProduct(selectedProductId, transporterFeeWei)
        .send({ from: account, value: collectorFeeWei });

      setSelectedProductId(null);
      await fetchAvailableProducts();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="flex items-center gap-2 p-6">
          <Truck className="w-6 h-6 text-green-600" />
          <CardTitle className="text-xl font-semibold text-gray-700">
            Products Ready for Transport
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedProductId === product.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">
                      {product.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p>
                        Drop/Shipping Location: {product.localBody},{" "}
                        {product.district}
                      </p>
                      <p>Distance: {product.distance?.toString()} km</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      Collector Fee: {product.collectorFee} ETH
                    </p>
                    <p className="text-sm text-gray-500">
                      Transport Fee: {product.transporterFee} ETH
                    </p>
                    <p className="font-medium text-gray-700">
                      Total Fee: {product.totalFee} ETH
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedProductId && (
            <div className="flex justify-end">
              <Button
                onClick={transportProduct}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Accept and Transport
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="w-full h-96 rounded-lg overflow-hidden">
        <GoogleMap />
      </div>
    </div>
  );
};

const DistributorDashboard: React.FC<DashboardProps> = ({
  contract,
  account,
}) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [distributorFee, setDistributorFee] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { web3 } = useWeb3();

  //fetchProducts
  const fetchAvailableProducts = async () => {
    try {
      setLoading(true);
      const count = await contract.methods.productCount().call();
      const products = [];

      for (let i = 1; i <= count; i++) {
        const productInfo = await contract.methods
          .getProductBasicInfo(i)
          .call();
        if (productInfo.isValid && Number(productInfo.state) === 2) {
          // IN_TRANSIT state
          const fees = await contract.methods.getProductFees(i).call();
          products.push({
            id: productInfo.id,
            name: productInfo.name,
            transporterFee: web3
              ? web3.utils.fromWei(fees.transporterFee, "ether")
              : "0",
            state: productInfo.state,
          });
        }
      }

      setAvailableProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch available products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchAvailableProducts();
    }
  }, [contract, account]);

  //SuppliesToRetailer
  const distributeProduct = async () => {
    try {
      if (!selectedProductId) {
        setError("Please select a product first");
        return;
      }
      if (!web3) {
        setError("Web3 not initialized");
        return;
      }
      //manageProduct
      const product = availableProducts.find((p) => p.id === selectedProductId);
      const distributorFeeWei = web3.utils.toWei(distributorFee, "ether");
      const transporterFeeWei = web3.utils.toWei(
        product?.transporterFee || "0",
        "ether"
      );

      await contract.methods
        .distributeProduct(selectedProductId, distributorFeeWei)
        .send({ from: account, value: transporterFeeWei });

      setDistributorFee("");
      setSelectedProductId(null);
      await fetchAvailableProducts();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="flex items-center gap-2 p-6">
          <Store className="w-6 h-6 text-green-600" />
          <CardTitle className="text-xl font-semibold text-gray-700">
            Products Ready for Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedProductId === product.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">
                      {product.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p>State: In Transit</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      Transporter Fee: {product.transporterFee} ETH
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedProductId && (
            <>
              <Input
                placeholder="Your Distribution Fee (ETH)"
                type="number"
                value={distributorFee}
                onChange={(e) => setDistributorFee(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md p-2 mt-4"
              />
              <Button
                onClick={distributeProduct}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] mt-4"
                disabled={!distributorFee}
              >
                Distribute and Pay
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const RetailerDashboard: React.FC<DashboardProps> = ({ contract, account }) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [retailerFee, setRetailerFee] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { web3 } = useWeb3();

  //fetchProduct
  const fetchAvailableProducts = async () => {
    try {
      setLoading(true);
      const count = await contract.methods.productCount().call();
      const products = [];

      for (let i = 1; i <= count; i++) {
        const productInfo = await contract.methods
          .getProductBasicInfo(i)
          .call();
        if (productInfo.isValid && Number(productInfo.state) === 3) {
          // WITH_DISTRIBUTOR state
          const fees = await contract.methods.getProductFees(i).call();
          products.push({
            id: productInfo.id,
            name: productInfo.name,
            distributorFee: web3
              ? web3.utils.fromWei(fees.distributorFee, "ether")
              : "0",
            state: productInfo.state,
          });
        }
      }

      setAvailableProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch available products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchAvailableProducts();
    }
  }, [contract, account]);

  const sendToRetail = async () => {
    try {
      if (!selectedProductId) {
        setError("Please select a product first");
        return;
      }
      if (!web3) {
        setError("Web3 not initialized");
        return;
      }
      const product = availableProducts.find((p) => p.id === selectedProductId);
      const retailerFeeWei = web3
        ? web3.utils.toWei(retailerFee, "ether")
        : "0";
      const distributorFeeWei = web3.utils.toWei(
        product?.distributorFee || "0",
        "ether"
      );

      await contract.methods
        .sendToRetailer(selectedProductId, retailerFeeWei)
        .send({ from: account, value: distributorFeeWei });

      //sellProducts
      setRetailerFee("");
      setSelectedProductId(null);
      await fetchAvailableProducts();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="flex items-center gap-2 p-6">
          <ShoppingBag className="w-6 h-6 text-green-600" />
          <CardTitle className="text-xl font-semibold text-gray-700">
            Products Available for Retail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedProductId === product.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">
                      {product.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p>State: With Distributor</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      Distributor Fee: {product.distributorFee} ETH
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedProductId && (
            <>
              <Input
                placeholder="Your Retail Fee (ETH)"
                type="number"
                value={retailerFee}
                onChange={(e) => setRetailerFee(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md p-2 mt-4"
              />
              <Button
                onClick={sendToRetail}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] mt-4"
                disabled={!retailerFee}
              >
                Accept and Pay
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export {
  CollectorDashboard,
  TransporterDashboard,
  DistributorDashboard,
  RetailerDashboard,
};

//History
const TransactionHistory: React.FC<DashboardProps> = ({
  contract,
  account,
}) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  // Helper function to get human-readable state names
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

  // Helper function to get state icon
  const getStateIcon = (state: string): JSX.Element => {
    switch (state) {
      case "0":
        return <Package className="w-5 h-5" />;
      case "1":
        return <Package className="w-5 h-5" />;
      case "2":
        return <Truck className="w-5 h-5" />;
      case "3":
        return <Store className="w-5 h-5" />;
      case "4":
        return <ShoppingBag className="w-5 h-5" />;
      case "5":
        return <Check className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  // Get color based on state
  const getStateColor = (state: string): string => {
    const colors = {
      "0": "bg-blue-100 text-blue-800",
      "1": "bg-purple-100 text-purple-800",
      "2": "bg-yellow-100 text-yellow-800",
      "3": "bg-green-100 text-green-800",
      "4": "bg-pink-100 text-pink-800",
      "5": "bg-gray-100 text-gray-800",
    };
    return colors[state as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const events = await contract.getPastEvents("ProductStateChanged", {
          fromBlock: 0,
          toBlock: "latest",
        });

        // Fetch additional details for each event
        const enhancedEvents = await Promise.all(
          events.map(async (event: any) => {
            const productInfo = await contract.methods
              .getProductBasicInfo(event.returnValues.productId)
              .call();

            return {
              ...event,
              productName: productInfo.name,
              timestamp: new Date().toLocaleString(), // Note: Using current time as placeholder
              state: event.returnValues.newState,
            };
          })
        );

        setTransactions(enhancedEvents.reverse()); // Show newest first
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    if (contract) {
      fetchTransactionHistory();
    }
  }, [contract]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((tx, index) => (
            <div key={tx.transactionHash} className="relative">
              {/* Connection line between events */}
              {index !== transactions.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-100" />
              )}

              <div className="flex gap-4">
                {/* Icon circle */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full ${getStateColor(
                    tx.state
                  )} flex items-center justify-center`}
                >
                  {getStateIcon(tx.state)}
                </div>

                {/* Content */}
                <div className="flex-grow bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">
                      {tx.productName || `Product ${tx.returnValues.productId}`}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tx.timestamp}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Status changed to:{" "}
                    <span className="font-medium">
                      {getStateName(tx.state)}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-gray-400 truncate">
                    Tx: {tx.transactionHash.substring(0, 6)}...
                    {tx.transactionHash.substring(
                      tx.transactionHash.length - 4
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No transaction history available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
  onDisconnect: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole,
  onDisconnect,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Wheat className="w-6 h-6" />
              <h1 className="text-xl font-bold">
                <i>Agro </i>
                <b>bot</b>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {/* Rest of your navigation content */}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-transparent border-0 p-0 text-gray-700 font-medium">
                  {userRole}
                </Badge>
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
                onClick={onDisconnect}
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
          {children}
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 mt-auto">
        <div className="text-center text-sm text-gray-500">
          © 2024 <i>Agro </i>
          <b>bot</b>. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

interface ProductMarketplaceProps {
  contract: any;
  account: string;
  onRegister: () => void;
}
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
interface CustomProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  onViewHistory: (productId: number) => void; // New prop for transaction history
}

const productIcons: { [key: string]: string } = {
  potato: "🥔",
  tomato: "🍅",
  apple: "🍎",
  banana: "🍌",
  carrot: "🥕",
  wheat: "🌾",
  corn: "🌽",
  grapes: "🍇",
  lemon: "🍋",
  orange: "🍊",
  strawberry: "🍓",
  watermelon: "🍉",
  eggplant: "🍆",
  pumpkin: "🎃",
  pepper: "🌶️",
  green_apple: "🍏",
  pear: "🍐",
  peach: "🍑",
  pineapple: "🍍",
  mango: "🥭",
  cherries: "🍒",
  blueberry: "🫐",
  coconut: "🥥",
  cucumber: "🥒",
  bell_pepper: "🫑",
  hot_pepper: "🌶️",
  broccoli: "🥦",
  lettuce: "🥬",
  onion: "🧅",
  garlic: "🧄",
  peas: "🫛",
  rice: "🍚",
  bread: "🍞",
  nut: "🥜",
  chestnut: "🌰",
  pretzel: "🥨",
  egg: "🥚",
  cheese: "🧀",
  meat: "🥩",
  poultry_leg: "🍗",
  fish: "🐟",
  shrimp: "🦐",
  lobster: "🦞",
  crab: "🦀",
  milk: "🥛",
  coffee: "☕",
  tea: "🍵",
  juice: "🧃",
  soda: "🥤",
  beer: "🍺",
  wine: "🍷",
  cocktail: "🍹",
  chocolate: "🍫",
  cake: "🍰",
  cupcake: "🧁",
  donut: "🍩",
  cookie: "🍪",
  honey: "🍯",
  cooking: "🍳",
  salt: "🧂",
  butter: "🧈",
  bowl_with_spoon: "🥣",
  chopsticks: "🥢",
  spoon: "🥄",
  fork_and_knife: "🍽",
};

interface ProductHistoryLookupProps {
  contract: any;
  web3: any;
  account: string;
}

// const ProductHistoryLookup = ({ contract, web3, account }) => {
//   const [productId, setProductId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [productHistory, setProductHistory] = useState(null);

//   const stateLabels = {
//     0: "Created",
//     1: "Collected",
//     2: "In Transit",
//     3: "With Distributor",
//     4: "With Retailer",
//     5: "Sold"
//   };

//   const fetchProductHistory = async (e) => {
//     e.preventDefault();
//     if (!productId) {
//       setError('Please enter a product ID');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setProductHistory(null); // Reset product history before new fetch

//     try {
//       console.log("Searching for product ID:", productId);

//       const productInfo = await contract.methods.getProductBasicInfo(productId).call();
//       console.log("Product info:", productInfo);

//       const actors = await contract.methods.getProductActors(productId).call();
//       console.log("Product actors:", actors);

//       if (!productInfo.isValid) {
//         throw new Error('Product not found');
//       }

//       // Compare addresses in a case-insensitive way
//       const currentUserAddress = account.toLowerCase();
//       const consumerAddress = actors.consumer.toLowerCase();

//       if (consumerAddress !== currentUserAddress) {
//         throw new Error('You are not authorized to view this product\'s history');
//       }

//       // Fetch product details
//       const fees = await contract.methods.getProductFees(productId).call();
//       const totalPrice = await contract.methods.getTotalPrice(productId).call();

//       const productDetails = {
//         name: productInfo.name,
//         basePrice: web3.utils.fromWei(productInfo.basePrice.toString(), "ether"),
//         collectorFee: web3.utils.fromWei(fees.collectorFee.toString(), "ether"),
//         transporterFee: web3.utils.fromWei(fees.transporterFee.toString(), "ether"),
//         distributorFee: web3.utils.fromWei(fees.distributorFee.toString(), "ether"),
//         retailerFee: web3.utils.fromWei(fees.retailerFee.toString(), "ether"),
//         totalPrice: web3.utils.fromWei(totalPrice.toString(), "ether"),
//         location: {
//           district: productInfo.district,
//           localBody: productInfo.localBody
//         }
//       };

//       // Fetch state change events
//       const stateEvents = await contract.getPastEvents('ProductStateChanged', {
//         filter: { productId },
//         fromBlock: 0,
//         toBlock: 'latest'
//       });

//       // Fetch payment events
//       const paymentEvents = await contract.getPastEvents('PaymentProcessed', {
//         filter: { productId },
//         fromBlock: 0,
//         toBlock: 'latest'
//       });

//       // Process and combine events
//       const allEvents = [...stateEvents, ...paymentEvents].map(event => ({
//         transactionHash: event.transactionHash,
//         blockNumber: Number(event.blockNumber),
//         eventType: event.event,
//         state: event.returnValues.newState,
//         from: event.returnValues.from,
//         to: event.returnValues.to,
//         amount: event.returnValues.amount
//           ? web3.utils.fromWei(event.returnValues.amount.toString(), "ether")
//           : null,
//         timestamp: null
//       }));

//       // Get timestamps for all events
//       for (let event of allEvents) {
//         const block = await web3.eth.getBlock(event.blockNumber);
//         if (block) {
//           event.timestamp = new Date(Number(block.timestamp) * 1000);
//         }
//       }

//       // Sort events by block number
//       allEvents.sort((a, b) => a.blockNumber - b.blockNumber);

//       // Set the complete history
//       setProductHistory({
//         details: productDetails,
//         events: allEvents
//       });
//       setError(''); // Clear any previous errors

//     } catch (err) {
//       console.error('Error fetching product history:', err);
//       setError(err.message || 'Failed to fetch product history. Please try again.');
//       setProductHistory(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Product History Lookup</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={fetchProductHistory} className="flex gap-4">
//             <div className="flex-1">
//               <Input
//                 type="text"
//                 placeholder="Enter Product ID"
//                 value={productId}
//                 onChange={(e) => setProductId(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Searching..." : "Search"}
//               <Search className="ml-2 h-4 w-4" />
//             </Button>
//           </form>

//           {error && (
//             <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
//               <AlertCircle className="h-4 w-4" />
//               {error}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {productHistory && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>{productHistory.details.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <h3 className="font-semibold mb-2">Location Details</h3>
//                   <p>District: {productHistory.details.location.district}</p>
//                   <p>Local Body: {productHistory.details.location.localBody}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2">Price Breakdown</h3>
//                   <div className="space-y-1">
//                     <p>Base Price: {productHistory.details.basePrice} ETH</p>
//                     <p>Total Price: {productHistory.details.totalPrice} ETH</p>
//                   </div>
//                 </div>
//               </div>

//               <Separator className="my-4" />

//               <h3 className="font-semibold mb-4">Transaction History</h3>
//               <div className="space-y-4">
//                 {productHistory.events.map((event, index) => (
//                   <motion.div
//                     key={`${event.transactionHash}-${index}`}
//                     className="border rounded-lg p-4 bg-white shadow-sm"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2, delay: index * 0.1 }}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h4 className="font-medium">
//                           {event.eventType === "ProductStateChanged"
//                             ? `State Changed to ${stateLabels[event.state]}`
//                             : "Payment Processed"}
//                         </h4>
//                         <p className="text-sm text-gray-500">
//                           {event.timestamp?.toLocaleString()}
//                         </p>
//                       </div>
//                       {event.amount && <Badge>{event.amount} ETH</Badge>}
//                     </div>

//                     {event.eventType === "PaymentProcessed" && (
//                       <div className="text-sm text-gray-600">
//                         <p>From: {event.from}</p>
//                         <p>To: {event.to}</p>
//                       </div>
//                     )}

//                     <p className="text-xs text-gray-400 mt-2">
//                       Tx: {event.transactionHash}
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}
//     </div>
//   );
// };

interface ProductHistoryLookupProps {
  contract: any; // You might want to create a specific contract type
  web3: any;
  account: string;
}

interface ProductInfo {
  id: string;
  name: string;
  basePrice: string;
  state: string;
  isValid: boolean;
  district: string;
  localBody: string;
  distance: string;
}

interface ProductFees {
  collectorFee: string;
  transporterFee: string;
  distributorFee: string;
  retailerFee: string;
}

interface ProductActors {
  farmer: string;
  collector: string;
  transporter: string;
  distributor: string;
  retailer: string;
  consumer: string;
}

interface ProductDetails {
  name: string;
  basePrice: string;
  collectorFee: string;
  transporterFee: string;
  distributorFee: string;
  retailerFee: string;
  totalPrice: string;
  location: {
    district: string;
    localBody: string;
  };
}

interface BlockchainEvent {
  transactionHash: string;
  blockNumber: number;
  eventType: string;
  state?: string;
  from?: string;
  to?: string;
  amount?: string;
  timestamp: Date | null;
}

interface ProductHistory {
  details: ProductDetails;
  events: BlockchainEvent[];
}

interface StateLabels {
  [key: number]: string;
}

const ProductHistoryLookup: React.FC<ProductHistoryLookupProps> = ({
  contract,
  web3,
  account,
}) => {
  const [productId, setProductId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [productHistory, setProductHistory] = useState<ProductHistory | null>(
    null
  );

  const stateLabels: StateLabels = {
    0: "Created",
    1: "Collected",
    2: "In Transit",
    3: "With Distributor",
    4: "With Retailer",
    5: "Sold",
  };

  const fetchProductHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError("Please enter a product ID");
      return;
    }

    setLoading(true);
    setError("");
    setProductHistory(null);

    try {
      console.log("Searching for product ID:", productId);

      const productInfo: ProductInfo = await contract.methods
        .getProductBasicInfo(productId)
        .call();
      console.log("Product info:", productInfo);

      const actors: ProductActors = await contract.methods
        .getProductActors(productId)
        .call();
      console.log("Product actors:", actors);

      if (!productInfo.isValid) {
        throw new Error("Product not found");
      }

      const currentUserAddress = account.toLowerCase();
      const consumerAddress = actors.consumer.toLowerCase();

      if (consumerAddress !== currentUserAddress) {
        throw new Error(
          "You are not authorized to view this product's history"
        );
      }

      const fees: ProductFees = await contract.methods
        .getProductFees(productId)
        .call();
      const totalPrice: string = await contract.methods
        .getTotalPrice(productId)
        .call();

      const productDetails: ProductDetails = {
        name: productInfo.name,
        basePrice: web3.utils.fromWei(
          productInfo.basePrice.toString(),
          "ether"
        ),
        collectorFee: web3.utils.fromWei(fees.collectorFee.toString(), "ether"),
        transporterFee: web3.utils.fromWei(
          fees.transporterFee.toString(),
          "ether"
        ),
        distributorFee: web3.utils.fromWei(
          fees.distributorFee.toString(),
          "ether"
        ),
        retailerFee: web3.utils.fromWei(fees.retailerFee.toString(), "ether"),
        totalPrice: web3.utils.fromWei(totalPrice.toString(), "ether"),
        location: {
          district: productInfo.district,
          localBody: productInfo.localBody,
        },
      };

      type EventFilter = {
        filter: { productId: string };
        fromBlock: number;
        toBlock: string;
      };

      const eventFilter: EventFilter = {
        filter: { productId },
        fromBlock: 0,
        toBlock: "latest",
      };

      const stateEvents = await contract.getPastEvents(
        "ProductStateChanged",
        eventFilter
      );
      const paymentEvents = await contract.getPastEvents(
        "PaymentProcessed",
        eventFilter
      );

      const allEvents: BlockchainEvent[] = [
        ...stateEvents,
        ...paymentEvents,
      ].map((event) => ({
        transactionHash: event.transactionHash,
        blockNumber: Number(event.blockNumber),
        eventType: event.event,
        state: event.returnValues.newState,
        from: event.returnValues.from,
        to: event.returnValues.to,
        amount: event.returnValues.amount
          ? web3.utils.fromWei(event.returnValues.amount.toString(), "ether")
          : undefined,
        timestamp: null,
      }));

      for (let event of allEvents) {
        const block = await web3.eth.getBlock(event.blockNumber);
        if (block && block.timestamp) {
          event.timestamp = new Date(Number(block.timestamp) * 1000);
        }
      }

      allEvents.sort((a, b) => a.blockNumber - b.blockNumber);

      setProductHistory({
        details: productDetails,
        events: allEvents,
      });
      setError("");
    } catch (err) {
      console.error("Error fetching product history:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch product history. Please try again."
      );
      setProductHistory(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product History Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={fetchProductHistory} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {productHistory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{productHistory.details.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Location Details</h3>
                  <p>District: {productHistory.details.location.district}</p>
                  <p>Local Body: {productHistory.details.location.localBody}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Price Breakdown</h3>
                  <div className="space-y-1">
                    <p>Base Price: {productHistory.details.basePrice} ETH</p>
                    <p>Total Price: {productHistory.details.totalPrice} ETH</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="font-semibold mb-4">Transaction History</h3>
              <div className="space-y-4">
                {productHistory.events.map((event, index) => (
                  <motion.div
                    key={`${event.transactionHash}-${index}`}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          {event.eventType === "ProductStateChanged"
                            ? `State Changed to ${
                                stateLabels[Number(event.state)]
                              }`
                            : "Payment Processed"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {event.timestamp?.toLocaleString()}
                        </p>
                      </div>
                      {event.amount && <Badge>{event.amount} ETH</Badge>}
                    </div>

                    {event.eventType === "PaymentProcessed" &&
                      event.from &&
                      event.to && (
                        <div className="text-sm text-gray-600">
                          <p>From: {event.from}</p>
                          <p>To: {event.to}</p>
                        </div>
                      )}

                    <p className="text-xs text-gray-400 mt-2">
                      Tx: {event.transactionHash}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

const CustomProductCard: React.FC<CustomProductCardProps> = ({
  product,
  addToCart,
  onViewHistory,
}) => {
  // Get the icon for the product name (fallback to a default icon if not found)
  const productIcon = productIcons[product.name.toLowerCase()] || "📦";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* Dynamic Icon Section */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg mb-4 p-6">
          <span className="text-6xl" role="img" aria-label={product.name}>
            {productIcon}
          </span>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-blue-500">{product.totalPrice} ETH</p>
          <div className="text-sm text-muted-foreground">
            <p>Location: {product.district}</p>
            <p>Distance: {product.distance?.toString()} KM</p>
          </div>
        </div>
      </CardContent>

      {/* Buttons Section */}
      <CardFooter className="p-0 flex flex-col">
        <Button
          onClick={() => addToCart(product)}
          disabled={Number(product.state) !== 4}
          className="w-full rounded-none bg-black text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {Number(product.state) === 4 ? "Add To Cart" : "Not Available"}
        </Button>

        <Button
          variant="outline"
          onClick={() => onViewHistory(product.id)}
          className="w-full rounded-none border-t-0 flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          View History
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductMarketplace: React.FC<ProductMarketplaceProps> = ({
  contract,
  account,
  onRegister,
}) => {
  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean;
    productId: number | null;
  }>({ isOpen: false, productId: null });
  const [productHistory, setProductHistory] = useState<{
    events: any[];
    details: {
      name: string;
      basePrice: string;
      collectorFee: string;
      transporterFee: string;
      distributorFee: string;
      retailerFee: string;
      totalPrice: string;
    };
  } | null>({
    events: [],
    details: {
      name: "",
      basePrice: "",
      collectorFee: "",
      transporterFee: "",
      distributorFee: "",
      retailerFee: "",
      totalPrice: "",
    },
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { web3 } = useWeb3();

  const [showRegistration, setShowRegistration] = useState(false);

  const handleRegisterClick = () => {
    setShowRegistration(true);
    onRegister();
  };

  const stateLabels: { [key: number]: string } = {
    0: "Created",
    1: "Collected",
    2: "In Transit",
    3: "With Distributor",
    4: "With Retailer",
    5: "Sold",
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const count = await contract.methods.productCount().call();
      const productsData = [];

      for (let i = 1; i <= count; i++) {
        const productInfo = await contract.methods
          .getProductBasicInfo(i)
          .call();

        // Only show products that are with retailers or sold (states 4 and 5)
        if (
          productInfo.isValid &&
          (Number(productInfo.state) === 4 || Number(productInfo.state) === 5)
        ) {
          const fees = await contract.methods.getProductFees(i).call();
          const actors = await contract.methods.getProductActors(i).call();
          const totalPrice = await contract.methods.getTotalPrice(i).call();

          productsData.push({
            id: productInfo.id,
            name: productInfo.name,
            basePrice: web3
              ? web3.utils.fromWei(productInfo.basePrice, "ether")
              : "0",
            state: productInfo.state,
            district: productInfo.district,
            localBody: productInfo.localBody,
            distance: productInfo.distance,
            fees: {
              collectorFee: web3
                ? web3.utils.fromWei(fees.collectorFee, "ether")
                : "0",
              transporterFee: web3
                ? web3.utils.fromWei(fees.transporterFee, "ether")
                : "0",
              distributorFee: web3
                ? web3.utils.fromWei(fees.distributorFee, "ether")
                : "0",
              retailerFee: web3
                ? web3.utils.fromWei(fees.retailerFee, "ether")
                : "0",
            },
            actors: {
              farmer: actors.farmer,
              collector: actors.collector,
              transporter: actors.transporter,
              distributor: actors.distributor,
              retailer: actors.retailer,
              consumer: actors.consumer,
            },
            totalPrice: web3 ? web3.utils.fromWei(totalPrice, "ether") : "0",
          });
        }
      }

      setProducts(productsData);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && web3) {
      fetchProducts();
    }
  }, [contract, web3]);

  const addToCart = (product: Product) => {
    if (Number(product.state) !== 4) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.totalPrice),
          quantity: 1,
        },
      ];
    });
  };
  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutStatus(null);

    try {
      const purchasedIds = [];
      for (const item of cart) {
        // Fetch the retailer fee for the product
        const fees = await contract.methods.getProductFees(item.id).call();
        const retailerFeeWei = fees.retailerFee; // Retailer fee in Wei
        const retailerFeeEth =
          web3?.utils.fromWei(retailerFeeWei, "ether") || "0"; // Convert to ETH

        // Pay only the retailer fee
        await contract.methods.purchaseProduct(item.id).send({
          from: account,
          value: retailerFeeWei, // Pay only the retailer fee in Wei
        });
        purchasedIds.push(item.id);
        console.log(
          `Paid ${retailerFeeEth} ETH (retailer fee) for product ${item.id}`
        );
      }

      setCheckoutStatus({
        success: true,
        message: `Purchase completed successfully! Only retailer fees were paid.Product IDs: ${purchasedIds.join(
          ", "
        )}`,
      });
      console.log("Successfully purchased products with IDs:", purchasedIds);
      setCart([]); // Clear the cart after successful checkout
    } catch (error) {
      console.error("Checkout failed:", error);
      setCheckoutStatus({
        success: false,
        message: "Checkout failed. Please try again.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };
  // Checkout logic...

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (showRegistration) {
    return <UserRegistration contract={contract} account={account} />;
  }

  const handleViewHistory = async (productId: number) => {
    try {
      setHistoryLoading(true);
      setHistoryModal({ isOpen: true, productId });
      const productInfo = await contract.methods
        .getProductBasicInfo(productId)
        .call();
      const fees = await contract.methods.getProductFees(productId).call();
      const totalPrice = await contract.methods.getTotalPrice(productId).call();

      const productDetails = {
        name: productInfo.name,
        basePrice: web3?.utils.fromWei(productInfo.basePrice, "ether") || "0",
        collectorFee: web3?.utils.fromWei(fees.collectorFee, "ether") || "0",
        transporterFee:
          web3?.utils.fromWei(fees.transporterFee, "ether") || "0",
        distributorFee:
          web3?.utils.fromWei(fees.distributorFee, "ether") || "0",
        retailerFee: web3?.utils.fromWei(fees.retailerFee, "ether") || "0",
        totalPrice: web3?.utils.fromWei(totalPrice, "ether") || "0",
      };

      // Fetch state change events
      const stateEvents = await contract.getPastEvents("ProductStateChanged", {
        filter: { productId },
        fromBlock: 0,
        toBlock: "latest",
      });

      // Fetch payment events
      const paymentEvents = await contract.getPastEvents("PaymentProcessed", {
        filter: { productId },
        fromBlock: 0,
        toBlock: "latest",
      });

      // Combine and sort events
      const allEvents = [...stateEvents, ...paymentEvents].map((event) => ({
        transactionHash: event.transactionHash,
        blockNumber: Number(event.blockNumber),
        eventType: event.event,
        state: event.returnValues.newState,
        from: event.returnValues.from,
        to: event.returnValues.to,
        amount: event.returnValues.amount
          ? web3?.utils.fromWei(event.returnValues.amount, "ether")
          : null,
        timestamp: null as Date | null,
      }));

      // Get timestamps
      for (let event of allEvents) {
        const block = await web3?.eth.getBlock(event.blockNumber);
        if (block) {
          event.timestamp = new Date(Number(block.timestamp) * 1000);
        }
      }

      // Sort by block number
      allEvents.sort((a, b) => a.blockNumber - b.blockNumber);
      setProductHistory({
        events: allEvents,
        details: productDetails,
      });
    } catch (error) {
      console.error("Error fetching product history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-green-700">
              <i>Agro </i>
              <b>bot</b>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm">
                Home
              </Link>
              <Link href="/contact" className="text-sm">
                Contact
              </Link>
              <Link href="/about" className="text-sm">
                About
              </Link>
              <div onClick={handleRegisterClick} className="text-sm">
                Sign Up
              </div>
            </nav>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="What are you looking for?"
                  className="w-[200px] pl-8"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-[#e8f5e9]">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="py-12 md:py-24">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                    Fresh from the Farm, Delivered to You!
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    Buy organic vegetables, fruits, and farm-fresh produce
                    directly from local farmers
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    onClick={() => setCartOpen(true)}
                  >
                    View Cart
                  </Button>
                </div>
                <div className="relative h-[400px]">
                  <Image
                    src={landing}
                    alt="Farm landscape with workers loading produce"
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Today's Products */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">Today's Products</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    ←
                  </Button>
                  <Button variant="outline" size="icon">
                    →
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <CustomProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-semibold mb-8">
                Browse By Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <CategoryCard name="Vegetables" icon="🥬" isActive={true} />
                <CategoryCard name="Fruits" icon="🍎" isActive={true} />
                <CategoryCard
                  name="Grains and cereals"
                  icon="🌾"
                  isActive={true}
                />
                <CategoryCard
                  name="Seasonal Specials"
                  icon="🌿"
                  isActive={true}
                />
                <CategoryCard name="Meat" icon="🥩" isActive={true} />
                <CategoryCard
                  name="Organic produce"
                  icon="🥗"
                  isActive={true}
                />
              </div>
            </div>
          </section>

          {/* Explore Products */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">Explore Our Products</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    ←
                  </Button>
                  <Button variant="outline" size="icon">
                    →
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <CustomProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">
              Look Up Your Purchased Products
            </h2>
            <ProductHistoryLookup
              contract={contract}
              web3={web3}
              account={account}
            />
          </div>
        </section>

        <Footer />

        {/* Cart Dialog */}
        <Dialog open={cartOpen} onOpenChange={setCartOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
            </DialogHeader>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price} ETH</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              setCart((prev) =>
                                prev.map((cartItem) =>
                                  cartItem.id === item.id
                                    ? {
                                        ...cartItem,
                                        quantity: Number(e.target.value),
                                      }
                                    : cartItem
                                )
                              )
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          {(item.price * item.quantity).toFixed(2)} ETH
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">
                      {cartTotal.toFixed(2)} ETH
                    </span>
                  </div>

                  {checkoutStatus && (
                    <div
                      className={`p-3 rounded-md ${
                        checkoutStatus.success
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {checkoutStatus.success ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>{checkoutStatus.message}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full"
                  >
                    {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Dialog
        open={historyModal.isOpen}
        onOpenChange={() => setHistoryModal({ isOpen: false, productId: null })}
      >
        <DialogContent className="max-w-2xl w-full sm:max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Product History & Price Details</DialogTitle>
          </DialogHeader>

          {historyLoading ? (
            <div className="flex justify-center p-4">
              <motion.div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>
          ) : (
            <motion.div
              className="space-y-6 max-h-[70vh] overflow-y-auto p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Price Breakdown Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Base Price",
                        value: productHistory?.details?.basePrice,
                      },
                      {
                        label: "Collector Fee",
                        value: productHistory?.details?.collectorFee,
                      },
                      {
                        label: "Transporter Fee",
                        value: productHistory?.details?.transporterFee,
                      },
                      {
                        label: "Distributor Fee",
                        value: productHistory?.details?.distributorFee,
                      },
                      {
                        label: "Retailer Fee",
                        value: productHistory?.details?.retailerFee,
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.label}:</span>
                        <span>{item.value} ETH</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Price:</span>
                      <span>{productHistory?.details?.totalPrice} ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <div className="space-y-4">
                {productHistory?.events?.map((event, index) => (
                  <motion.div
                    key={`${event.transactionHash}-${index}`}
                    className="border rounded-lg p-4 bg-white shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">
                          {event.eventType === "ProductStateChanged"
                            ? `State Changed to ${stateLabels[event.state]}`
                            : "Payment Processed"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.timestamp?.toLocaleString()}
                        </p>
                      </div>
                      {event.amount && <Badge>{event.amount} ETH</Badge>}
                    </div>

                    {event.eventType === "PaymentProcessed" && (
                      <div className="text-sm text-gray-600">
                        <p>From: {event.from}</p>
                        <p>To: {event.to}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Tx: {event.transactionHash}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params); // This will give you { lang: string }
  const { lang } = resolvedParams;
  const { setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { connect, disconnect, account, isActive, contract, error } = useWeb3();
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState<boolean>(false);
  const [registrationComplete, setRegistrationComplete] =
    useState<boolean>(false);

  useEffect(() => {
    if (lang === "en" || lang === "nep") {
      setLanguage(lang);
    }
  }, []);
  const handleConnection = async () => {
    try {
      setConnectionStatus("Connecting...");
      if (window.ethereum) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await connect();
        // After successful connection, immediately show registration
        setShowRegistration(true);
      } else {
        setConnectionStatus("Please install MetaMask!");
      }
    } catch (err: any) {
      console.error(err);
      setConnectionStatus(err.message || "Failed to connect");
    }
  };

  // Effect to check user role whenever registration might have completed
  // useEffect(() => {
  //   const checkUserRole = async () => {
  //     if (isActive && account && contract) {
  //       try {
  //         const role = await contract.methods.userRoles(account).call();
  //         if (role && role !== "") {
  //           setUserRole(role);
  //           setShowRegistration(false);
  //           setRegistrationComplete(true);
  //         }
  //       } catch (err) {
  //         console.error("Error checking role:", err);
  //       }
  //     }
  //   };

  //   checkUserRole();
  // }, [isActive, account, contract, registrationComplete]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isActive && account && contract) {
        if (
          account.toLowerCase() ===
          "0xD428DDce2d9129f6cD6dea7D88ccf1b9881DC863".toLowerCase()
        ) {
          setUserRole("ADMIN");
          setShowRegistration(false);
          setRegistrationComplete(true);
        } else {
          try {
            const role = await contract.methods.userRoles(account).call();
            if (role && role !== "") {
              setUserRole(role);
              setShowRegistration(false);
              setRegistrationComplete(true);
            }
          } catch (err) {
            console.error("Error checking role:", err);
          }
        }
      }
    };

    checkUserRole();
  }, [isActive, account, contract, registrationComplete]);

  // Check for MetaMask on component mount
  useEffect(() => {
    if (!window.ethereum) {
      setConnectionStatus(
        "MetaMask is not installed. Please install MetaMask to use this application."
      );
    }
  }, []);

  const renderDashboard = () => {
    if (account === "0xD428DDce2d9129f6cD6dea7D88ccf1b9881DC863") {
      return <AdminDashboard contract={contract} account={account} />;
    }

    switch (userRole) {
      case "FARMER":
        return <FarmerDashboard contract={contract} account={account || ""} />;
      case "COLLECTOR":
        return (
          <CollectorDashboard contract={contract} account={account || ""} />
        );
      case "TRANSPORTER":
        return (
          <TransporterDashboard contract={contract} account={account || ""} />
        );
      case "DISTRIBUTOR":
        return (
          <DistributorDashboard contract={contract} account={account || ""} />
        );
      case "RETAILER":
        return (
          <RetailerDashboard contract={contract} account={account || ""} />
        );
      default:
        return (
          // <Card>
          //   <CardContent>
          //     <p className="text-center text-gray-500">
          //       Unknown role or role not assigned
          //     </p>
          //   </CardContent>
          // </Card>
          <ProductMarketplace
            contract={contract}
            account={account || ""}
            onRegister={() => setShowRegistration(true)}
          />
        );
    }
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <Wheat className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to <i>Agro </i>
                <b>bot</b>
              </CardTitle>
              <p className="text-gray-500 mt-2">
                Connect your wallet to start managing your agricultural supply
                chain
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {connectionStatus && (
              <Alert className="border-l-4 border-blue-500 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  {connectionStatus}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="border-l-4 border-red-500 bg-red-50"
              >
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleConnection}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                Connect with MetaMask
              </Button>
            </div>
          </CardContent>

          <div className="border-t border-gray-100 mt-6 px-6 py-4 bg-gray-50/50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Network Status: Active
              </div>
              <a href="#" className="hover:text-gray-700">
                Need Help?
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // if (showRegistration) {
  //   return (
  //     <div className="container mx-auto p-4">
  //       <UserRegistration contract={contract} account={account || ""} />
  //     </div>
  //   );
  // }
  if (showRegistration) {
    return (
      <div className="container mx-auto p-4">
        <ProductMarketplace
          contract={contract}
          account={account || ""}
          onRegister={() => setShowRegistration(true)}
        />
      </div>
    );
  }

  // top bar
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Wheat className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-green-700">
                <i>Agro </i>
                <b>bot</b>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-transparent border-0 p-0 text-gray-700 font-medium">
                  {userRole}
                </Badge>
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
                onClick={disconnect}
              >
                <LogOut className="w-4 h-4" />
                {t("disconnect")}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t("welcome")}, {userRole}!
          </h2>

          <div className="mt-6">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="inline-flex w-full gap-4 p-1 bg-gray-50 rounded-lg">
                <TabsTrigger
                  value="dashboard"
                  className="flex-1 px-4 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    {/* <LayoutDashboard className="w-4 h-4" /> */}
                    {t("dashboard")}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex-1 px-4 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <History className="w-4 h-4" />
                    {t("transaction_history")}
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                {renderDashboard()}
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <TransactionHistory
                  contract={contract}
                  account={account || ""}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 mt-auto">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            © 2024 <i>Agro </i>
            <b>bot</b>
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected to Blockchain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
