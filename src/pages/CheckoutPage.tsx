import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Pencil, AlertTriangle } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.mobile || '',
    address: '',
    city: '',
    pincode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.mobile || prev.phone
      }));
      
      if (!user.mobile) {
        setIsPhoneEditable(true);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          weight: item.selectedVariant.weight,
          qty: item.qty,
          price: item.selectedVariant.price,
          selectedVariant: item.selectedVariant, // Include full variant for stock checking
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        },
        paymentMethod: 'COD',
        totalPrice: totalPrice,
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error: any) {
      console.error('Order failed', error);
      // Show specific error message from backend if available
      const errorMessage = error?.response?.data?.message || 'Order failed to place. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <p className="text-xl text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
        
        {/* Delivery Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                     <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-200">
                        Order will be delivered only within the Chennai region ⚠️
                    </p>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="relative mt-1">
                    <input
                      type="tel"
                      name="phone"
                      required
                      readOnly={!isPhoneEditable}
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 
                        ${!isPhoneEditable 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-75' 
                          : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                    />
                    {!isPhoneEditable && (
                        <button 
                             type="button"
                             onClick={() => setIsPhoneEditable(true)}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors p-1"
                             title="Edit Phone Number"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 bg-gray-50"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                   <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 bg-gray-50"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
                   <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 bg-gray-50"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : `Place Order - ₹${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border h-fit">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={`${item.product._id}-${item.selectedVariant.weight}`} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">{item.selectedVariant.weight} x {item.qty}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{item.selectedVariant.price * item.qty}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Delivery</span>
                <span className="text-green-500">Free</span>
              </div>
               <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
