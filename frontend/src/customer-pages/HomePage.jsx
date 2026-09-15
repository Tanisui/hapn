import Hero from '../components/Hero';
import Categories from '../components/Categories';
import BrandBand from '../components/BrandBand';
import PromoBanners from '../components/PromoBanners';
import FeaturedProducts from '../components/FeaturedProducts';
import CountdownBanner from '../components/CountdownBanner';
import DealsOfDay from '../components/DealsOfDay';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <BrandBand />
      <PromoBanners />
      <FeaturedProducts />
      <CountdownBanner />
      <DealsOfDay />
    </>
  );
}
