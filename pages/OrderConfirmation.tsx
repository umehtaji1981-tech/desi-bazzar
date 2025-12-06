import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, ShoppingBag, ArrowRight, Home, Calendar, CreditCard } from 'lucide-react';
import { Order } from '../types';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    setOrder(foundOrder);
  }, [id, orders]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Loading order details...</p>
        <Link to="/" className="text-orange-600 underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-green-50 p-8 text-center border-b border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for shopping with DesiMart. Your order has been placed successfully.</p>
          <div className="mt-4 font-mono bg-white inline-block px-4 py-1 rounded border border-gray-200 text-gray-700">
            Order ID: {order.id}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-4">Delivery Details</h3>
              <div className="flex gap-3 mb-2">
                <Home size={20} className="text-gray-400 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">{order.shippingAddress.fullName}</div>
                  <div className="text-gray-600 text-sm">
                    {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                    {order.shippingAddress.state} - {order.shippingAddress.zip}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">Ph: {order.shippingAddress.phone}</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-4">Payment & Schedule</h3>
              <div className="space-y-3">
                 <div className="flex gap-3">
                    <CreditCard size={20} className="text-gray-400" />
                    <span className="text-gray-700 text-sm">Payment Method: <strong>{order.paymentMethod}</strong></span>
                 </div>
                 <div className="flex gap-3">
                    <Calendar size={20} className="text-gray-400" />
                    <span className="text-gray-700 text-sm">Estimated Delivery: <strong>Tomorrow</strong></span>
                 </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
             <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-4">Order Summary</h3>
             <div className="space-y-4">
               {order.items.map((item, idx) => (
                 <div key={idx} className="flex gap-4 items-center">
                   <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-gray-50" />
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                     <div className="text-xs text-gray-500">{item.shopName}</div>
                   </div>
                   <div className="text-right">
                     <div className="font-medium text-gray-900">₹{item.price}</div>
                     <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                   </div>
                 </div>
               ))}
             </div>
             <div className="border-t border-gray-100 mt-6 pt-4 flex justify-between items-center">
               <span className="font-bold text-gray-800">Total Amount Paid</span>
               <span className="font-bold text-xl text-orange-600">₹{order.totalAmount}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/cart" className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          <ShoppingBag size={20} /> Back to Cart
        </Link>
        <Link to="/" className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-md">
          Continue Shopping <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;