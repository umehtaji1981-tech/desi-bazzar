import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { Order } from '../types';

const Checkout: React.FC = () => {
  const { cart, user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddress, setSelectedAddress] = useState(user?.savedAddresses?.[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = totalAmount + (totalAmount > 500 ? 0 : 40);

  const handlePlaceOrder = () => {
    if (!user) return;
    const address = user.savedAddresses?.find(a => a.id === selectedAddress);
    if (!address) return;

    setIsProcessing(true);

    const orderData: Omit<Order, 'id' | 'date' | 'status'> = {
        userId: user.id,
        items: cart,
        totalAmount: finalTotal,
        shippingAddress: address,
        paymentMethod: paymentMethod,
    };
    
    // Simulate processing
    setTimeout(() => {
        const orderId = placeOrder(orderData);
        setIsProcessing(false);
        navigate(`/order-confirmation/${orderId}`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            title="Back to Dashboard"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          
          {/* Step 1: Address */}
          <div className={`bg-white p-6 rounded-xl border ${step === 1 ? 'border-orange-500 shadow-md ring-1 ring-orange-100' : 'border-gray-200'}`}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Select Delivery Address
            </h2>
            {step === 1 && (
              <div className="space-y-4">
                {user?.savedAddresses?.map(addr => (
                  <label key={addr.id} className={`block p-4 border rounded-lg cursor-pointer ${selectedAddress === addr.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id} 
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 accent-orange-600"
                      />
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                            {addr.fullName} <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 uppercase">{addr.type}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</div>
                        <div className="text-sm text-gray-600 mt-1">Phone: {addr.phone}</div>
                      </div>
                    </div>
                  </label>
                ))}
                <button className="text-orange-600 font-medium text-sm flex items-center gap-1 mt-2">+ Add New Address</button>
                <div className="mt-4 text-right">
                   <button onClick={() => setStep(2)} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold">Deliver Here</button>
                </div>
              </div>
            )}
             {step > 1 && (
                 <div className="text-sm text-gray-600 ml-8">
                     {user?.savedAddresses?.find(a => a.id === selectedAddress)?.fullName}, {user?.savedAddresses?.find(a => a.id === selectedAddress)?.zip}
                     <button onClick={()=>setStep(1)} className="text-orange-600 ml-2 font-medium underline">Change</button>
                 </div>
             )}
          </div>

          {/* Step 2: Payment */}
          <div className={`bg-white p-6 rounded-xl border ${step === 2 ? 'border-orange-500 shadow-md ring-1 ring-orange-100' : 'border-gray-200'}`}>
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Payment Method
            </h2>
            {step === 2 && (
                <div className="space-y-4">
                    <label className={`block p-4 border rounded-lg cursor-pointer ${paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-orange-600" />
                            <div className="flex-1">
                                <span className="font-bold text-gray-900">UPI (GPay, PhonePe, Paytm)</span>
                                <div className="text-xs text-gray-500">Pay directly from your bank account</div>
                            </div>
                        </div>
                    </label>
                    <label className={`block p-4 border rounded-lg cursor-pointer ${paymentMethod === 'CARD' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="payment" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="accent-orange-600" />
                            <div className="flex-1 flex items-center gap-2">
                                <span className="font-bold text-gray-900">Credit / Debit Card</span>
                                <CreditCard size={16} className="text-gray-500"/>
                            </div>
                        </div>
                    </label>
                    <label className={`block p-4 border rounded-lg cursor-pointer ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-orange-600" />
                            <div className="flex-1 flex items-center gap-2">
                                <span className="font-bold text-gray-900">Cash on Delivery</span>
                                <Banknote size={16} className="text-gray-500"/>
                            </div>
                        </div>
                    </label>

                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={isProcessing}
                        className={`w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-lg mt-4 hover:bg-orange-700 shadow-lg shadow-orange-200 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-75 cursor-wait' : ''}`}
                    >
                        {isProcessing ? 'Processing...' : `Place Order & Pay ₹${finalTotal}`}
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full text-center text-gray-500 mt-2 text-sm hover:text-orange-600"
                    >
                        Cancel and return to dashboard
                    </button>
                </div>
            )}
          </div>

        </div>

        {/* Sidebar Summary */}
        <div className="md:col-span-1">
           <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-24">
             <h3 className="font-bold text-gray-500 text-sm uppercase mb-4">Price Details</h3>
             <div className="space-y-2 mb-4">
                 <div className="flex justify-between text-gray-700">
                     <span>Price ({cart.length} items)</span>
                     <span>₹{totalAmount}</span>
                 </div>
                 <div className="flex justify-between text-gray-700">
                     <span>Delivery Charges</span>
                     <span className="text-green-600">Free</span>
                 </div>
             </div>
             <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between font-bold text-lg text-gray-900">
                 <span>Total Payable</span>
                 <span>₹{finalTotal}</span>
             </div>
             <div className="bg-green-50 text-green-700 text-xs font-bold p-3 mt-4 rounded border border-green-100">
                 You will save ₹200 on this order
             </div>
             
             <button 
                onClick={() => navigate('/')} 
                className="w-full mt-6 text-red-500 font-medium text-sm hover:underline text-center block"
             >
                Cancel Order
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;