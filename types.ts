export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  shopName: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'rider';
  phone?: string;
  savedAddresses?: Address[];
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  type: 'Home' | 'Work';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: Address;
  paymentMethod: string;
  riderId?: string;
}

export interface SponsorAd {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  placement: 'hero' | 'header';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}