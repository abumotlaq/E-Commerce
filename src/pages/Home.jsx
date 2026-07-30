import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/products";

export default function Home() {
  const products = getProducts();

  return (
    <div className="page">
      <section className="home-hero">
        <div className="container">
          <h1 className="home-title">Welcome to ShopHub</h1>

          <p className="home-subtitle">
            Discover high-quality products at unbeatable prices.
          </p>

          <p className="home-description">
            Explore our collection of premium products designed to make your
            shopping experience simple, fast, and enjoyable.
          </p>

          <a href="#products" className="btn btn-primary">
            Shop Now
          </a>
        </div>
      </section>

      <section className="container" id="products">
        <div className="products-header">
          <div>
            <h2 className="page-title">Our Products</h2>
            <p className="products-count">
              {products.length} Products Available
            </p>
          </div>
        </div>

        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="empty-products">
              <h3>No products found</h3>
              <p>Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}