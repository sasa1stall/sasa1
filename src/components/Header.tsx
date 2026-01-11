import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const Header = ({
  setIsCartOpen,
}: {
  setIsCartOpen: (open: boolean) => void;
}) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b-2 border-gray-100 dark:border-dark-border shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group relative">
              <div className="text-3xl font-black tracking-tight uppercase">
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  SAS A1
                </span>
                <span className="text-gray-900 dark:text-white ml-2">
                  Beef Stall
                </span>
              </div>
              <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 transition-all font-bold px-4 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/my-orders"
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 transition-all font-bold px-4 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
              >
                My Orders
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 transition-all font-bold px-4 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 rounded-2xl transition-all duration-300 hover:scale-110 group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 text-xs font-black leading-none text-white transform bg-gradient-to-r from-accent-600 to-red-600 rounded-full animate-bounce-slow shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 p-3 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 rounded-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <UserIcon className="w-6 h-6 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-2xl py-2 ring-2 ring-gray-100 dark:ring-dark-border transition-all duration-200 z-50 border-2 border-gray-100 dark:border-dark-border">
                    <div className="px-4 py-3 border-b-2 border-gray-100 dark:border-dark-border bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Welcome back
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-1">
                        {user.name}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                    >
                      ⚙️ Settings
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                    >
                      📦 My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-6 py-2.5">
                Login
              </Link>
            )}

            <div className="md:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-b-2 border-gray-100 dark:border-dark-border shadow-lg">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 transition-all"
            >
              🏠 Home
            </Link>
            {user && (
              <Link
                to="/my-orders"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 transition-all"
              >
                📦 My Orders
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 transition-all"
              >
                ⚡ Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
