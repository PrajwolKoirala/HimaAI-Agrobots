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
import Image from "next/image";

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
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{product.name}</h3>
            <Badge className={stateColors[product.state]}>{product.state}</Badge>
          </div>
          <p className="text-sm text-gray-500">ID: {product.id}</p>
          <p className="text-sm text-gray-500">Price: {product.price} ETH</p>
        </CardContent>
      </Card>
    );
  };

  export default ProductCard;