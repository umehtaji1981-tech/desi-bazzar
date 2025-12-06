import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';
import { Filter, Star, ShoppingCart, X } from 'lucide-react';
import { ProductCard, QuickViewModal } from '../components/ProductCard';
import { Product } from '../types';

const Shop: React.FC = () => {
  const { products, searchQuery, addToCart } = useStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCat = searchParams.get('cat');

  // UI State for filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localCategory, setLocalCategory] = useState<string | null>(initialCat);
  const [localPrice, setLocalPrice] = useState<number>(5000);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Applied state for actual filtering
  const [appliedCategory, setAppliedCategory] = useState<string | null>(initialCat);
  const [appliedPrice, setAppliedPrice] = useState<number>(5000);

  useEffect(() => {
    setLocalCategory(initialCat);
    setAppliedCategory(initialCat);
  }, [initialCat]);

  const handleApplyFilters = () => {
      setAppliedCategory(localCategory);
      setAppliedPrice(localPrice);
      setIsFilterOpen(false); // Close mobile drawer on apply
  };

  const handleClearFilters = () => {
      setLocalCategory(null);
      setLocalPrice(5000);
      setAppliedCategory(null);
      setAppliedPrice(5000);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = appliedCategory ? p.category === appliedCategory : true;
    
    // Enhanced search logic: Name, Description, Shop Name, ID
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q) ||
        p.id.toLowerCase() === q;

    const matchesPrice = p.price <= appliedPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 shadow-sm"
      >
          <Filter size={18} /> Filters
      </button>

      {/* Sidebar Filters */}
      <aside className={`fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-64 md:p-0 md:bg-transparent md:block md:z-0 overflow-y-auto ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="md:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
        </div>

        <div className="bg-white md:p-6 md:rounded-lg md:shadow-sm md:border md:border-gray-100">
           <div className="hidden md:flex items-center gap-2 font-bold text-lg mb-4 text-gray-800">
             <Filter size={20}/> Filters
           </div>
           
           <div className="mb-6">
             <h3 className="font-medium mb-3 text-gray-700">Categories</h3>
             <ul className="space-y-2">
               <li>
                 <button 
                    onClick={() => setLocalCategory(null)}
                    className={`text-sm ${!localCategory ? 'text-orange-600 font-bold' : 'text-gray-600 hover:text-orange-600'}`}
                 >
                   All Products
                 </button>
               </li>
               {CATEGORIES.map(cat => (
                 <li key={cat}>
                    <button 
                      onClick={() => setLocalCategory(cat)}
                      className={`text-sm text-left ${localCategory === cat ? 'text-orange-600 font-bold' : 'text-gray-600 hover:text-orange-600'}`}
                    >
                      {cat}
                    </button>
                 </li>
               ))}
             </ul>
           </div>

           <div className="mb-6">
             <h3 className="font-medium mb-3 text-gray-700">Max Price: ₹{localPrice}</h3>
             <input 
               type="range" 
               min="0" 
               max="5000" 
               value={localPrice} 
               onChange={(e) => setLocalPrice(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
             />
             <div className="flex justify-between text-xs text-gray-500 mt-2">
               <span>₹0</span>
               <span>₹5000+</span>
             </div>
           </div>

           <div className="flex flex-col gap-2">
               <button 
                onClick={handleApplyFilters}
                className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-700"
               >
                   Apply Filters
               </button>
               <button 
                onClick={handleClearFilters}
                className="w-full text-gray-500 py-2 rounded-lg font-medium text-sm hover:bg-gray-100"
               >
                   Clear All
               </button>
           </div>
        </div>
      </aside>

      {/* Overlay for mobile filter */}
      {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}></div>
      )}

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-gray-800">
             {appliedCategory ? appliedCategory : 'All Products'} 
             <span className="text-base font-normal text-gray-500 ml-2">({filteredProducts.length} items)</span>
           </h1>
           {/* Simple sort mock */}
           <select className="border-gray-300 rounded-md text-sm border p-2 focus:ring-orange-500 focus:border-orange-500">
             <option>Sort by: Recommended</option>
             <option>Price: Low to High</option>
             <option>Price: High to Low</option>
           </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
             <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
             <button onClick={handleClearFilters} className="mt-4 text-orange-600 hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setViewingProduct}
              />
            ))}
          </div>
        )}
      </div>

      {viewingProduct && (
        <QuickViewModal 
            product={viewingProduct} 
            onClose={() => setViewingProduct(null)} 
        />
      )}
    </div>
  );
};

export default Shop;