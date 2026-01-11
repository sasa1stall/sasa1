import React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
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
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-dark-card shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Your Cart
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-600 font-medium hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.product._id}-${item.selectedVariant.weight}`}
                className="flex space-x-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg"
              >
                <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.selectedVariant.weight}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
                      <button
                        onClick={() =>
                          addToCart(item.product, item.selectedVariant, -1)
                        }
                        disabled={item.qty <= 1}
                        className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-6 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          addToCart(item.product, item.selectedVariant, 1)
                        }
                        className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-primary-600">
                      ₹{item.selectedVariant.price * item.qty}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    removeFromCart(
                      item.product._id,
                      item.selectedVariant.weight
                    )
                  }
                  className="text-gray-400 hover:text-red-500 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-400">
                Total Amount
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ₹{totalPrice}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform duration-150"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
