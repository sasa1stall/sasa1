import React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { useAuth } from "../hooks/useAuth";

interface CartSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { cartItems, removeFromCart, addToCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 w-full sm:w-[480px] bg-gradient-to-b from-white to-gray-50 dark:from-dark-bg dark:to-dark-card shadow-2xl z-50 transform transition-all duration-500 ease-out flex flex-col border-l-4 border-primary-600",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  Your Cart
                </h2>
                <p className="text-sm text-white/80 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:rotate-90 active:scale-90"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <ShoppingBag className="w-32 h-32 text-gray-300 dark:text-gray-700" />
                <Sparkles className="w-10 h-10 text-primary-600 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Your cart is empty
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add some delicious products to get started!
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-primary">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemQty = item.qty || 1;
                return (
                  <div
                    key={`${item.product._id}-${item.selectedVariant.weight}`}
                    className="bg-white dark:bg-dark-card p-5 rounded-2xl flex items-center space-x-4 border-2 border-gray-100 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 shadow-md hover:shadow-xl group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg">
                        {item.selectedVariant.weight}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        ₹{item.selectedVariant.price} × {itemQty}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-inner">
                          <button
                            onClick={() =>
                              addToCart(item.product, item.selectedVariant, -1)
                            }
                            disabled={itemQty <= 1}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-l-xl transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </button>
                          <span className="px-3 font-black text-base text-gray-900 dark:text-white min-w-[36px] text-center">
                            {itemQty}
                          </span>
                          <button
                            onClick={() =>
                              addToCart(item.product, item.selectedVariant, 1)
                            }
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-r-xl transition-all active:scale-90"
                          >
                            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product._id,
                              item.selectedVariant.weight
                            )
                          }
                          className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        ₹{item.selectedVariant.price * itemQty}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t-4 border-gray-200 dark:border-dark-border p-6 space-y-5 bg-white dark:bg-dark-card shadow-2xl">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-base">
                <span className="font-semibold text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ₹{totalPrice}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Taxes & fees</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-gray-200 dark:border-dark-border flex justify-between items-center">
              <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide">
                Total
              </span>
              <span className="text-3xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                ₹{totalPrice}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary text-xl py-5 shadow-2xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Proceed to Checkout
                <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
