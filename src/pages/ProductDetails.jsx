import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const foundProduct = getProductById(id);

      if (!foundProduct) {
        setError("Product not found");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      setProduct(foundProduct);
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  function handleAddToCart() {
    if (!product) return;

    const result = addToCart(product.id);
    
    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container">
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-container">
            <h2>❌ {error}</h2>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const quantity = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;
  const isOutOfStock = !product.inStock || product.stock === 0;
  const relatedProducts = product ? getRelatedProducts(product.id, 4) : [];

  return (
    <div className="page">
      <div className="container">
        <button
          className="btn btn-secondary btn-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="product-detail">
          <div className="product-detail-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/placeholder-image.png";
              }}
            />
          </div>

          <div className="product-detail-content">
            {product.category && (
              <p className="product-category">{product.category}</p>
            )}

            <h1 className="product-detail-name">{product.name}</h1>

            {product.rating && (
              <div className="product-rating">
                <span className="stars">⭐ {product.rating}</span>
                <span className="review-count">({product.reviews} reviews)</span>
              </div>
            )}

            <p className="product-detail-price">${product.price.toFixed(2)}</p>

            {isOutOfStock ? (
              <p className="out-of-stock-warning">
                ❌ This product is currently unavailable
              </p>
            ) : (
              <p className="in-stock-info">✅ {product.stock} in stock</p>
            )}

            <p className="product-detail-description">{product.description}</p>

            {quantity > 0 && (
              <p className="product-cart-info">In Cart: {quantity}</p>
            )}

            <button
              className={`btn btn-primary btn-large ${
                justAdded ? "btn-success" : ""
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock || justAdded}
            >
              {isOutOfStock
                ? "Out of Stock"
                : justAdded
                ? "✅ Added to Cart!"
                : `Add to Cart${quantity > 0 ? ` (${quantity})` : ""}`}
            </button>

            {quantity > 0 && (
              <Link to="/checkout" className="btn btn-secondary">
                Go to Checkout →
              </Link>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">You might also like</h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}