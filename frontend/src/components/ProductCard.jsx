import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="product-card">
      {discount > 0 && <span className="product-badge">-{discount}%</span>}
      <div className="product-image">
        <span className="product-emoji">
          {product.category?.name === 'Food & Snacks' ? '🍜' :
           product.category?.name === 'Apparel' ? '👕' :
           product.category?.name === 'Stationery' ? '📝' :
           product.category?.name === 'Crafts' ? '🎨' :
           product.category?.name === 'Accessories' ? '💍' :
           product.category?.name === 'Home & Living' ? '🏠' : '📦'}
        </span>
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-merchant">{product.merchant_name}</p>
        <div className="product-pricing">
          <span className="product-price">₱{Number(product.price).toFixed(2)}</span>
          {product.original_price && (
            <span className="product-original">₱{Number(product.original_price).toFixed(2)}</span>
          )}
        </div>
        <div className="product-actions">
          <button className="add-to-cart-btn"><FiShoppingCart /> Add to Cart</button>
          <button className="wishlist-btn" aria-label="Add to Wishlist"><FiHeart /></button>
        </div>
      </div>
    </div>
  );
}
