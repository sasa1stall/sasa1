import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { clsx } from 'clsx';

const Header = ({ setIsCartOpen }: { setIsCartOpen: (open: boolean) => void }) => {
  const { user,logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tighter uppercase relative">
              <span className="text-gray-900 dark:text-white">SAS A1</span> Beef Stall
              <div className="absolute -bottom-1 w-full h-1 bg-primary-600 rounded-full"></div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors font-medium">Home</Link>
            {user && (
              <Link to="/my-orders" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors font-medium">My Orders</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors font-medium">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>

            {user ? (
               <div className="relative" ref={profileDropdownRef}>
                 <button 
                   onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                   className="flex items-center space-x-1 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card rounded-full transition-colors"
                 >
                   <UserIcon className="w-6 h-6" />
                 </button>
                 {isProfileDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transition-all duration-200 z-50">
                     <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-dark-border">Hello, {user.name}</span>
                     <Link 
                       to="/settings" 
                       onClick={() => setIsProfileDropdownOpen(false)}
                       className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                     >
                       Settings
                     </Link>
                     <Link 
                       to="/my-orders" 
                       onClick={() => setIsProfileDropdownOpen(false)}
                       className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                     >
                       My Orders
                     </Link>
                     <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                   </div>
                 )}
               </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600">Login</Link>
            )}

            <div className="md:hidden" ref={mobileMenuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
       {/* Mobile Menu */}
      {isMenuOpen && (
         <div className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-dark-card">Home</Link>
            {user && (
              <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-dark-card">My Orders</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-dark-card">Admin</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
