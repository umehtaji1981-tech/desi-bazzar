import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call for password reset
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <Link to="/login" className="flex items-center text-gray-500 text-sm mb-6 hover:text-orange-600">
          <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        
        {!isSubmitted ? (
          <>
            <p className="text-gray-500 mb-8 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-600 text-sm mb-6">We have sent a password reset link to <strong>{email}</strong>.</p>
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="text-orange-600 font-bold hover:underline text-sm"
            >
              Resend Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;