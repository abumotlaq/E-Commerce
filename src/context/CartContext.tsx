import { useState } from "react";
import type { ReactNode } from "react";
import { getProductById } from "../data/products";
import { CartContext } from "./useCart";
import type { CartItem, CartItemWithProduct } from "../types";

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(productId: number) {
    setCartItems((currentCart) => {
      const existing = currentCart.find((item) => item.id === productId);
      if (existing) {
        return currentCart.map((item) =>
          item.id === productId
            ? { id: productId, quantity: existing.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { id: productId, quantity: 1 }];
    });
  }

  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        product: getProductById(item.id),
      }))
      .filter(
        (item): item is CartItemWithProduct => item.product !== undefined
      );
  }

  function removeFromCart(productId: number) {
    setCartItems((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  function updateQuantity(productId: number, quantity: number) {
    setCartItems((currentCart) =>
      quantity <= 0
        ? currentCart.filter((item) => item.id !== productId)
        : currentCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
    );
  }

  function getCartTotal() {
    const total = cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
    return total;
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}