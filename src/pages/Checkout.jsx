import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const TAX_RATE = 0.1;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 10;

export default function Checkout() {
  const navigate = useNavigate();
  const { getCartItemsWithProducts, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);

  const cartItems = getCartItemsWithProducts();
  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  function handleUpdateQuantity(productId, newQuantity) {
    setError(null);

    if (newQuantity < 1) {
      if (window.confirm("Remove this item from cart?")) {
        removeFromCart(productId);
      }
      return;
    }

    if (newQuantity > 10) {
      setError("Maximum 10 items per product");
      return;
    }

    const result = updateQuantity(productId, newQuantity);
    if (!result.success) {
      setError(result.error);
    }
  }

  function handleRemoveFromCart(itemId) {
    setError(null);
    removeFromCart(itemId);
  }

  async function handlePlaceOrder() {
    setError(null);

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (total <= 0) {
      setError("Invalid order total");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const order = {
        id: `ORD-${Date.now()}`,
        items: cartItems,
        subtotal,
        tax,
        shipping,
        total,
        date: new Date().toISOString(),
      };

      localStorage.setItem(`order_${order.id}`, JSON.stringify(order));

      clearCart();
      setOrderPlaced(true);

      setTimeout(() => {
        navigate(`/order-confirmation/${order.id}`);
      }, 2000);
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="page">
        <div className="container">
          <div className="success-message">
            <h2>✅ Order Placed Successfully!</h2>
            <p>Redirecting to confirmation page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          <div className="empty-cart-message">
            <p>Your cart is empty</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="checkout-container">
          <div className="checkout-items">
            <h2 className="checkout-section-title">Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="checkout-item-image"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png";
                  }}
                />

                <div className="checkout-item-details">
                  <h3 className="checkout-item-name">{item.product.name}</h3>
                  <p className="checkout-item-price">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>

                <div className="checkout-item-controls">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isProcessing}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10 || isProcessing}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="checkout-item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => handleRemoveFromCart(item.id)}
                    disabled={isProcessing}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <h2 className="checkout-section-title">Order Total</h2>

            <div className="checkout-total">
              <p className="checkout-total-label">Subtotal:</p>
              <p className="checkout-total-value">${subtotal.toFixed(2)}</p>
            </div>

            <div className="checkout-total">
              <p className="checkout-total-label">Tax (10%):</p>
              <p className="checkout-total-value">${tax.toFixed(2)}</p>
            </div>

            <div className="checkout-total">
              <p className="checkout-total-label">Shipping:</p>
              <p className="checkout-total-value">
                {shipping === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </p>
            </div>

            <div className="checkout-total-final">
              <p className="checkout-total-label">Total:</p>
              <p className="checkout-total-value">${total.toFixed(2)}</p>
            </div>

            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="shipping-info">
                💡 Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
              </p>
            )}

            <button
              className="btn btn-primary btn-large btn-block"
              onClick={handlePlaceOrder}
              disabled={isProcessing || cartItems.length === 0}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}