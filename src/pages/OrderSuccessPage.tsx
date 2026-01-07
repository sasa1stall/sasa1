import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { clsx } from 'clsx';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center dark:text-white">Order not found</div>;

  const steps = [
    { status: 'Pending', icon: Package, label: 'Order Placed' },
    { status: 'Cutting', icon: CheckCircle, label: 'Cutting' }, // Using CheckCircle generically or maybe Knife icon if available? Lucide might not have Knife.
    { status: 'Out for Delivery', icon: Truck, label: 'Out for Delivery' },
    { status: 'Delivered', icon: Home, label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-dark-border text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Thank you for your purchase. Your order ID is <span className="font-mono font-semibold text-gray-900 dark:text-gray-200">{order._id}</span></p>

        {/* Status Tracker */}
        <div className="mb-12">
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary-600 -z-10 transition-all duration-1000"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, index) => {
               const Icon = step.icon;
               const isCompleted = index <= currentStepIndex;

               return (
                 <div key={step.label} className="flex flex-col items-center bg-white dark:bg-dark-card px-2">
                   <div 
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                      isCompleted 
                        ? "bg-primary-600 border-primary-600 text-white" 
                        : "bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-gray-400"
                    )}
                   >
                     <Icon className="w-5 h-5" />
                   </div>
                   <span className={clsx(
                     "text-xs mt-2 font-medium transition-colors duration-300",
                     isCompleted ? "text-primary-600" : "text-gray-400"
                   )}>{step.label}</span>
                 </div>
               );
            })}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-left mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Delivery Details</h3>
          <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.fullName}</p>
          <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.address}</p>
          <p className="text-gray-600 dark:text-gray-300 font-medium mt-2">Payment Method: {order.paymentMethod}</p>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Total Amount: ₹{order.totalPrice}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Continue Shopping
          </Link>
          <Link to="/my-orders" className="inline-block bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
