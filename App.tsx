import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header, Footer, AdminLayout } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import RiderDashboard from './pages/RiderDashboard';
import Profile from './pages/Profile';
import AdminAds from './pages/AdminAds';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
          <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Authenticated Routes */}
          <Route path="/profile" element={
             <ProtectedRoute roles={['customer', 'admin', 'rider']}>
               <MainLayout><Profile /></MainLayout>
             </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute roles={['customer', 'admin', 'rider']}>
              <MainLayout><Checkout /></MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/order-confirmation/:id" element={
            <ProtectedRoute roles={['customer', 'admin', 'rider']}>
              <MainLayout><OrderConfirmation /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/ads" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout><AdminAds /></AdminLayout>
            </ProtectedRoute>
          } />
          {/* Placeholder for other admin routes if needed later */}
          <Route path="/admin/products" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout><div className="p-4">Products Management (Coming Soon)</div></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout><div className="p-4">Orders Management (Coming Soon)</div></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Rider Routes */}
           <Route path="/rider" element={
            <ProtectedRoute roles={['rider', 'admin']}>
              <div className="flex flex-col min-h-screen bg-gray-50">
                  <header className="bg-green-700 text-white p-4 flex justify-between items-center shadow-lg">
                      <h1 className="font-bold text-xl">DesiMart Delivery Partner</h1>
                      <div className="text-sm">Active</div>
                  </header>
                  <main className="flex-1 p-4">
                      <RiderDashboard />
                  </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;