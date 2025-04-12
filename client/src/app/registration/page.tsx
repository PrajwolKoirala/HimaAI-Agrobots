// "use client";
// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   History,
//   User,
//   Wheat,
//   Box,
//   Truck,
//   Store,
//   ShoppingBag,
//   Wallet,
//   LogOut,
// } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useRouter } from "next/navigation";

// interface UserRegistrationProps {
//   contract: any;
//   account: string;
// }

// const UserRegistration: React.FC<UserRegistrationProps> = ({
//   contract,
//   account,
// }) => {
//   const router = useRouter();
//   const [address, setAddress] = useState<string>("");
//   const [role, setRole] = useState<string>("");
//   const [status, setStatus] = useState<string>("");

//   const registerUser = async () => {
//     if (!contract || !account) {
//       setStatus("Please connect your wallet first");
//       return;
//     }

//     try {
//       setStatus("Registering user...");

//       // Use the connected account if no address is provided
//       const targetAddress = address || account;

//       const result = await contract.methods
//         .registerUser(targetAddress, role)
//         .send({ from: account });

//       setStatus(`Successfully registered address ${targetAddress} as ${role}`);
//       setAddress("");
//       setRole("");
//     } catch (error: any) {
//       console.error("Registration error:", error);
//       setStatus(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-lg backdrop-blur-sm bg-white/90 shadow-xl border-0">
//         <CardHeader className="text-center space-y-4">
//           <div className="flex justify-center">
//             <div className="bg-green-100 p-3 rounded-full">
//               <User className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//               Create Your Account
//             </CardTitle>
//             <p className="text-gray-500 mt-2">
//               Join the agricultural supply chain network
//             </p>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="space-y-4">
//             <div className="relative">
//               <Input
//                 placeholder="Address (leave empty to use connected wallet)"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
//               />
//               <div className="absolute left-3 top-3.5 text-gray-400">
//                 <Wallet className="w-5 h-5" />
//               </div>
//             </div>

//             <div className="relative">
//               <Select onValueChange={setRole} value={role}>
//                 <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500">
//                   <SelectValue placeholder="Select your role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <div className="p-2">
//                     <div className="mb-2 px-2 text-sm font-medium text-gray-500">
//                       Choose your role
//                     </div>
//                     <SelectItem
//                       value="FARMER"
//                       className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
//                     >
//                       <Wheat className="w-4 h-4 absolute left-2 top-3.5 text-green-600" />
//                       Farmer
//                     </SelectItem>
//                     <SelectItem
//                       value="COLLECTOR"
//                       className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
//                     >
//                       <Box className="w-4 h-4 absolute left-2 top-3.5 text-blue-600" />
//                       Collector
//                     </SelectItem>
//                     <SelectItem
//                       value="TRANSPORTER"
//                       className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
//                     >
//                       <Truck className="w-4 h-4 absolute left-2 top-3.5 text-yellow-600" />
//                       Transporter
//                     </SelectItem>
//                     <SelectItem
//                       value="DISTRIBUTOR"
//                       className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
//                     >
//                       <Store className="w-4 h-4 absolute left-2 top-3.5 text-purple-600" />
//                       Distributor
//                     </SelectItem>
//                     <SelectItem
//                       value="RETAILER"
//                       className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
//                     >
//                       <ShoppingBag className="w-4 h-4 absolute left-2 top-3.5 text-pink-600" />
//                       Retailer
//                     </SelectItem>
//                   </div>
//                 </SelectContent>
//               </Select>
//             </div>

//             <Button
//               onClick={registerUser}
//               className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
//             >
//               Complete Registration
//             </Button>

//             {status && (
//               <Alert className="border-l-4 border-blue-500 bg-blue-50">
//                 <AlertDescription className="text-blue-700">
//                   {status}
//                 </AlertDescription>
//               </Alert>
//             )}
//           </div>
//         </CardContent>

//         <div className="border-t border-gray-100 mt-6 px-6 py-4 bg-gray-50/50">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span>Connected Wallet:</span>
//               </div>
//               <span className="font-mono text-xs truncate max-w-[200px]">
//                 {address || "Using default wallet"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default UserRegistration;


"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Wheat,
  Box,
  Truck,
  Store,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface UserRegistrationProps {
  contract: any;
  account: string;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({
  contract,
  account,
}) => {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!contract || !account) return;

      try {
        const targetAddress = address || account;
        const result = await contract.methods.isUserRegistered(targetAddress).call({ from: account });

        if (result) {
          setIsRegistered(true);
          setStatus("User is already registered. Refreshing page...");
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Refresh after 2 seconds
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    checkRegistration();
  }, [contract, account, address]);

  const registerUser = async () => {
    if (!contract || !account) {
      setStatus("Please connect your wallet first");
      return;
    }

    if (!role) {
      setStatus("Please choose a role first");
      return;
    }

    try {
      setStatus("Registering user...");

      const targetAddress = address || account;
      const result = await contract.methods
        .registerUser(targetAddress, role)
        .send({ from: account });

      setStatus(`Successfully registered address ${targetAddress} as ${role}`);
      setAddress("");
      setRole("");
      router.push("/en");
    } catch (error: any) {
      console.error("Registration error:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg backdrop-blur-sm bg-white/90 shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Create Your Account
            </CardTitle>
            <p className="text-gray-500 mt-2">
              Join the agricultural supply chain network
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Address (leave empty to use connected wallet)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="relative">
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="mb-2 px-2 text-sm font-medium text-gray-500">
                      Choose your role
                    </div>
                    <SelectItem
                      value="FARMER"
                      className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
                    >
                      <Wheat className="w-4 h-4 absolute left-2 top-3.5 text-green-600" />
                      Farmer
                    </SelectItem>
                    <SelectItem
                      value="COLLECTOR"
                      className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
                    >
                      <Box className="w-4 h-4 absolute left-2 top-3.5 text-blue-600" />
                      Collector
                    </SelectItem>
                    <SelectItem
                      value="TRANSPORTER"
                      className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
                    >
                      <Truck className="w-4 h-4 absolute left-2 top-3.5 text-yellow-600" />
                      Transporter
                    </SelectItem>
                    <SelectItem
                      value="DISTRIBUTOR"
                      className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
                    >
                      <Store className="w-4 h-4 absolute left-2 top-3.5 text-purple-600" />
                      Distributor
                    </SelectItem>
                    <SelectItem
                      value="RETAILER"
                      className="relative pl-8 py-3 cursor-pointer hover:bg-green-50"
                    >
                      <ShoppingBag className="w-4 h-4 absolute left-2 top-3.5 text-pink-600" />
                      Retailer
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={registerUser}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Complete Registration
            </Button>

            {status && (
              <Alert className="border-l-4 border-blue-500 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  {status}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>

        <div className="border-t border-gray-100 mt-6 px-6 py-4 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected Wallet:</span>
              </div>
              <span className="font-mono text-xs truncate max-w-[200px]">
                {address || "Using default wallet"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserRegistration;