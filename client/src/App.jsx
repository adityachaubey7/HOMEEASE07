import { useEffect } from 'react';
import { BrowserRouter, MemoryRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AppProviders } from '@/context/AppProviders';
import Header from '@/components/layout/Header';
import { Footer, MobileNav } from '@/components/layout/Footer';
import AuthModal from '@/components/layout/AuthModal';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Category from '@/pages/Category';
import Professional from '@/pages/Professional';
import Checkout from '@/pages/Checkout';
import BookingDetail from '@/pages/BookingDetail';
import Bookings from '@/pages/Bookings';
import JoinPro from '@/pages/JoinPro';
import NotFound from '@/pages/NotFound';

// Embedded previews can't use real URLs, so routing switches to in-memory there.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter;

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Shell() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <MobileNav />
      <AuthModal />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="c/:categoryId" element={<Category />} />
            <Route path="pro/:proId" element={<Professional />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:bookingId" element={<BookingDetail />} />
            <Route path="join" element={<JoinPro />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProviders>
  );
}
