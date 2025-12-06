import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin' | 'rider'>('customer');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password, role);
      if (result.success) {
        if (role === 'admin') navigate('/admin');
        else if (role === 'rider') navigate('/rider');
        else navigate('/');
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-600 mb-2 text-center">DesiMart</h2>
        <p className="text-gray-500 text-center mb-8">Login to your account</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <div className="relative">
               <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-xs text-orange-600 hover:underline">Forgot Password?</Link>
            </div>
          </div>

          <div className="pt-2">
             <label className="block text-sm font-medium text-gray-700 mb-2">Login As:</label>
             <div className="grid grid-cols-3 gap-2">
                <button 
                  type="button" 
                  onClick={() => setRole('customer')}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${role === 'customer' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >Customer</button>
                 <button 
                  type="button" 
                  onClick={() => setRole('rider')}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${role === 'rider' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >Rider</button>
                 <button 
                  type="button" 
                  onClick={() => setRole('admin')}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${role === 'admin' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >Admin</button>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <span className="text-orange-600 font-bold cursor-pointer hover:underline">Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;