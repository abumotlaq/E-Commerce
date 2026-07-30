import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();

  const quantity =
    cartItems.find((item) => item.id === product.id)?.quantity ?? 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
      </Link>

      <div className="product-card-content">
        <h3 className="product-card-name">
          {product.name}
        </h3>

        <p className="product-card-price">
          ${product.price.toFixed(2)}
        </p>

        {quantity > 0 && (
          <p className="product-card-cart-info">
            In Cart: {quantity}
          </p>
        )}

        <div className="product-card-actions">
          <Link
            to={`/products/${product.id}`}
            className="btn btn-secondary"
          >
            View Details
          </Link>

          <button
            className="btn btn-primary"
            onClick={() => addToCart(product.id)}
          >
            Add to Cart
            {quantity > 0 && ` (${quantity})`}
          </button>
        </div>
      </div>
    </div>
  );
}