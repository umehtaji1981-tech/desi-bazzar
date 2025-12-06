import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Review, SponsorAd } from '../types';
import { MOCK_PRODUCTS, SPONSORED_ADS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  savedItems: CartItem[];
  user: User | null;
  orders: Order[];
  reviews: Record<string, Review[]>;
  ads: SponsorAd[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  moveToCart: (product: Product) => void;
  removeFromSaved: (productId: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'productId'>) => void;
  login: (email: string, password: string, role: User['role']) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  reorder: (items: CartItem[]) => void;
  addAd: (ad: Omit<SponsorAd, 'id'>) => void;
  updateAd: (id: string, ad: Omit<SponsorAd, 'id'>) => void;
  deleteAd: (id: string) => void;
  reorderAds: (ads: SponsorAd[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('desimart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('desimart_saved');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('desimart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('desimart_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [ads, setAds] = useState<SponsorAd[]>(() => {
      const savedAds = localStorage.getItem('desimart_ads');
      return savedAds ? JSON.parse(savedAds) : SPONSORED_ADS;
  });

  const [reviews, setReviews] = useState<Record<string, Review[]>>({
    "p1": [
      { id: "r1", productId: "p1", userId: "u99", userName: "Rohan Gupta", rating: 5, comment: "Excellent quality rice, very aromatic!", date: "2023-10-15" },
      { id: "r2", productId: "p1", userId: "u98", userName: "Priya Singh", rating: 4, comment: "Good packaging, fast delivery.", date: "2023-10-20" }
    ],
    "p3": [
        { id: "r3", productId: "p3", userId: "u97", userName: "Amit Kumar", rating: 5, comment: "Best earbuds in this price range.", date: "2023-11-05" }
    ]
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('desimart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('desimart_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('desimart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('desimart_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('desimart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('desimart_ads', JSON.stringify(ads));
  }, [ads]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const saveForLater = (product: Product) => {
      // Remove from cart
      removeFromCart(product.id);
      // Add to saved if not already there
      toggleWishlist(product);
  };

  const toggleWishlist = (product: Product) => {
    setSavedItems(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
            return prev.filter(item => item.id !== product.id);
        }
        return [...prev, { ...product, quantity: 1 }];
    });
  };

  const moveToCart = (product: Product) => {
      // Remove from saved
      removeFromSaved(product.id);
      // Add to cart
      addToCart(product, 1);
  };

  const removeFromSaved = (productId: string) => {
      setSavedItems(prev => prev.filter(item => item.id !== productId));
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date' | 'productId'>) => {
      const newReview: Review = {
          id: `rev-${Date.now()}`,
          productId,
          date: new Date().toISOString().split('T')[0],
          ...reviewData
      };
      setReviews(prev => ({
          ...prev,
          [productId]: [...(prev[productId] || []), newReview]
      }));
  };

  const login = async (email: string, password: string, role: User['role']): Promise<{ success: boolean; message?: string }> => {
    // Simulate API call and validation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!email.includes('@')) {
          resolve({ success: false, message: "Invalid email address" });
          return;
        }
        if (password.length < 6) {
          resolve({ success: false, message: "Password must be at least 6 characters" });
          return;
        }

        // Simulate successful login token
        const mockToken = "eyJhGciOiJIUzI1Ni...";
        localStorage.setItem('desimart_token', mockToken);

        const newUser: User = {
          id: "u123",
          name: email.split('@')[0],
          email,
          role,
          phone: "+91 9876543210",
          savedAddresses: [
            {
              id: 'addr1',
              fullName: 'Amit Kumar',
              street: '123 MG Road, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              zip: '560038',
              phone: '9876543210',
              type: 'Home'
            }
          ]
        };
        setUser(newUser);
        resolve({ success: true });
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('desimart_token');
    localStorage.removeItem('desimart_user');
    localStorage.removeItem('desimart_cart');
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): string => {
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      status: 'Pending',
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]); // Clear cart after order
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const reorder = (items: CartItem[]) => {
    setCart(prev => {
        const newCart = [...prev];
        items.forEach(newItem => {
            const existingIndex = newCart.findIndex(p => p.id === newItem.id);
            if (existingIndex > -1) {
                newCart[existingIndex] = { 
                    ...newCart[existingIndex], 
                    quantity: newCart[existingIndex].quantity + newItem.quantity 
                };
            } else {
                newCart.push({ ...newItem });
            }
        });
        return newCart;
    });
  };

  const addAd = (adData: Omit<SponsorAd, 'id'>) => {
    const newAd: SponsorAd = {
      ...adData,
      id: `ad-${Date.now()}`
    };
    setAds(prev => [...prev, newAd]);
  };

  const updateAd = (id: string, adData: Omit<SponsorAd, 'id'>) => {
    setAds(prev => prev.map(ad => ad.id === id ? { ...adData, id } : ad));
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
  };

  const reorderAds = (newAds: SponsorAd[]) => {
    setAds(newAds);
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      savedItems,
      user,
      orders,
      reviews,
      ads,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      toggleWishlist,
      moveToCart,
      removeFromSaved,
      addReview,
      login,
      logout,
      placeOrder,
      updateOrderStatus,
      reorder,
      addAd,
      updateAd,
      deleteAd,
      reorderAds,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};