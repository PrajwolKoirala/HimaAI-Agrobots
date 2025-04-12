# 🌾 Agroबट

Agroबट is a decentralized agricultural supply chain management system built with Ethereum smart contracts and a modern frontend using Next.js. This project leverages **Truffle**, **Ganache**, **Metamask**, and **web3.js** to enable transparent and efficient management of agricultural goods. To help Farmer this project also uses google's **Gemini** for simple chatbot related to agriculture.

---

## 🚀 Tech Stack

- **Ethereum Blockchain** – Smart contracts for transparency and trust.
- **Solidity** – Language used for writing the contracts.
- **Truffle** – Development framework for Ethereum.
- **Ganache** – Personal Ethereum blockchain for development.
- **Metamask** – Browser wallet to interact with blockchain.
- **Next.js** – Frontend framework.
- **pnpm / npm** – Package managers.

---

## 📦 Installation

Follow the steps below to run the project locally.

### 1. Clone the Repository

git clone https://github.com/PrajwolKoirala/HimaAI-Agrobots.git
cd agrobot

### 2. Install Smart Contract Dependencies
pnpm install
#or
npm install


### 3. Install Frontend Dependencies
cd client
pnpm install
# or
npm install

### 4. Install Truffle globally if not installed
npm install -g truffle

### 5. Start Ganache
Open Ganache GUI or run Ganache CLI.

Make sure it's running on http://127.0.0.1:7545.

### 6. Migrate/compile Contracts
truffle migrate --reset


### 7. Add Contract Address

// src/lib/web3Config.ts

export const CONTRACT_ADDRESS = "PASTE_DEPLOYED_ADDRESS_HERE";


### 8. Add Contract ABI

export const CONTRACT_ABI = [/* ABI CONTENT GOES HERE */];


### 9. 🔐 Environment Variables

NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here

---
CLIENT PART

cd ./client

### 1. Install the Dependencies
Pnpm install
#or
npm install

### 2. Run Frontend
Pnpm run dev
#or
npm run dev


