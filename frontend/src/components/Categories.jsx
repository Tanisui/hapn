import { useEffect, useState } from 'react';
import { getCategories } from '../api';
import { FiGrid } from 'react-icons/fi';
import './Categories.css';

const categoryEmojis = {
  'Apparel': '👕',
  'Food & Snacks': '🍜',
  'Stationery': '📝',
  'Crafts': '🎨',
  'Accessories': '💍',
  'Home & Living': '🏠',
};

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(() => {
        setCategories([
          { id: 1, name: 'Apparel', products_count: 12 },
          { id: 2, name: 'Food & Snacks', products_count: 25 },
          { id: 3, name: 'Stationery', products_count: 8 },
          { id: 4, name: 'Crafts', products_count: 15 },
          { id: 5, name: 'Accessories', products_count: 10 },
          { id: 6, name: 'Home & Living', products_count: 7 },
        ]);
      });
  }, []);

  return (
    <section className="categories-section">
      <div className="section-header">
        <h2 className="display"><span className="text-dark">featured</span> <span className="text-accent">categories</span></h2>
        <a href="#categories" className="view-all">View all categories</a>
      </div>
      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="card card-interactive category-card">
            <div className="category-icon">
              {categoryEmojis[cat.name] || <FiGrid />}
            </div>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
