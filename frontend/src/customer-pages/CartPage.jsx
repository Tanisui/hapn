import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import '../components/PageLayout.css';
import './CartPage.css';

export default function CartPage({ cartItems, setCartItems, notify }) {
  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = item.qty + delta;
      if (newQty < 1) return item;
      return { ...item, qty: newQty };
    }));
  };

  const removeItem = (item) => {
    setCartItems(prev => prev.filter(i => i.id !== item.id));
    notify(`Removed "${item.name}" from cart`);
  };

  const clearCart = () => {
    setCartItems([]);
    notify('Cart cleared!');
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const savings = cartItems.reduce((sum, i) => {
    const orig = i.original_price || i.price;
    return sum + (orig - i.price) * i.qty;
  }, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <div className="page-layout">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', color: 'var(--gray-900)' }}>
        <h1>Shopping Cart</h1>
        <p>Review your items, adjust quantities, and proceed to checkout.</p>
        <span className="page-hero-emoji">🛒</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <span>🛒</span>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Start shopping now!</p>
          <Link to="/" className="cart-shop-btn" onClick={() => window.scrollTo({ top: 0 })}>Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart</span>
              <button className="cart-clear-btn" onClick={clearCart}>Clear All</button>
            </div>

            {cartItems.map(item => {
              const emoji = item.category?.name === 'Food & Snacks' ? '🍜' :
                item.category?.name === 'Apparel' ? '👕' :
                item.category?.name === 'Stationery' ? '📝' :
                item.category?.name === 'Crafts' ? '🎨' :
                item.category?.name === 'Accessories' ? '💍' :
                item.category?.name === 'Home & Living' ? '🏠' : '📦';

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <span>{emoji}</span>
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.merchant_name}</p>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">₱{Number(item.price).toFixed(2)}</span>
                      {item.original_price && (
                        <span className="cart-item-original">₱{Number(item.original_price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="cart-qty-control">
                    <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}><FiMinus /></button>
                    <span className="cart-qty-value">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}><FiPlus /></button>
                  </div>
                  <div className="cart-item-total">
                    ₱{(item.price * item.qty).toFixed(2)}
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeItem(item)}>
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div className="summary-row savings">
                <span>You Save</span>
                <span>-₱{savings.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-ship">FREE</span> : `₱${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-note">Add ₱{(500 - subtotal).toFixed(2)} more for free shipping</p>
            )}
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={() => notify('Proceeding to checkout...')}>
              Proceed to Checkout
            </button>

            <div className="promo-input-wrap">
              <input type="text" placeholder="Enter promo code" className="promo-input" />
              <button className="promo-apply-btn" onClick={() => notify('Promo code applied!')}>Apply</button>
            </div>

            <div className="cart-trust">
              <div className="trust-item">🔒 Secure Checkout</div>
              <div className="trust-item">📦 Free Shipping over ₱500</div>
              <div className="trust-item">↩️ Easy Returns within 7 days</div>
            </div>

            <div className="cart-payment-methods">
              <span>We accept:</span>
              <div className="payment-icons">
                <span title="GCash">💳 GCash</span>
                <span title="Maya">📱 Maya</span>
                <span title="COD">💵 COD</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
