import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { clsx } from 'clsx';

interface InputVariant {
    weight: string;
    price: number;
    stock: number;
    _id?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  variants: InputVariant[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const [selectedVariant, setSelectedVariant] = useState<InputVariant | null>(null);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Check if selected variant is in stock
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;
  
  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      addToCart(product, selectedVariant, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-dark-border group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <span className="text-white text-xs font-bold px-2 py-1 bg-primary-600 rounded-full">Fresh</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{product.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Quantity</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const variantOutOfStock = variant.stock <= 0;
                return (
                  <button
                    key={variant.weight}
                    onClick={() => !variantOutOfStock && setSelectedVariant(variant)}
                    disabled={variantOutOfStock}
                    className={clsx(
                      "px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 relative",
                      variantOutOfStock
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed line-through"
                        : selectedVariant?.weight === variant.weight
                          ? "bg-primary-600 text-white border-primary-600 shadow-md transform scale-105"
                          : "bg-white dark:bg-dark-bg text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-400"
                    )}
                  >
                    {variant.weight}
                    {variantOutOfStock && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded">Out</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedVariant ? (
                  isOutOfStock ? (
                    <span className="text-sm text-red-500">Out of Stock</span>
                  ) : (
                    `₹${selectedVariant.price}`
                  )
                ) : (
                  <span className="text-sm text-gray-400">Select size</span>
                )}
              </p>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || isAdded || !!isOutOfStock}
              className={clsx(
                "flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform active:scale-95",
                !selectedVariant || isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : isAdded 
                    ? "bg-green-500 text-white" 
                    : "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-primary-500/50"
              )}
            >
              {isAdded ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
