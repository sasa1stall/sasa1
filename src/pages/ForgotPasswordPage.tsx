import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('reset');
      setSuccessMessage('OTP sent to your email. Please check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccessMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-100 dark:border-dark-border">
        {step === 'request' ? (
          <div>
            <div className="text-center">
               <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
              {error && <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{error}</div>}
              {successMessage && <div className="text-green-500 text-center text-sm bg-green-50 p-2 rounded">{successMessage}</div>}
              
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Send OTP'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
             <div className="text-center">
               <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter the OTP sent to {email} and your new password.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              {error && <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{error}</div>}
              {successMessage && <div className="text-green-500 text-center text-sm bg-green-50 p-2 rounded">{successMessage}</div>}

              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="sr-only">OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div>
                   <label htmlFor="newPassword" className="sr-only">New Password</label>
                   <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="New Password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                 <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-4 text-center">
            <Link to="/login" className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500">
               <ArrowLeft className="w-4 h-4 mr-1"/> Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
