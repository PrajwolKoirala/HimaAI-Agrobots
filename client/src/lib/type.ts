
type ProductState = 
  | "Created"
  | "CollectedByCollector"
  | "WithTransporter"
  | "WithDistributor"
  | "WithRetailer"
  | "Sold";
interface Product {
    id: number;
    name: string;
    basePrice?: string;
    price?: string;
    state: ProductState;
    collectorFee?: string;
    transporterFee?: string;
    distributorFee?: string;
    retailerFee?: string;
    distance?: Number;
    district?: string;
    localBody?: string;
    totalFee?: string;
    totalPrice?: string;
    actors?: {

      farmer: string;
  
      collector: string;
  
      transporter: string;
  
      distributor: string;
  
      retailer: string;
  
      consumer: string;
  
    };
    fees?: {

      collectorFee: string;
  
      transporterFee: string;
  
      distributorFee: string;
  
      retailerFee: string;
  
    };
  }
  
  interface DashboardProps {
    contract: any;
    account: string;
  }
  
  interface ProductCardProps {
    product: Product;
  }
  
  interface ProductListProps {
    products: Product[];
    onSelect: (id: number) => void;
    selectedId: number | null;
    stateLabel: string;
  }

  type Item = {
    id: number;
    name: string;
  };
  
 export  type SearchableSelectProps = {
    items: Item[];
    value: string | null; // Allow null for no selection
    onChange: (value: string) => void;
    placeholder: string;
  };

  export {
    type Product,
    type DashboardProps,
    type ProductCardProps,
    type ProductListProps,
  };