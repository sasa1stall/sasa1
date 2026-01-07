import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

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
