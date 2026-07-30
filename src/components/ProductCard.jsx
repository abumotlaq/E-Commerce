import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const productInCart = cartItems.find((item) => item.id === product.id);
  const productQuantityLabel = productInCart && productInCart.quantity > 0
    ? ` • ${productInCart.quantity} in cart`
    : "";

  function handleAddToCart() {
    addToCart(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-card-image"
        onError={(e) => {
          e.target.src = "/placeholder-image.png";
        }}
      />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        <div className="product-card-actions">
          <Link className="btn btn-secondary" to={`/products/${product.id}`}>
            View Details
          </Link>
          <button
            className={`btn btn-primary ${justAdded ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={justAdded}
          >
            {justAdded ? "✅ Added!" : `Add to Cart${productQuantityLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}