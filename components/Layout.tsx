import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Home, BarChart2, Truck, Gift, Heart, UserCircle, Megaphone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';

export const Header: React.FC = () => {
  const { cart, user, logout, setSearchQuery, products, ads } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{id: string, name: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [currentHeaderAd, setCurrentHeaderAd] = useState(0);

  // Filter ads for the header
  const headerAds = ads.filter(ad => ad.placement === 'header');

  useEffect(() => {
    if (headerAds.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentHeaderAd(prev => (prev + 1) % headerAds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [headerAds.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    setShowSuggestions(false);
    navigate('/shop');
  };

  const handleInputChange = (val: string) => {
      setQuery(val);
      if (val.length > 1) {
          const filtered = products
            .filter(p => p.name.toLowerCase().includes(val.toLowerCase()))
            .slice(0, 5)
            .map(p => ({ id: p.id, name: p.name }));
          setSuggestions(filtered);
          setShowSuggestions(true);
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  };

  const handleSuggestionClick = (id: string) => {
      navigate(`/product/${id}`);
      setSuggestions([]);
      setShowSuggestions(false);
      setQuery("");
  };

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);


  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Dynamic Header Ads */}
      {headerAds.length > 0 && (
          <div className="bg-orange-600 text-white text-xs py-1 px-4 text-center overflow-hidden relative h-6">
              {headerAds.map((ad, idx) => (
                  <div 
                      key={ad.id}
                      className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${idx === currentHeaderAd ? 'translate-y-0' : idx < currentHeaderAd ? '-translate-y-full' : 'translate-y-full'}`}
                  >
                      <Link to={ad.link} className="hover:underline flex items-center gap-2">
                          {ad.title}
                      </Link>
                  </div>
              ))}
          </div>
      )}

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-orange-600 flex-shrink-0">
            <span className="bg-orange-600 text-white p-1 rounded">D</span>esiMart
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full flex">
                <input
                type="text"
                placeholder="Search products, IDs, or shops..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-orange-500"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => query.length > 1 && setShowSuggestions(true)}
                />
                <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-r-md hover:bg-orange-700">
                <Search size={18} />
                </button>
            </form>
            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-b-md mt-1 overflow-hidden z-50">
                    {suggestions.map((s) => (
                        <div 
                            key={s.id} 
                            onClick={() => handleSuggestionClick(s.id)}
                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none"
                        >
                            {s.name}
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="font-medium hover:text-orange-600">Shop</Link>
            
            {user ? (
               <div className="relative group cursor-pointer z-40">
                 <div className="flex items-center gap-1 font-medium hover:text-orange-600">
                   <User size={20} />
                   <span>{user.name}</span>
                 </div>
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-md border border-gray-100 hidden group-hover:block p-2">
                   {user.role === 'admin' && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50 rounded">Dashboard</Link>}
                   {user.role === 'rider' && <Link to="/rider" className="block px-4 py-2 hover:bg-gray-50 rounded">Rider Panel</Link>}
                   <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 rounded">My Profile</Link>
                   <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded text-red-500">Logout</button>
                 </div>
               </div>
            ) : (
              <Link to="/login" className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md font-medium hover:bg-orange-200">
                Login
              </Link>
            )}

            <Link to="/cart" className="relative text-gray-700 hover:text-orange-600">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-8 mt-4 border-t pt-3 text-sm text-gray-600 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
             <Link key={cat} to={`/shop?cat=${cat}`} className="whitespace-nowrap hover:text-orange-600">{cat}</Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 absolute w-full shadow-lg z-50">
           <form onSubmit={handleSearch} className="flex mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border rounded-l-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-orange-600 text-white px-4 rounded-r-md"><Search size={18}/></button>
          </form>
          <div className="flex flex-col gap-4">
             <Link to="/shop" className="font-medium" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
             {user ? (
               <>
                 <Link to="/profile" className="font-medium" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                 {user.role === 'admin' && <Link to="/admin" className="font-medium text-blue-600" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>}
                 {user.role === 'rider' && <Link to="/rider" className="font-medium text-green-600" onClick={() => setIsMenuOpen(false)}>Rider Panel</Link>}
                 <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-500 font-medium">Logout</button>
               </>
             ) : (
                <Link to="/login" className="font-medium text-orange-600" onClick={() => setIsMenuOpen(false)}>Login / Signup</Link>
             )}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white pt-12 pb-6 mt-16">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-orange-500 mb-4">DesiMart</h3>
        <p className="text-gray-400 text-sm">Empowering local shopkeepers and connecting them with customers across India. Delivering happiness, one order at a time.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
          <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          <li><Link to="/login" className="hover:text-white">Login</Link></li>
          <li><Link to="/admin" className="hover:text-white">Sell on DesiMart</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>Help Center</li>
          <li>Email: support@desimart.in</li>
          <li>Phone: +91 1800-123-4567</li>
          <li>Bangalore, India</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-lg">App Coming Soon</h4>
        <div className="flex gap-2">
           <div className="bg-gray-800 p-2 rounded w-32 h-10 flex items-center justify-center text-xs text-gray-400 border border-gray-700">Google Play</div>
           <div className="bg-gray-800 p-2 rounded w-32 h-10 flex items-center justify-center text-xs text-gray-400 border border-gray-700">App Store</div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} DesiMart. All rights reserved. | Terms & Conditions | Privacy Policy
    </div>
  </footer>
);

export const AdminLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-orange-500">DesiMart Admin</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <BarChart2 size={20} /> Overview
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <Truck size={20} /> Orders
          </Link>
           <Link to="/admin/ads" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <Megaphone size={20} /> Sponsor Ads
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={()=>{logout(); navigate('/')}} className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full px-4 py-2">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center md:hidden">
             <span className="font-bold">Admin Panel</span>
             <button onClick={()=>{logout(); navigate('/')}}><LogOut size={20}/></button>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}