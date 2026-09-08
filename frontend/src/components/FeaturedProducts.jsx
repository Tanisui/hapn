import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../api';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

const fallbackProducts = [
  { id: 1, name: 'Hand-woven Tote Bag', price: 450, original_price: 599, merchant_name: 'Davao Weaves', category: { name: 'Apparel' } },
  { id: 2, name: 'Dried Mango Pack', price: 180, original_price: 220, merchant_name: 'Tropik Bites', category: { name: 'Food & Snacks' } },
  { id: 3, name: 'Artisan Notebook', price: 250, original_price: 320, merchant_name: 'Papel Co.', category: { name: 'Stationery' } },
  { id: 4, name: 'Durian Candy Box', price: 120, original_price: 150, merchant_name: 'Davao Delights', category: { name: 'Food & Snacks' } },
  { id: 5, name: 'Beaded Bracelet Set', price: 199, original_price: 280, merchant_name: 'Bead & Thread', category: { name: 'Accessories' } },
  { id: 6, name: 'Embroidered Pouch', price: 320, original_price: 400, merchant_name: 'Stitch Davao', category: { name: 'Crafts' } },
  { id: 7, name: 'Tie-Dye Shirt', price: 380, original_price: 499, merchant_name: 'Dye Lab DVO', category: { name: 'Apparel' } },
  { id: 8, name: 'Coconut Oil Soap', price: 95, original_price: 130, merchant_name: 'Pure Mindanao', category: { name: 'Home & Living' } },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getFeaturedProducts()
      .then(res => setProducts(res.data))
      .catch(() => setProducts(fallbackProducts));
  }, []);

  return (
    <section className="featured-products-section">
      <div className="section-header">
        <div>
          <span className="section-tag">PRODUCTS</span>
          <h2><span className="text-dark">Featured</span> <span className="text-accent">Products</span></h2>
        </div>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="see-more-wrap">
        <button className="see-more-btn">See more →</button>
      </div>
    </section>
  );
}
