import { Product, SponsorAd } from './types';

export const CATEGORIES = [
  "Groceries",
  "Fashion",
  "Electronics",
  "Home & Kitchen",
  "Beauty",
  "Mobile Accessories"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Basmati Rice Premium (5kg)",
    description: "Aromatic premium aged basmati rice perfect for Biryani.",
    price: 650,
    originalPrice: 850,
    category: "Groceries",
    image: "https://picsum.photos/400/400?random=1",
    rating: 4.5,
    reviews: 120,
    shopName: "Sharma Kirana Store",
    stock: 50
  },
  {
    id: "p2",
    name: "Cotton Kurta for Men",
    description: "Traditional printed cotton kurta, breathable fabric.",
    price: 899,
    originalPrice: 1499,
    category: "Fashion",
    image: "https://picsum.photos/400/400?random=2",
    rating: 4.2,
    reviews: 85,
    shopName: "Desi Threads",
    stock: 20
  },
  {
    id: "p3",
    name: "Wireless Earbuds Pro",
    description: "Active Noise Cancellation, 30hr battery life.",
    price: 1299,
    originalPrice: 2999,
    category: "Electronics",
    image: "https://picsum.photos/400/400?random=3",
    rating: 4.7,
    reviews: 340,
    shopName: "Tech World",
    stock: 15
  },
  {
    id: "p4",
    name: "Organic Turmeric Powder (200g)",
    description: "Pure organic turmeric sourced from farms.",
    price: 120,
    originalPrice: 180,
    category: "Groceries",
    image: "https://picsum.photos/400/400?random=4",
    rating: 4.8,
    reviews: 50,
    shopName: "Organic India Hub",
    stock: 100
  },
  {
    id: "p5",
    name: "Non-Stick Cookware Set",
    description: "3-piece induction friendly cookware set.",
    price: 2499,
    originalPrice: 3999,
    category: "Home & Kitchen",
    image: "https://picsum.photos/400/400?random=5",
    rating: 4.3,
    reviews: 210,
    shopName: "Home Essentials",
    stock: 10
  },
  {
    id: "p6",
    name: "Ayurvedic Face Wash",
    description: "Neem and Tulsi herbal face wash for glowing skin.",
    price: 199,
    originalPrice: 250,
    category: "Beauty",
    image: "https://picsum.photos/400/400?random=6",
    rating: 4.6,
    reviews: 400,
    shopName: "Herbal Care",
    stock: 60
  }
];

export const SPONSORED_ADS: SponsorAd[] = [
  {
    id: "ad1",
    title: "Diwali Sale Live Now! Flat 50% Off.",
    imageUrl: "https://picsum.photos/800/300?random=10",
    link: "/shop",
    placement: 'hero'
  },
  {
    id: "ad2",
    title: "Latest Electronics at Best Prices",
    imageUrl: "https://picsum.photos/800/300?random=11",
    link: "/shop?cat=Electronics",
    placement: 'hero'
  },
  {
    id: "ad3",
    title: "🎉 Use code DESI50 for 50% Off on your first order!",
    imageUrl: "",
    link: "/shop",
    placement: 'header'
  },
  {
    id: "ad4",
    title: "🚚 Free Delivery on orders above ₹500",
    imageUrl: "",
    link: "/shop",
    placement: 'header'
  }
];