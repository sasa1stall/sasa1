import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
        const register = await navigator.serviceWorker.ready;
        
        // 1. Request Permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Permission denied');
            return;
        }

        // 2. Subscribe
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
             console.error('VAPID Key missing');
             return;
        }

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // 3. Send to Backend
        await api.post('/notifications/subscribe', { subscription });
        alert('Notifications Enabled! 🔔');

    } catch (error) {
        console.error('Error subscribing to push:', error);
        alert('Failed to enable notifications.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <button 
                onClick={subscribeToPush}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
            >
                Enable Order Alerts 🔔
            </button>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={clsx(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              activeTab === 'orders' ? "bg-primary-600 text-white" : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100"
            )}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={clsx(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              activeTab === 'inventory' ? "bg-primary-600 text-white" : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100"
            )}
          >
            Inventory
          </button>
        </div>

        {activeTab === 'orders' ? <OrdersManager /> : <InventoryManager /> }
      </div>
    </div>
  );
};

// Helper for VAPID Key conversion
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-12 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase font-semibold text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-mono">{order._id.substring(0, 8)}...</td>
                  <td className="px-6 py-4">{order.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      order.status === 'Pending' && "bg-yellow-100 text-yellow-800",
                      order.status === 'Cutting' && "bg-blue-100 text-blue-800",
                      order.status === 'Out for Delivery' && "bg-purple-100 text-purple-800",
                      order.status === 'Delivered' && "bg-green-100 text-green-800",
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                       value={order.status}
                       onChange={(e) => updateStatus(order._id, e.target.value)}
                       className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm p-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Out for Delivery">Outing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryManager = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
    
    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', category: 'Chicken', image: '', isBestSeller: false
    });
    const [variants, setVariants] = useState<{weight: string, price: string, stock: string}[]>([{weight: '', price: '', stock: ''}]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
         setLoading(true);
         try {
           const { data } = await api.get('/products');
           setProducts(data);
         } catch (error) {
           console.error(error);
         } finally {
           setLoading(false);
         }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', category: 'Chicken', image: '', isBestSeller: false });
        setVariants([{weight: '', price: '', stock: ''}]);
        setImageInputType('url');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB for base64 storage)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData({...formData, image: base64String});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert variant price and stock to numbers before sending
            const processedVariants = variants.map(v => ({
                weight: v.weight,
                price: Number(v.price) || 0,
                stock: Number(v.stock) || 0
            }));
            await api.post('/products', { ...formData, variants: processedVariants });
            setIsFormOpen(false);
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const addVariant = () => {
        setVariants([...variants, { weight: '', price: '', stock: ''}]);
    };
    
    const updateVariant = (index: number, field: string, value: string) => {
        const newVariants = [...variants];
        (newVariants[index] as any)[field] = value;
        setVariants(newVariants);
    };

    const removeVariant = (index: number) => {
         const newVariants = variants.filter((_, i) => i !== index);
         setVariants(newVariants);
    };

    const deleteProduct = async (id: string) => {
        if(confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-12 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button onClick={() => setIsFormOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors">
                    <Plus className="w-5 h-5 mr-2" /> Add Product
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg mb-8 border border-gray-100 dark:border-dark-border">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Add New Product</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Name" className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <select className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option>Chicken</option><option>Mutton</option><option>Seafood</option><option>Beef</option>
                            </select>
                        </div>
                        <textarea placeholder="Description" className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                        
                        {/* Image Input Section */}
                        <div className="space-y-2">
                            <label className="font-semibold dark:text-white">Product Image</label>
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="imageType" 
                                        checked={imageInputType === 'url'} 
                                        onChange={() => { setImageInputType('url'); setFormData({...formData, image: ''}); }}
                                        className="text-primary-600"
                                    />
                                    <span className="dark:text-white text-sm">Image URL</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="imageType" 
                                        checked={imageInputType === 'upload'} 
                                        onChange={() => { setImageInputType('upload'); setFormData({...formData, image: ''}); }}
                                        className="text-primary-600"
                                    />
                                    <span className="dark:text-white text-sm">Upload Image</span>
                                </label>
                            </div>
                            
                            {imageInputType === 'url' ? (
                                <input 
                                    placeholder="Image URL" 
                                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600" 
                                    value={formData.image} 
                                    onChange={e => setFormData({...formData, image: e.target.value})} 
                                    required 
                                />
                            ) : (
                                <div className="space-y-2">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageUpload}
                                        className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                                        required={!formData.image}
                                    />
                                    {formData.image && (
                                        <div className="flex items-center gap-2">
                                            <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                            <span className="text-green-600 text-sm">✓ Image uploaded</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="font-semibold dark:text-white">Variants</label>
                            {variants.map((v, i) => (
                                <div key={i} className="flex gap-2">
                                    <input placeholder="Weight (e.g. 1kg)" className="p-2 border rounded flex-1 dark:bg-gray-800 dark:text-white dark:border-gray-600" value={v.weight} onChange={e => updateVariant(i, 'weight', e.target.value)} required />
                                    <input type="number" placeholder="Price" min="0" className="p-2 border rounded w-24 dark:bg-gray-800 dark:text-white dark:border-gray-600" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} required />
                                    <input type="number" placeholder="Stock" min="0" className="p-2 border rounded w-24 dark:bg-gray-800 dark:text-white dark:border-gray-600" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} required />
                                    <button type="button" onClick={() => removeVariant(i)} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                                </div>
                            ))}
                            <button type="button" onClick={addVariant} className="text-primary-600 text-sm font-medium">+ Add Variant</button>
                        </div>

                         <div className="flex items-center gap-2">
                             <input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} />
                             <label className="dark:text-white">Best Seller</label>
                         </div>

                        <div className="flex justify-end gap-2">
                             <button type="button" onClick={() => { setIsFormOpen(false); resetForm(); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded">Cancel</button>
                             <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Save Product</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border flex space-x-4">
                        <img src={product.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                            <h4 className="font-bold dark:text-white">{product.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{product.variants.length} Variants</p>
                             <button onClick={() => deleteProduct(product._id)} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                                 <Trash2 className="w-4 h-4 mr-1"/> Delete
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
