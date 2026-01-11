import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import {
  CartContext,
  type Variant,
  type Product,
  type CartItem,
} from "./cart.context";

export type { CartItem };

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const { user } = useAuth();

  // Load Cart (Backend or Local)
  useEffect(() => {
    const loadCart = async () => {
      setCartLoading(true);
      if (user) {
        try {
          const { data } = await api.get("/cart");
          // Ensure data.items respects the CartItem structure
          if (data && data.items) {
            setCartItems(data.items);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Failed to load remote cart", error);
          // Don't reset cart on error - keep existing state
          // Try to load from localStorage as fallback
          const savedCart = localStorage.getItem("cartItems");
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart));
            } catch {
              setCartItems([]);
            }
          }
        }
      } else {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
      setCartLoading(false);
    };
    loadCart();
  }, [user]);

  // Sync Local Cart to LocalStorage (Only for guests)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product: Product, variant: Variant, qty: number) => {
    if (user) {
      // Backend
      try {
        const { data } = await api.post("/cart", {
          product,
          selectedVariant: variant,
          qty,
        });
        if (data && data.items) {
          setCartItems(data.items);
        }
      } catch (error) {
        console.error("Failed to add to remote cart", error);
        alert("Failed to add item to cart. Please check your connection.");
      }
    } else {
      // Local
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) =>
            item.product._id === product._id &&
            item.selectedVariant.weight === variant.weight
        );

        if (existingItem) {
          return prevItems.map((item) => {
            if (
              item.product._id === product._id &&
              item.selectedVariant.weight === variant.weight
            ) {
              const newQty = item.qty + qty;
              // Prevent quantity from going below 1
              return { ...item, qty: Math.max(1, newQty) };
            }
            return item;
          });
        } else {
          return [
            ...prevItems,
            { product, selectedVariant: variant, qty: Math.max(1, qty) },
          ];
        }
      });
    }
  };

  const removeFromCart = async (productId: string, weight: string) => {
    if (user) {
      try {
        const { data } = await api.post("/cart/remove", { productId, weight });
        if (data && data.items) {
          setCartItems(data.items);
        }
      } catch (error) {
        console.error("Failed to remove from remote cart", error);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.product._id === productId &&
              item.selectedVariant.weight === weight
            )
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete("/cart");
        setCartItems([]);
      } catch (error) {
        console.error("Failed to clear remote cart", error);
      }
    } else {
      setCartItems([]);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.selectedVariant.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
