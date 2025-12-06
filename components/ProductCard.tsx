import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart, Plus, Minus, X, Zap } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, savedItems } = useStore();
  const [quantity, setQuantity] = useState(1);

  const isSaved = savedItems.some(item => item.id === product.id);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    if (val > product.stock) return;
    setQuantity(val);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, quantity);
    // Optional: Reset quantity or show feedback
  };

  const handleWishlist = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView(product);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      {/* Image Section */}
      <Link to={`/product/${product.id}`} className="relative h-60 bg-gray-100 overflow-hidden block">
        <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm z-10">
            <Star size={12} className="text-yellow-500 fill-yellow-500" /> {product.rating} <span className="text-gray-400 font-normal">({product.reviews})</span>
        </div>

        {/* Quick View & Wishlist Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <button 
                onClick={handleQuickViewClick}
                className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                title="Quick View"
             >
                 <Eye size={20} />
             </button>
             <button 
                onClick={handleWishlist}
                className={`bg-white p-3 rounded-full shadow-lg hover:bg-red-50 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                title="Save for Later"
             >
                 <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
             </button>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-gray-500 mb-1">{product.shopName}</div>
        <Link to={`/product/${product.id}`} className="font-semibold text-gray-800 mb-2 hover:text-orange-600 line-clamp-2" title={product.name}>
            {product.name}
        </Link>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
          <span className="text-xs text-green-600 font-bold bg-green-50 px-1 rounded">
             {Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}% OFF
          </span>
        </div>

        {/* Action Row */}
        <div className="mt-auto flex items-center gap-2">
           {/* Quantity Selector */}
           <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-9">
                <button 
                  onClick={(e) => { e.preventDefault(); handleQuantityChange(quantity - 1); }}
                  className="px-2 h-full hover:bg-gray-200 rounded-l-lg text-gray-600"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-gray-800">{quantity}</span>
                <button 
                  onClick={(e) => { e.preventDefault(); handleQuantityChange(quantity + 1); }}
                  className="px-2 h-full hover:bg-gray-200 rounded-r-lg text-gray-600"
                >
                  <Plus size={14} />
                </button>
           </div>
           
           {/* Add to Cart Button */}
           <button 
             onClick={handleAddToCart}
             className="flex-1 bg-orange-600 text-white h-9 rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors flex items-center justify-center gap-1 shadow-sm"
           >
             <ShoppingCart size={16} /> Add
           </button>
        </div>
      </div>
    </div>
  );
};


interface QuickViewModalProps {
    product: Product;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
    const { addToCart, toggleWishlist, savedItems } = useStore();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const isSaved = savedItems.some(item => item.id === product.id);

    const handleQuantityChange = (val: number) => {
        if (val < 1) return;
        if (val > product.stock) return;
        setQuantity(val);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        onClose();
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl animate-scaleIn flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100">
                    <X size={24} className="text-gray-600" />
                </button>

                {/* Image Side */}
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
                    <img src={product.image} alt={product.name} className="max-h-[300px] object-contain mix-blend-multiply" />
                </div>

                {/* Details Side */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-2">{product.category}</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                            {product.rating} <Star size={10} fill="white" />
                        </span>
                        <span className="text-gray-500 text-sm">{product.reviews} Reviews</span>
                    </div>

                    <div className="flex items-end gap-3 mb-6">
                        <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
                        <div className="text-gray-400 line-through mb-1">₹{product.originalPrice}</div>
                        <div className="text-green-600 font-bold text-sm mb-1 bg-green-50 px-2 py-0.5 rounded">
                            {Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}% OFF
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">{product.description}</p>
                    
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button onClick={() => handleQuantityChange(quantity - 1)} className="p-2 hover:bg-gray-100 rounded-l-lg"><Minus size={18}/></button>
                                <span className="w-10 text-center font-bold">{quantity}</span>
                                <button onClick={() => handleQuantityChange(quantity + 1)} className="p-2 hover:bg-gray-100 rounded-r-lg"><Plus size={18}/></button>
                            </div>
                            <button 
                                onClick={() => toggleWishlist(product)} 
                                className={`flex items-center gap-2 text-sm font-bold ${isSaved ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            >
                                <Heart size={20} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save for Later'}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleAddToCart} className="flex-1 bg-orange-50 text-orange-600 border border-orange-200 py-3 rounded-xl font-bold hover:bg-orange-100 flex items-center justify-center gap-2">
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                                <Zap size={20} fill="currentColor" /> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
