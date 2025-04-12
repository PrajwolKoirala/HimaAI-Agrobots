// lib/translations.ts
export const translations = {
    en: {
      welcome: "Welcome",
      connect_wallet: "Connect your wallet to start managing your agricultural supply chain",
      connect_metamask: "Connect with MetaMask",
      network_status: "Network Status: Active",
      need_help: "Need Help?",
      connecting: "Connecting...",
      install_metamask: "Please install MetaMask!",
      unknown_role: "Unknown role or role not assigned",
      welcome_role: "Welcome, ",
      dashboard: "Dashboard",
      transaction_history: "Transaction History",
      connected_blockchain: "Connected to Blockchain",
      disconnect: "Disconnect"
    },
    nep: {
      welcome: "स्वागत छ",
      connect_wallet: "आफ्नो कृषि आपूर्ति श्रृंखला प्रबन्ध गर्न सुरु गर्न आफ्नो वालेट जडान गर्नुहोस्",
      connect_metamask: "Conectar con MetaMask",
      network_status: "Estado de la Red: Activo",
      need_help: "¿Necesita Ayuda?",
      connecting: "Conectando...",
      install_metamask: "¡Por favor, instale MetaMask!",
      unknown_role: "Rol desconocido o no asignado",
      welcome_role: "¡Bienvenido, {{role}}!",
      dashboard: "ड्यासबोर्ड",
      transaction_history: "लेनदेन इतिहास",
      connected_blockchain: "Conectado a Blockchain",
      disconnect: "जडान विच्छेद गर्नुहोस्"
    }
  } as const;
  
  export type Language = keyof typeof translations;