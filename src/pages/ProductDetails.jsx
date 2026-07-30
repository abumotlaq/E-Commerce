import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const foundProduct = getProductById(id);

    if (!foundProduct) {
      navigate("/", { replace: true });
      return;
    }

    setProduct(foundProduct);
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <h2 className="loading-text">Loading product...</h2>
        </div>
      </div>
    );
  }

  const productInCart = cartItems.find(
    (item) => item.id === product.id
  );

  const quantity = productInCart?.quantity ?? 0;

  return (
    <div className="page">
      <div className="container">
        <button
          className="btn btn-secondary back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="product-detail">
          <div className="product-detail-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="product-detail-content">
            <h1 className="product-detail-name">
              {product.name}
            </h1>

            <p className="product-detail-price">
              ${product.price.toFixed(2)}
            </p>

            <p className="product-detail-description">
              {product.description}
            </p>

            {quantity > 0 && (
              <p className="cart-info">
                In Cart: {quantity}
              </p>
            )}

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
    </div>
  );
}