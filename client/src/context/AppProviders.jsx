import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { authApi } from '@/services/api';

/* ---------------- Cart ---------------- */
const CartCtx = createContext(null);
const CART_KEY = 'homeease.cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.id === action.service.id);
      const items = existing
        ? state.items.map((i) => (i.id === action.service.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { id: action.service.id, name: action.service.name, price: action.service.price, mrp: action.service.mrp, durationMins: action.service.durationMins, categoryId: action.service.categoryId, qty: 1 }];
      return { ...state, items };
    }
    case 'dec':
      return { ...state, items: state.items.map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0) };
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'clear':
      return { items: [] };
    default:
      return state;
  }
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; } catch { return { items: [] }; }
}

export function useCart() { return useContext(CartCtx); }

/* ---------------- Auth ---------------- */
const AuthCtx = createContext(null);
export function useAuth() { return useContext(AuthCtx); }

/* ---------------- Location ---------------- */
const LocationCtx = createContext(null);
export function useLocationPref() { return useContext(LocationCtx); }

/* ---------------- Toasts ---------------- */
const ToastCtx = createContext(null);
export function useToast() { return useContext(ToastCtx); }

export function AppProviders({ children }) {
  /* cart */
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);
  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* ignore */ } }, [cart]);
  const cartValue = useMemo(() => {
    const count = cart.items.reduce((a, i) => a + i.qty, 0);
    const subtotal = cart.items.reduce((a, i) => a + i.price * i.qty, 0);
    const mrpTotal = cart.items.reduce((a, i) => a + Math.max(i.mrp, i.price) * i.qty, 0);
    const minutes = cart.items.reduce((a, i) => a + i.durationMins * i.qty, 0);
    return {
      items: cart.items, count, subtotal, mrpTotal, minutes,
      qtyOf: (id) => cart.items.find((i) => i.id === id)?.qty || 0,
      add: (service) => dispatch({ type: 'add', service }),
      dec: (id) => dispatch({ type: 'dec', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [cart]);

  /* auth */
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('homeease.user')); } catch { return null; } });
  const [authOpen, setAuthOpen] = useState(false);
  const afterLogin = useRef(null);
  const authValue = useMemo(() => ({
    user,
    authOpen,
    openAuth: (then) => { afterLogin.current = then || null; setAuthOpen(true); },
    closeAuth: () => setAuthOpen(false),
    signIn: (u) => {
      setUser(u);
      try { localStorage.setItem('homeease.user', JSON.stringify(u)); } catch { /* ignore */ }
      setAuthOpen(false);
      const then = afterLogin.current; afterLogin.current = null; then?.();
    },
    signOut: () => { authApi.logout(); setUser(null); try { localStorage.removeItem('homeease.user'); } catch { /* ignore */ } },
  }), [user, authOpen]);

  /* location */
  const [city, setCity] = useState(() => { try { return localStorage.getItem('homeease.city') || 'delhi-ncr'; } catch { return 'delhi-ncr'; } });
  const locValue = useMemo(() => ({
    city,
    setCity: (c) => { setCity(c); try { localStorage.setItem('homeease.city', c); } catch { /* ignore */ } },
  }), [city]);

  /* toasts */
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, tone = 'default') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      <LocationCtx.Provider value={locValue}>
        <AuthCtx.Provider value={authValue}>
          <CartCtx.Provider value={cartValue}>
            {children}
            <div className="toast-stack" role="status" aria-live="polite">
              {toasts.map((t) => <div key={t.id} className={`toast toast--${t.tone}`}>{t.message}</div>)}
            </div>
          </CartCtx.Provider>
        </AuthCtx.Provider>
      </LocationCtx.Provider>
    </ToastCtx.Provider>
  );
}
