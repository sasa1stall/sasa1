import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // New State for OTP
    const [step, setStep] = useState<'details' | 'otp'>('details'); // New State for Step

    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequestOtp = async () => {
         // Frontend Validation
         if (!name || !email || !mobile || !password) {
            setError('All fields are required');
            setLoading(false);
            return;
         }
         // ... existing regex checks ...
         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
             setError('Invalid email address');
             setLoading(false);
             return;
        }
        if (!/^[6-9]\d{9}$/.test(mobile)) {
             setError('Invalid Indian mobile number (must be 10 digits starting with 6-9)');
             setLoading(false);
             return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
             setError('Password must be 8+ chars, with 1 Uppercase, 1 Lowercase, 1 Number, and 1 Symbol (@$!%*?&)');
             setLoading(false);
             return;
        }

        try {
            await api.post('/auth/signup/request-otp', { name, email, mobile, password });
            setStep('otp');
            setError(''); 
        } catch (err: any) {
             const msg = err.response?.data?.errors 
                ? err.response.data.errors[0].msg 
                : (err.response?.data?.message || 'Failed to send OTP');
            setError(msg);
        }
    };

    const handleVerifySignup = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.post('/auth/signup/verify', { name, email, mobile, password, otp });
            register(data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (step === 'details') {
            await handleRequestOtp();
        } else {
            await handleVerifySignup();
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-100 dark:border-dark-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                     <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Or{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                          sign in to existing account
                        </Link>
                      </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg text-center font-medium">{error}</div>}
                    
                    {step === 'details' ? (
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input type="text" required className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <input type="email" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <input type="text" required maxLength={10} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Mobile Number (+91)" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} />
                            </div>
                            <div>
                                <input type="password" required className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Password (strong)" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                         <div className="rounded-md shadow-sm">
                             <div className="text-center mb-4 text-sm text-gray-600 dark:text-gray-300">
                                 We sent a 6-digit code to <strong>{email}</strong>
                             </div>
                            <div>
                                <input type="text" required maxLength={6} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 text-center text-2xl tracking-widest" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
                            </div>
                        </div>
                    )}

                    <div>
                        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                             {loading ? <Loader2 className="animate-spin w-5 h-5"/> : (step === 'details' ? 'Send Verification Code' : 'Verify & Create Account')}
                        </button>
                        {step === 'otp' && (
                             <button type="button" onClick={() => setStep('details')} className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                 Go Back
                             </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
