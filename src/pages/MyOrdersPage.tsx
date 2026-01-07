
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Loader2, Package, ChevronRight, Clock, MapPin, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      // Sort orders by createdAt desc (newest first) if not already sorted by backend
      const sortedOrders = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cutting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-dark-border">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Start shopping to see your orders here.</p>
            <Link to="/" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-sm text-gray-500 dark:text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                       <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", getStatusColor(order.status))}>
                         {order.status}
                       </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <IndianRupee className="w-4 h-4 mr-0.5" />
                      {order.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.orderItems.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                           <div className="relative">
                             <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-800" />
                             <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 dark:bg-gray-700 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-dark-card">
                               {item.qty}
                             </span>
                           </div>
                           <div>
                             <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{item.weight}</p>
                           </div>
                         </div>
                         <div className="flex items-center text-gray-900 dark:text-white font-medium">
                           <IndianRupee className="w-3 h-3" />
                           {item.price * item.qty}
                         </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg w-full sm:w-auto">
                       <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                       <div className="break-all">
                         <p className="font-medium text-gray-900 dark:text-white mb-0.5">Delivery Address</p>
                         <p>{order.shippingAddress.address}</p>
                       </div>
                    </div>
                    
                    {/* View Details Button - Optional, for now just linking to existing success page format if user wants details view, or we can just keep it simple here. 
                        Users often like a dedicated details page, but this list view is quite detailed already. 
                        Actually, let's link back to OrderSuccessPage as a "Order Details" view since it has the tracker.
                    */}
                    <Link to={`/order-success/${order._id}`} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Track Order <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
