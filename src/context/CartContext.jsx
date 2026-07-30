import { createContext, useState, useContext, useEffect } from "react";
import { getProductById } from "../data/products";

const CartContext = createContext(null);

const MAX_QUANTITY_PER_ITEM = 10;

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const existing = cartItems.find((item) => item.id === productId);

    if (existing) {
      if (existing.quantity >= MAX_QUANTITY_PER_ITEM) {
        return { success: false, error: `Maximum ${MAX_QUANTITY_PER_ITEM} items per product` };
      }

      setCartItems(
        cartItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }

    return { success: true };
  }

  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        product: getProductById(item.id),
      }))
      .filter((item) => item.product);
  }

  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    if (quantity > MAX_QUANTITY_PER_ITEM) {
      return { success: false, error: `Maximum ${MAX_QUANTITY_PER_ITEM} items per product` };
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    return { success: true };
  }

  function getCartTotal() {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
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

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}