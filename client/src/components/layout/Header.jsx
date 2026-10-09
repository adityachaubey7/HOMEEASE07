import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui';
import SearchBox from './SearchBox';
import { useAuth, useCart, useLocationPref } from '@/context/AppProviders';
import { cities } from '@shared/catalog.js';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="HomeEase home">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="10" className="logo__plate" />
        <path d="M8 17.5 17 10l9 7.5" className="logo__roof" />
        <path d="M11.5 16v8.5h11V16" className="logo__walls" />
        <circle cx="17" cy="20.5" r="2.2" className="logo__dot" />
      </svg>
      <span className="logo__word">Home<span>Ease</span></span>
    </Link>
  );
}

function CityPicker() {
  const { city, setCity } = useLocationPref();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = cities.find((c) => c.id === city) || cities[0];
  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div className="citypicker" ref={ref}>
      <button className="citypicker__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="listbox">
        <Icon name="pin" size={18} />
        <span className="citypicker__label"><small>Service in</small>{current.name}</span>
        <Icon name="down" size={16} />
      </button>
      {open && (
        <ul className="popover citypicker__menu" role="listbox" aria-label="Choose your city">
          {cities.map((c) => (
            <li key={c.id}>
              <button role="option" aria-selected={c.id === city} className={c.id === city ? 'is-active' : ''} onClick={() => { setCity(c.id); setOpen(false); }}>
                <span>{c.name}</span>
                {c.id === city && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const cart = useCart();
  const { user, openAuth, signOut } = useAuth();
  const [menu, setMenu] = useState(false);
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__row">
        <Logo />
        <CityPicker />
        {!isHome && <div className="site-header__search"><SearchBox size="sm" placeholder="Search services" /></div>}
        <nav className="site-header__nav" aria-label="Main">
          <NavLink to="/search" className="nav-link hide-sm">Services</NavLink>
          <NavLink to="/bookings" className="nav-link hide-sm">Bookings</NavLink>
          {user ? (
            <div className="account">
              <button className="icon-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Account menu"><Icon name="user" /></button>
              {menu && (
                <div className="popover account__menu" onMouseLeave={() => setMenu(false)}>
                  <p className="account__phone">+91 {user.phone}</p>
                  <button onClick={() => { setMenu(false); navigate('/bookings'); }}><Icon name="calendar" size={18} />My bookings</button>
                  <button onClick={() => { setMenu(false); signOut(); }}><Icon name="arrowLeft" size={18} />Log out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn--ghost btn--sm hide-sm" onClick={() => openAuth()}>Log in</button>
          )}
          <Link to="/checkout" className="cart-btn" aria-label={`Cart, ${cart.count} items`}>
            <Icon name="bag" />
            {cart.count > 0 && <span className="cart-btn__count">{cart.count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
