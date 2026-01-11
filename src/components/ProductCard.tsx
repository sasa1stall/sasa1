import React, { useState } from "react";
import { Plus, Check, Flame, Award } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { clsx } from "clsx";

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
  // Auto-select first in-stock variant on mount
  const getInitialVariant = () => {
    if (product.variants.length > 0) {
      const firstInStock = product.variants.find((v) => v.stock > 0);
      return firstInStock || null;
    }
    return null;
  };

  const [selectedVariant, setSelectedVariant] = useState<InputVariant | null>(
    getInitialVariant
  );
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
    <div className="bg-white dark:bg-dark-card rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-dark-border group flex flex-col h-full card-hover">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-125 group-hover:rotate-3 transition-all duration-700"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="flex items-center gap-1 text-white text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-lg backdrop-blur-sm">
            <Flame className="w-3 h-3" />
            Fresh Daily
          </span>
          {product.category === "Chicken" && (
            <span className="flex items-center gap-1 text-white text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-500 rounded-full shadow-lg backdrop-blur-sm">
              <Award className="w-3 h-3" />
              Halal
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white text-xs font-semibold px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50 dark:from-dark-card dark:to-dark-card">
        <div className="flex-1 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
              Choose Weight
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const variantOutOfStock = variant.stock <= 0;
                return (
                  <button
                    key={variant.weight}
                    onClick={() =>
                      !variantOutOfStock && setSelectedVariant(variant)
                    }
                    disabled={variantOutOfStock}
                    className={clsx(
                      "px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 relative min-w-[80px]",
                      variantOutOfStock
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed line-through opacity-50"
                        : selectedVariant?.weight === variant.weight
                        ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white border-transparent shadow-lg shadow-primary-500/30 transform scale-105"
                        : "bg-white dark:bg-dark-bg text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-500 hover:scale-105"
                    )}
                  >
                    {variant.weight}
                    {variantOutOfStock && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                        OUT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100 dark:border-dark-border">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Price
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {selectedVariant ? (
                  isOutOfStock ? (
                    <span className="text-base text-red-600 dark:text-red-500 font-bold">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="gradient-text">
                      ₹{selectedVariant.price}
                    </span>
                  )
                ) : (
                  <span className="text-sm text-gray-400 font-normal">
                    Select weight
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || isAdded || !!isOutOfStock}
              className={clsx(
                "flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-90 relative overflow-hidden",
                !selectedVariant || isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isAdded
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white scale-110"
                  : "bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-110"
              )}
            >
              {isAdded ? (
                <Check className="w-7 h-7 animate-bounce" />
              ) : (
                <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
              )}
              {isAdded && (
                <span className="absolute inset-0 bg-white/30 animate-ping rounded-2xl"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
