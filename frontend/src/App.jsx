import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import PromoBanners from './components/PromoBanners';
import FeaturedProducts from './components/FeaturedProducts';
import CountdownBanner from './components/CountdownBanner';
import DealsOfDay from './components/DealsOfDay';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <PromoBanners />
        <FeaturedProducts />
        <CountdownBanner />
        <DealsOfDay />
      </main>
      <Footer />
    </div>
  );
}
