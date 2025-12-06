import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Store, Heart, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, saveForLater, savedItems, moveToCart, removeFromSaved } = useStore();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const finalTotal = totalAmount + deliveryFee;

  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6 bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart size={40} className="text-orange-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cart.length} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-8">
          {cart.length > 0 ? (
             <div className="space-y-4">
               {cart.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center shadow-sm">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-1 text-lg">{item.name}</h3>
                    <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <Store size={14} /> Sold by: <span className="font-medium text-gray-700">{item.shopName}</span>
                    </div>
                    <div className="font-bold text-gray-900 text-lg">₹{item.price}</div>
                    
                    <div className="mt-2 md:hidden flex items-center gap-4">
                       <button onClick={() => saveForLater(item)} className="text-sm font-medium text-gray-500 hover:text-orange-600">Save for Later</button>
                       <button onClick={() => removeFromCart(item.id)} className="text-sm font-medium text-red-500">Remove</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                         <button 
                            onClick={() => saveForLater(item)}
                            className="text-xs font-bold text-gray-500 uppercase hover:text-orange-600"
                        >
                            Save for Later
                        </button>
                        <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Item"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
             </div>
          ) : (
             <div className="p-8 bg-gray-50 rounded-xl text-center border border-dashed border-gray-300">
                 <p className="text-gray-500">Your cart is empty.</p>
             </div>
          )}

          {/* Saved For Later Section */}
          {savedItems.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart size={20} className="text-gray-400" /> Saved For Later ({savedItems.length})</h2>
               <div className="space-y-4">
                   {savedItems.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-700 line-clamp-1">{item.name}</h3>
                                <div className="text-sm font-bold text-gray-900">₹{item.price}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => moveToCart(item)}
                                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-100 flex items-center gap-1"
                                >
                                    <ShoppingBag size={14} /> Move to Cart
                                </button>
                                <button 
                                    onClick={() => removeFromSaved(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                    title="Remove"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                   ))}
               </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
            <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Taxes (GST included)</span>
                    <span>₹0</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                </div>
                </div>
                <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                >
                Proceed to Checkout <ArrowRight size={20} />
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                Safe and Secure Payments. 100% Authentic Products.
                </p>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Cart;