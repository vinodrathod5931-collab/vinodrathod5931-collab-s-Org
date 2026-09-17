export type Role = 'farmer' | 'buyer';

export type Category = 'produce' | 'seeds';

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  pricePerUnit: number;
  unit: string;
  stock: number;
  imageUrl: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  farmerLocation?: string;
  reviews?: Review[];
}

export type ShipmentStatus = 'processing' | 'shipped' | 'in_transit' | 'delivered';

export interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: string;
  status: ShipmentStatus;
  trackingNumber: string;
  role: Role; // indicates who placed the order (farmer buying seeds, buyer buying produce)
  currentLocation?: string;
  driverName?: string;
  driverPhone?: string;
}
