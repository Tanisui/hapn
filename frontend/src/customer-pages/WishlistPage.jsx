import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiHeart } from 'react-icons/fi';
import '../components/PageLayout.css';
import './WishlistPage.css';

export default function WishlistPage({ wishlist, toggleWishlist, addToCart, notify }) {
  return (
    <div className="page-layout">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', color: 'var(--gray-900)' }}>
        <h1>My Wishlist</h1>
        <p>Your saved items — add them to cart when you're ready to checkout.</p>
        <span className="page-hero-emoji">❤️</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <span>💔</span>
          <h3>Your wishlist is empty</h3>
          <p>Browse products and tap the heart to save items you love.</p>
          <Link to="/" className="wishlist-shop-btn" onClick={() => window.scrollTo({ top: 0 })}>Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="wishlist-toolbar">
            <span className="page-result-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</span>
            <button className="wishlist-addall-btn" onClick={() => { wishlist.forEach(p => addToCart(p)); notify(`Added all ${wishlist.length} items to cart!`); }}>
              <FiShoppingCart /> Add All to Cart
            </button>
          </div>

          <div className="wishlist-list">
            {wishlist.map(product => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;
              const emoji = product.category?.name === 'Food & Snacks' ? '🍜' :
                product.category?.name === 'Apparel' ? '👕' :
                product.category?.name === 'Stationery' ? '📝' :
                product.category?.name === 'Crafts' ? '🎨' :
                product.category?.name === 'Accessories' ? '💍' :
                product.category?.name === 'Home & Living' ? '🏠' : '📦';

              return (
                <div key={product.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <span>{emoji}</span>
                  </div>
                  <div className="wishlist-item-info">
                    <h4>{product.name}</h4>
                    <p className="wishlist-merchant">{product.merchant_name}</p>
                    {product.category && <span className="wishlist-category">{product.category.name}</span>}
                  </div>
                  <div className="wishlist-item-pricing">
                    <span className="wishlist-price">₱{Number(product.price).toFixed(2)}</span>
                    {product.original_price && (
                      <span className="wishlist-original">₱{Number(product.original_price).toFixed(2)}</span>
                    )}
                    {discount > 0 && <span className="wishlist-discount">-{discount}%</span>}
                  </div>
                  <div className="wishlist-item-actions">
                    <button className="wishlist-cart-btn" onClick={() => addToCart(product)}>
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button className="wishlist-remove-btn" onClick={() => toggleWishlist(product)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
