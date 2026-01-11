import { createContext } from "react";

interface Variant {
  weight: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  variants: Variant[];
}

export interface CartItem {
  product: Product;
  selectedVariant: Variant;
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartLoading: boolean;
  addToCart: (product: Product, variant: Variant, qty: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

export type { Variant, Product, CartContextType };

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
