import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, RefreshCw, ShoppingCart, ChevronDown, ChevronUp, Map as MapIcon, Navigation, CheckCircle, Search, Filter } from 'lucide-react';
import { Order, Product } from '../types';

const Profile: React.FC = () => {
  const { user, orders, logout, products, addToCart, reorder } = useStore();
  const navigate = useNavigate();

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Modal State
  const [trackOrderId, setTrackOrderId] = useState<string | null>(null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // --- Buy Again Logic ---
  const buyAgainProducts = useMemo(() => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const productMap = new Map<string, Product>();
      
      userOrders.forEach(order => {
          order.items.forEach(item => {
              // Find current product state to check stock
              const currentProduct = products.find(p => p.id === item.id);
              if (currentProduct && currentProduct.stock > 0 && !productMap.has(item.id)) {
                  productMap.set(item.id, currentProduct);
              }
          });
      });
      return Array.from(productMap.values());
  }, [orders, user.id, products]);

  // --- Filter Logic ---
  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => o.userId === user.id);

    if (filterStatus !== 'All') {
        result = result.filter(o => o.status === filterStatus);
    }

    if (filterDate !== 'All') {
        const now = new Date();
        if (filterDate === 'Last 30 Days') {
            const date30DaysAgo = new Date();
            date30DaysAgo.setDate(now.getDate() - 30);
            result = result.filter(o => new Date(o.date) >= date30DaysAgo);
        } else if (filterDate === 'Last 6 Months') {
            const date6MonthsAgo = new Date();
            date6MonthsAgo.setMonth(now.getMonth() - 6);
            result = result.filter(o => new Date(o.date) >= date6MonthsAgo);
        } else if (filterDate === '2023') {
             result = result.filter(o => new Date(o.date).getFullYear() === 2023);
        }
    }

    return result;
  }, [orders, user.id, filterStatus, filterDate]);

  const toggleExpand = (orderId: string) => {
      setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const handleReorder = (order: Order) => {
      reorder(order.items);
      navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: User Info & Buy Again */}
            <div className="md:col-span-1 space-y-8">
                {/* User Info Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                    <div className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-600 uppercase mb-6">
                        {user.role}
                    </div>

                    <div className="border-t border-gray-100 pt-6 text-left space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-gray-400 mt-1" />
                            <div>
                                <span className="block font-medium text-gray-700">Default Address</span>
                                {user.savedAddresses && user.savedAddresses.length > 0 ? (
                                    <span className="text-sm text-gray-500">
                                        {user.savedAddresses[0].street}, {user.savedAddresses[0].city}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">No address saved</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="w-full mt-8 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                {/* Buy Again Section */}
                {buyAgainProducts.length > 0 && (
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <RefreshCw size={20} className="text-orange-600"/> Buy Again
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {buyAgainProducts.map(product => (
                                <div key={product.id} className="flex gap-3 items-center p-2 hover:bg-gray-50 rounded-lg">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-800 truncate">{product.name}</div>
                                        <div className="text-xs text-gray-500">₹{product.price}</div>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="text-orange-600 bg-orange-50 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors"
                                        title="Add to Cart"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Order History */}
            <div className="md:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Package size={24} className="text-orange-600" /> Order History
                    </h3>
                    
                    {/* Filters */}
                    <div className="flex gap-2">
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white border border-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <select 
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-white border border-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="All">All Time</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                            <option value="Last 6 Months">Last 6 Months</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>
                </div>
                
                {filteredOrders.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                        <p className="text-gray-500 mb-4">No orders found matching your filters.</p>
                        {orders.length === 0 && (
                             <Link to="/shop" className="text-orange-600 font-bold hover:underline">Start Shopping</Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-2">Showing {filteredOrders.length} orders</p>
                        {filteredOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                                {/* Order Summary Header */}
                                <div className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(order.id)}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex gap-4 items-center">
                                             {/* Thumbnail */}
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                {order.items.length > 0 && (
                                                    <img src={order.items[0].image} alt="Product" className="w-full h-full object-cover" />
                                                )}
                                                {order.items.length > 1 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                                        +{order.items.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                                        order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="font-bold text-gray-900 text-lg">₹{order.totalAmount}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs">
                                                    {order.items[0]?.name} {order.items.length > 1 && `& ${order.items.length - 1} more`}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                            {/* Track Order Button Placeholder */}
                                            {order.status === 'Out for Delivery' ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setTrackOrderId(order.id); }}
                                                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                                                >
                                                    Track Order
                                                </button>
                                            ) : (
                                                <button disabled className="hidden sm:block px-4 py-2 text-gray-300 text-sm font-medium cursor-not-allowed">
                                                    Track Order
                                                </button>
                                            )}
                                            {expandedOrderId === order.id ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Expanded Details */}
                                {expandedOrderId === order.id && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6 animate-fadeIn">
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">Items in this Order</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-200" />
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-800">{item.name}</div>
                                                                <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-sm">₹{item.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                                             <div>
                                                 <span className="block font-bold text-gray-700">Shipping Address</span>
                                                 <div className="text-gray-600 mt-1">
                                                     {order.shippingAddress.fullName}<br/>
                                                     {order.shippingAddress.street}, {order.shippingAddress.city}<br/>
                                                     Ph: {order.shippingAddress.phone}
                                                 </div>
                                             </div>
                                             <div>
                                                 <span className="block font-bold text-gray-700">Payment Summary</span>
                                                 <div className="text-gray-600 mt-1 flex justify-between max-w-[200px]">
                                                     <span>Total</span>
                                                     <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                                                 </div>
                                                 <div className="text-gray-600 flex justify-between max-w-[200px]">
                                                     <span>Method</span>
                                                     <span>{order.paymentMethod}</span>
                                                 </div>
                                             </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => handleReorder(order)}
                                                className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
                                            >
                                                <RefreshCw size={16} /> Reorder All Items
                                            </button>
                                            <Link 
                                                to={`/order-confirmation/${order.id}`}
                                                className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                View Invoice
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Tracking Modal */}
        {trackOrderId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2"><MapPin size={20}/> Track Order #{trackOrderId}</h3>
                        <button onClick={() => setTrackOrderId(null)} className="hover:bg-blue-700 p-1 rounded"><LogOut className="rotate-180" size={20}/></button>
                    </div>
                    
                    <div className="relative h-64 bg-gray-100">
                        {/* Mock Map Background */}
                        <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,13,0/600x400?access_token=mock')] bg-cover bg-center flex items-center justify-center text-gray-400 font-bold text-xl">
                            <MapIcon size={48} className="mb-2 opacity-50" />
                        </div>
                        
                        {/* Rider Animation Mock */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
                                <Navigation size={24} className="text-blue-600 fill-blue-600" />
                            </div>
                            <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold mt-2">Rider is 1.2km away</div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                <img src="https://i.pravatar.cc/150?img=33" alt="Rider" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Ramesh Kumar</h4>
                                <p className="text-sm text-gray-500">Your Delivery Partner</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">4.8 ★</span>
                                    <span className="text-xs text-gray-400">Vaccinated</span>
                                </div>
                            </div>
                            <button className="ml-auto bg-green-500 text-white p-2 rounded-full hover:bg-green-600 shadow-lg shadow-green-200">
                                <Search className="rotate-90" size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 relative pl-4 border-l-2 border-gray-100 ml-2">
                             <div className="relative">
                                 <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                                 <h5 className="font-bold text-gray-800 text-sm">Order Picked Up</h5>
                                 <p className="text-xs text-gray-500">10:30 AM, Sharma Kirana Store</p>
                             </div>
                             <div className="relative">
                                 <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white animate-pulse"></div>
                                 <h5 className="font-bold text-blue-600 text-sm">Out for Delivery</h5>
                                 <p className="text-xs text-gray-500">10:45 AM, On the way to your location</p>
                             </div>
                             <div className="relative opacity-50">
                                 <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-gray-300 ring-4 ring-white"></div>
                                 <h5 className="font-bold text-gray-800 text-sm">Arriving Soon</h5>
                                 <p className="text-xs text-gray-500">Estimated 11:00 AM</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;