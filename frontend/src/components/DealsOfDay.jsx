import { useEffect, useState } from 'react';
import { getDeals } from '../api';
import ProductCard from './ProductCard';
import './DealsOfDay.css';

const fallbackDeals = [
  { id: 9, name: 'Rattan Earrings', price: 150, original_price: 250, merchant_name: 'Isla Crafts', category: { name: 'Accessories' } },
  { id: 10, name: 'Banana Chips Jar', price: 85, original_price: 120, merchant_name: 'Chippy South', category: { name: 'Food & Snacks' } },
  { id: 11, name: 'Calligraphy Pen Set', price: 310, original_price: 450, merchant_name: 'Papel Co.', category: { name: 'Stationery' } },
  { id: 12, name: 'Macrame Plant Hanger', price: 275, original_price: 400, merchant_name: 'Knot Studio', category: { name: 'Home & Living' } },
];

export default function DealsOfDay() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    getDeals()
      .then(res => setDeals(res.data))
      .catch(() => setDeals(fallbackDeals));
  }, []);

  return (
    <section className="deals-section">
      <div className="section-header">
        <div>
          <span className="section-tag">TODAY'S DEALS</span>
          <h2 className="display"><span className="text-dark">deals of</span> <span className="text-accent">the day</span></h2>
        </div>
      </div>
      <div className="products-grid">
        {deals.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

}
