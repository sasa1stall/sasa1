import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Layout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { loading } = useAuth();

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text font-sans">
      <Header setIsCartOpen={setIsCartOpen} />
      <CartSidebar isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

