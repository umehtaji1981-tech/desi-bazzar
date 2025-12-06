import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Truck, Users, IndianRupee } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { products, orders } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
       
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Products</div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
         </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <Truck size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Active Orders</div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
         </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <IndianRupee size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Users</div>
              <div className="text-2xl font-bold">1,240</div>
            </div>
         </div>
       </div>

       {/* Recent Orders Table */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
             <button className="text-blue-600 text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-600">
               <thead className="bg-gray-50 text-gray-700 font-medium">
                 <tr>
                   <th className="p-4">Order ID</th>
                   <th className="p-4">Customer</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Amount</th>
                   <th className="p-4">Date</th>
                 </tr>
               </thead>
               <tbody>
                 {orders.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-400">No orders yet. Place an order to see it here.</td></tr>
                 ) : orders.map(order => (
                   <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                     <td className="p-4 font-medium">{order.id}</td>
                     <td className="p-4">{order.shippingAddress.fullName}</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                     </td>
                     <td className="p-4 font-bold">₹{order.totalAmount}</td>
                     <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
