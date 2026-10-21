import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from './components/SiteLayout';
import LandingPage from './customer-pages/LandingPage';
import AboutPage from './customer-pages/AboutPage';
import { liveLinks } from './content/landing';

// The marketplace itself lives on the shop site. /shop used to show sample products here,
// which read as fake listings next to the real shop, so it now goes straight to the real one.
function GoToShop() {
  useEffect(() => {
    window.location.replace(liveLinks.shop);
  }, []);
  return (
    <p style={{ padding: 24 }}>
      Opening the Hap’n shop… <a href={liveLinks.shop}>shop.hapnapponline.com</a>
    </p>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<GoToShop />} />
        <Route element={<SiteLayout />}>
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
