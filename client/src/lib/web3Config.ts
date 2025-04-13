// src/lib/web3Config.ts

import Web3 from 'web3'
// import AgriSupplyChain from '../../../build/contracts/AgriSupplyChain.json';

export const getWeb3 = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    return new Web3(window.ethereum)
  }
  return null
}


// Helper function to get the contract address dynamically
// export const getContractAddress = () => {
//   const networkId = "5777"; // Update based on the current network ID
//   return AgriSupplyChain.networks[networkId]?.address || null;
// };
export const CONTRACT_ADDRESS = "0xC2557D17b3Ad9Ff2E70B600284e2Bb271aE85cB6"; // Replace after deployment

// export const CONTRACT_ADDRESS = getContractAddress();
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "entity",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "FeeAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "newState",
        "type": "uint8"
      }
    ],
    "name": "ProductStateChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "fromState",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "toState",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "by",
        "type": "address"
      }
    ],
    "name": "TransactionReverted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "productPayments",
    "outputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "fromState",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "toState",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "basePrice",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isValid",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isPaid",
            "type": "bool"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "district",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "localBody",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "distance",
                "type": "uint256"
              }
            ],
            "internalType": "struct ProductStructs.Location",
            "name": "location",
            "type": "tuple"
          }
        ],
        "internalType": "struct ProductStructs.ProductDetails",
        "name": "details",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "farmer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "collector",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "transporter",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "distributor",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "retailer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "consumer",
            "type": "address"
          }
        ],
        "internalType": "struct ProductStructs.ProductActors",
        "name": "actors",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "collectorFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "transporterFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributorFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "retailerFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct ProductStructs.ProductFees",
        "name": "fees",
        "type": "tuple"
      },
      {
        "internalType": "uint8",
        "name": "state",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userRoles",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "revertTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_role",
        "type": "string"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_basePrice",
        "type": "uint256"
      }
    ],
    "name": "createProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_collectorFee",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_district",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_localBody",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_distance",
        "type": "uint256"
      }
    ],
    "name": "collectProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_transporterFee",
        "type": "uint256"
      }
    ],
    "name": "transportProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributorFee",
        "type": "uint256"
      }
    ],
    "name": "distributeProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_retailerFee",
        "type": "uint256"
      }
    ],
    "name": "sendToRetailer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "purchaseProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getProductTransactions",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "from",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "to",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint8[]",
        "name": "fromStates",
        "type": "uint8[]"
      },
      {
        "internalType": "uint8[]",
        "name": "toStates",
        "type": "uint8[]"
      },
      {
        "internalType": "uint256[]",
        "name": "timestamps",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getProductBasicInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "basePrice",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "state",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "district",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "localBody",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "distance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getProductFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "collectorFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "transporterFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "distributorFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "retailerFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getProductActors",
    "outputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "collector",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "transporter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "distributor",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "retailer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "consumer",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getTotalPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
