
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";


export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function handleLogout() {
    logout();
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            🛒 ShopHub
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            🏠 Home
          </Link>

          <Link to="/checkout" className="navbar-link navbar-cart">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div className="navbar-auth">
            {user ? (
              <>
                <span className="navbar-user">👤 {user.email}</span>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary btn-small">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
  