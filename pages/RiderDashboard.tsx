import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Navigation } from 'lucide-react';

const RiderDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [isOnline, setIsOnline] = useState(true);

  // Mock: Filter orders that are pending or out for delivery, pretending they are assigned to this rider
  const myOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
             <span className="font-bold text-gray-800">{isOnline ? "You are Online" : "You are Offline"}</span>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-lg font-medium text-sm text-white ${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
             {isOnline ? "Go Offline" : "Go Online"}
          </button>
       </div>

       <h2 className="font-bold text-lg text-gray-800">Assigned Deliveries ({myOrders.length})</h2>

       {myOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
             No active deliveries at the moment.
          </div>
       ) : (
         <div className="space-y-4">
           {myOrders.map(order => (
             <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4 border-b pb-3">
                   <div>
                      <span className="text-xs text-gray-500 block mb-1">Order ID: {order.id}</span>
                      <h3 className="font-bold text-gray-900">₹{order.totalAmount} • {order.paymentMethod}</h3>
                   </div>
                   <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">{order.status}</span>
                </div>
                
                <div className="space-y-3 mb-6">
                   <div className="flex gap-3">
                      <MapPin size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                         <div className="font-semibold text-gray-800">Pickup: Sharma Kirana Store</div>
                         <div className="text-sm text-gray-500">Shop No 4, Main Market</div>
                      </div>
                   </div>
                   <div className="w-0.5 h-4 bg-gray-200 ml-2.5"></div>
                   <div className="flex gap-3">
                      <Navigation size={20} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                         <div className="font-semibold text-gray-800">Drop: {order.shippingAddress.fullName}</div>
                         <div className="text-sm text-gray-500">{order.shippingAddress.street}, {order.shippingAddress.city}</div>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3">
                   <a href={`tel:${order.shippingAddress.phone}`} className="flex-1 border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-gray-50">
                      <Phone size={18} /> Call Customer
                   </a>
                   {order.status !== 'Delivered' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        className="flex-1 bg-green-600 text-white rounded-lg py-2 font-medium hover:bg-green-700"
                      >
                         Mark Delivered
                      </button>
                   )}
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default RiderDashboard;
