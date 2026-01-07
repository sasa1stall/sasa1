import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface Variant {
  weight: string;
  price: number;
}

export interface CartItem {
  product: any;
  selectedVariant: Variant;
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, variant: Variant, qty: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load Cart (Backend or Local)
  useEffect(() => {
    const loadCart = async () => {
        if (user) {
            try {
                const { data } = await api.get('/cart');
                // Ensure data.items respects the CartItem structure
                if (data && data.items) {
                    setCartItems(data.items);
                }
            } catch (error) {
                console.error('Failed to load remote cart', error);
            }
        } else {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
    };
    loadCart();
  }, [user]);

  // Sync Local Cart to LocalStorage (Only for guests)
  useEffect(() => {
    if (!user) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);


  const addToCart = async (product: any, variant: Variant, qty: number) => {
    if (user) {
        // Backend
        try {
            const { data } = await api.post('/cart', { product, selectedVariant: variant, qty });
            if (data && data.items) {
                setCartItems(data.items);
            }
        } catch (error) {
            console.error('Failed to add to remote cart', error);
            alert('Failed to add item to cart. Please check your connection.');
        }
    } else {
        // Local
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.product._id === product._id && item.selectedVariant.weight === variant.weight
          );

          if (existingItem) {
            return prevItems.map((item) =>
              item.product._id === product._id && item.selectedVariant.weight === variant.weight
                ? { ...item, qty: item.qty + qty }
                : item
            );
          } else {
            return [...prevItems, { product, selectedVariant: variant, qty }];
          }
        });
    }
  };

  const removeFromCart = async (productId: string, weight: string) => {
    if (user) {
        try {
             const { data } = await api.post('/cart/remove', { productId, weight });
             if (data && data.items) {
                 setCartItems(data.items);
             }
        } catch (error) {
             console.error('Failed to remove from remote cart', error);
        }
    } else {
        setCartItems((prevItems) =>
          prevItems.filter((item) => !(item.product._id === productId && item.selectedVariant.weight === weight))
        );
    }
  };

  const clearCart = async () => {
    if (user) {
        try {
             await api.delete('/cart');
             setCartItems([]);
        } catch (error) {
             console.error('Failed to clear remote cart', error);
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
