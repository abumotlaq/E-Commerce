import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { formatPrice } from "../utils/formatPrice";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/placeholder-image.svg";
        }}
      />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">{formatPrice(product.price)}</p>
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
  