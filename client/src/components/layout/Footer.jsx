import { Link, NavLink } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { Logo } from './Header';
import { categories, cities } from '@shared/catalog.js';
import { useAuth, useCart } from '@/context/AppProviders';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo />
          <p>Verified professionals for every room in your home. Fixed prices, on-time arrival and HomeEase Cover on every booking.</p>
          <p className="site-footer__support"><Icon name="headset" size={18} />Support 8 AM–10 PM, every day</p>
        </div>
        <div>
          <h3>Services</h3>
          <ul>{categories.slice(0, 6).map((c) => <li key={c.id}><Link to={`/c/${c.id}`}>{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h3>Customers</h3>
          <ul>
            <li><Link to="/bookings">My bookings</Link></li>
            <li><Link to="/search">All services</Link></li>
            <li><Link to="/#cover">HomeEase Cover</Link></li>
          </ul>
        </div>
        <div>
          <h3>Professionals</h3>
          <ul>
            <li><Link to="/join">Join as a professional</Link></li>
            <li><Link to="/pro/pro-ravi">Professional profiles</Link></li>
          </ul>
        </div>
        <div>
          <h3>Cities</h3>
          <ul>{cities.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
        </div>
      </div>
      <div className="container site-footer__base">
        <span>© 2026 HomeEase Services Pvt. Ltd.</span>
        <span>Terms · Privacy · Anti-discrimination policy</span>
      </div>
    </footer>
  );
}

export function MobileNav() {
  const cart = useCart();
  const { user, openAuth } = useAuth();
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <NavLink to="/" end><Icon name="home" /><span>Home</span></NavLink>
      <NavLink to="/search"><Icon name="grid" /><span>Services</span></NavLink>
      <NavLink to="/bookings"><Icon name="calendar" /><span>Bookings</span></NavLink>
      <NavLink to="/checkout" className="mobile-nav__cart">
        <Icon name="bag" />{cart.count > 0 && <b>{cart.count}</b>}<span>Cart</span>
      </NavLink>
      {user ? (
        <NavLink to="/bookings?tab=account"><Icon name="user" /><span>Account</span></NavLink>
      ) : (
        <button onClick={() => openAuth()}><Icon name="user" /><span>Log in</span></button>
      )}
    </nav>
  );
}
