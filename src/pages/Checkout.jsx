import { useCart } from "../context/CartContext";

export default function Checkout() {
  const {
    getCartItemsWithProducts,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart();

  const cartItems = getCartItemsWithProducts();
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  function placeOrder() {
    alert("🎉 Your order has been placed successfully!");
    clearCart();
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="page-title">Checkout</h1>

          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products before placing an order.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-container">
          <div className="checkout-items">
            <h2 className="checkout-section-title">Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="checkout-item-image"
                />

                <div className="checkout-item-details">
                  <h3 className="checkout-item-name">
                    {item.product.name}
                  </h3>

                  <p className="checkout-item-price">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>

                <div className="checkout-item-controls">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                    >
                      -
                    </button>

                    <span className="quantity-value">
                      {item.quantity}
                    </span>

                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="checkout-item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Remove this item from your cart?"
                        )
                      ) {
                        removeFromCart(item.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <h2 className="checkout-section-title">Order Summary</h2>

            <p className="checkout-items-count">
              {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
            </p>

            <div className="checkout-total">
              <p className="checkout-total-label">Subtotal:</p>
              <p className="checkout-total-value">
                ${subtotal.toFixed(2)}
              </p>
            </div>

            <div className="checkout-total">
              <p className="checkout-total-label">Shipping:</p>
              <p className="checkout-total-value">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </p>
            </div>

            <div className="checkout-total">
              <p className="checkout-total-label">Total:</p>
              <p className="checkout-total-value checkout-total-final">
                ${total.toFixed(2)}
              </p>
            </div>

            <button
              className="btn btn-primary btn-large btn-block"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}