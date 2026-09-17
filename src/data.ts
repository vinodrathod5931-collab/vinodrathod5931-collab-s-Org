import { Product, Order } from './types';

export const mockProduce: Product[] = [
  {
    id: 'p1',
    name: 'Organic Wheat',
    category: 'produce',
    pricePerUnit: 250,
    unit: 'Ton',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
    description: 'High-quality organic wheat harvested this season.',
    rating: 4.8,
    reviewCount: 124,
    farmerLocation: 'Central Valley, CA',
    reviews: [
      { id: 'r1', author: 'John D.', rating: 5, text: 'Excellent quality wheat, arrived on time.', date: '2023-10-10' },
      { id: 'r2', author: 'Sarah W.', rating: 4, text: 'Good quality, but shipping took a bit longer than expected.', date: '2023-09-28' }
    ]
  },
  {
    id: 'p2',
    name: 'Fresh Tomatoes',
    category: 'produce',
    pricePerUnit: 1.5,
    unit: 'kg',
    stock: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
    description: 'Farm fresh red tomatoes suitable for all culinary needs.',
    rating: 4.5,
    reviewCount: 89,
    farmerLocation: 'Sacramento, CA',
  },
  {
    id: 'p3',
    name: 'Sweet Corn',
    category: 'produce',
    pricePerUnit: 3,
    unit: 'Dozen',
    stock: 500,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400',
    description: 'Sweet and juicy corn cobs directly from the field.',
    rating: 4.9,
    reviewCount: 215,
    farmerLocation: 'Omaha, NE',
  },
];

export const mockSeeds: Product[] = [
  {
    id: 's1',
    name: 'Premium Wheat Seeds',
    category: 'seeds',
    pricePerUnit: 40,
    unit: 'Bag (25kg)',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1586521746200-d830b06b2a09?auto=format&fit=crop&q=80&w=400',
    description: 'High-yield, disease-resistant wheat seeds.',
    rating: 4.7,
    reviewCount: 342,
  },
  {
    id: 's2',
    name: 'Hybrid Tomato Seeds',
    category: 'seeds',
    pricePerUnit: 15,
    unit: 'Packet (100g)',
    stock: 300,
    imageUrl: 'https://images.unsplash.com/photo-1628156385489-cf732049e6f4?auto=format&fit=crop&q=80&w=400',
    description: 'Fast-growing hybrid seeds for robust tomato plants.',
    rating: 4.6,
    reviewCount: 156,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-8932-XYZ',
    productName: 'Organic Wheat',
    quantity: 2,
    totalPrice: 500,
    date: '2023-10-25',
    status: 'in_transit',
    trackingNumber: 'TRK-99238472',
    role: 'buyer',
    currentLocation: 'Interstate 80, Near Omaha, NE',
    driverName: 'Michael T.',
    driverPhone: '+1 (555) 123-4567'
  },
  {
    id: 'ORD-3321-ABC',
    productName: 'Premium Wheat Seeds',
    quantity: 5,
    totalPrice: 200,
    date: '2023-10-26',
    status: 'processing',
    trackingNumber: 'TRK-11293847',
    role: 'farmer',
    currentLocation: 'Distribution Center, Sacramento, CA',
    driverName: 'Sarah J.',
    driverPhone: '+1 (555) 987-6543'
  }
];
