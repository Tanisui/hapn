import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from './components/SiteLayout';
import LandingPage from './customer-pages/LandingPage';
import AboutPage from './customer-pages/AboutPage';
import ContactPage from './customer-pages/ContactPage';
import { liveLinks, policyRedirects } from './content/landing';

// Opens a page on the shop site. /shop used to show sample products here, which read as fake
// listings next to the real shop; /terms and the other policies have one copy, on the shop.
function GoTo({ url, label }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);
  return (
    <p style={{ padding: 24 }}>
      Opening {label}… <a href={url}>{url.replace(/^https:\/\//, '')}</a>
    </p>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<GoTo url={liveLinks.shop} label="the Hap’n shop" />} />
        {Object.entries(policyRedirects).map(([path, url]) => (
          <Route key={path} path={path} element={<GoTo url={url} label="the policy" />} />
        ))}
        <Route element={<SiteLayout />}>
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
