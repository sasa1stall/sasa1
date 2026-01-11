import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { clsx } from "clsx";
import { Loader2, Search, Filter, TrendingUp, Star } from "lucide-react";

const CATEGORIES = ["All", "Chicken", "Mutton", "Seafood", "Beef"];

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  variants: Array<{
    weight: string;
    price: number;
    stock: number;
  }>;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        activeCategory === "All"
          ? "/products"
          : `/products?category=${activeCategory}`;
      const { data } = await api.get(endpoint);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-accent-600/20 to-primary-600/20 animate-pulse-slow"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
              Premium Quality
            </span>
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl leading-tight">
            Premium{" "}
            <span className="bg-gradient-to-r from-primary-500 via-orange-400 to-accent-500 bg-clip-text text-transparent animate-pulse-slow">
              Fresh Cuts
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-gray-200 mb-10 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Farm-fresh meat delivered straight to your kitchen.{" "}
            <br className="hidden md:block" />
            <span className="text-primary-400 font-bold">Halal</span>,{" "}
            <span className="text-primary-400 font-bold">Hygienic</span>, and
            hand-picked for quality.
          </p>

          <button
            onClick={() => {
              document
                .getElementById("shop-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary text-xl px-12 py-5 rounded-2xl shadow-2xl hover:shadow-primary-600/60 group"
          >
            <span className="flex items-center gap-2">
              Order Now
              <TrendingUp className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      <div
        id="shop-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="gradient-text">Fresh Arrivals</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Discover our premium selection of fresh meats
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 font-medium shadow-lg"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Categories:
            </span>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery("");
                }}
                className={clsx(
                  "px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border-2",
                  activeCategory === cat
                    ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white border-transparent shadow-xl shadow-primary-500/30 scale-105"
                    : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-border hover:border-primary-500 hover:scale-105 shadow-md"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Loading delicious products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No products found
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="text-primary-600 dark:text-primary-500 text-lg font-bold">
                  {filteredProducts.length}
                </span>{" "}
                product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
