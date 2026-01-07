import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'Chicken', 'Mutton', 'Seafood', 'Eggs'];

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = activeCategory === 'All' ? '/products' : `/products?category=${activeCategory}`;
      const { data } = await api.get(endpoint);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="relative bg-dark-bg h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Premium <span className="text-primary-600">Fresh Cuts</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light max-w-2xl mx-auto">
            Farm-fresh meat delivered straight to your kitchen. Halal, hygienic, and hand-picked for quality.
          </p>
          <button onClick={() => {
            document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
          }} className="bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-primary-600/50">
            Order Now
          </button>
        </div>
      </div>

      <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-0">
             Fresh Arrivals
           </h2>

           {/* Category Tabs */}
           <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
             {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={clsx(
                    "px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                    activeCategory === cat 
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" 
                      : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {cat}
                </button>
             ))}
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
