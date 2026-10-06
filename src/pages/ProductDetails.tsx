import { useParams, Navigate } from "react-router-dom";
import { getProductById } from "../data/products";
import { useCart } from "../context/useCart";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetails() {
  const { id } = useParams();
  const product = id ? getProductById(id) : undefined;
  const { addToCart, cartItems } = useCart();

  if (!product) {
    return <Navigate to="/" />;
  }

  const productInCart = cartItems.find((item) => item.id === product.id);

  const productQuantityLabel = productInCart
    ? `(${productInCart.quantity})`
    : "";

  return (
    <div className="page">
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-content">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">{formatPrice(product.price)}</p>
            <p className="product-detail-description">{product.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product.id)}
            >
              Add to Cart {productQuantityLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}