import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon';
import { compact, inr, initials } from '@/utils/format';
import { useCart } from '@/context/AppProviders';

export { Icon };

export function Button({ variant = 'primary', size = 'md', block, icon, iconRight, loading, children, className = '', ...rest }) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children && <span>{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} />}
    </button>
  );
}

export function Rating({ value, count, size = 'md' }) {
  return (
    <span className={`rating rating--${size}`}>
      <Icon name="star" filled size={size === 'lg' ? 18 : 14} className="rating__star" />
      <strong>{Number(value).toFixed(2)}</strong>
      {count !== undefined && <span className="rating__count">({compact(count)} reviews)</span>}
    </span>
  );
}

export function Price({ price, mrp, quote, size = 'md' }) {
  if (quote) return <span className={`price price--${size}`}><strong>Free visit</strong><span className="price__note">Quote on inspection</span></span>;
  return (
    <span className={`price price--${size}`}>
      <strong>{inr(price)}</strong>
      {mrp > price && <s>{inr(mrp)}</s>}
    </span>
  );
}

/** "Add" button that turns into a quantity stepper once in the cart. */
export function AddToCart({ service, compact: small }) {
  const cart = useCart();
  const qty = cart.qtyOf(service.id);
  if (!qty) {
    return (
      <button className={`add-btn ${small ? 'add-btn--sm' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); cart.add(service); }} aria-label={`Add ${service.name} to cart`}>
        {service.quote ? 'Book visit' : 'Add'}
      </button>
    );
  }
  return (
    <div className={`stepper ${small ? 'stepper--sm' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <button onClick={() => cart.dec(service.id)} aria-label={`Remove one ${service.name}`}><Icon name="minus" size={16} /></button>
      <span aria-live="polite">{qty}</span>
      <button onClick={() => cart.add(service)} aria-label={`Add one more ${service.name}`} disabled={service.quote}><Icon name="plus" size={16} /></button>
    </div>
  );
}

const TONE_ICON = { cleaning: 'spray', 'ac-appliances': 'snow', electrician: 'bolt', plumber: 'tap', carpenter: 'saw', painting: 'roller', 'pest-control': 'bug', 'salon-women': 'comb', 'mens-grooming': 'razor' };
const CAT_TONE = { cleaning: 'mint', 'ac-appliances': 'sky', electrician: 'sun', plumber: 'sky', carpenter: 'clay', painting: 'rose', 'pest-control': 'leaf', 'salon-women': 'rose', 'mens-grooming': 'clay' };
export const iconFor = (categoryId) => TONE_ICON[categoryId] || 'sparkle';
export const toneFor = (categoryId) => CAT_TONE[categoryId] || 'mint';

/** Illustrated thumbnail standing in for photography: tinted plate, pattern, large glyph. */
export function Thumb({ categoryId, size = 'md', label }) {
  return (
    <div className={`thumb thumb--${size} tone-${toneFor(categoryId)}`} aria-hidden={!label} aria-label={label}>
      <span className="thumb__ring" />
      <Icon name={iconFor(categoryId)} size={size === 'lg' ? 56 : size === 'sm' ? 26 : 40} strokeWidth={1.4} />
    </div>
  );
}

export function Avatar({ name, tone = 'mint', size = 44 }) {
  return (
    <span className={`avatar tone-${tone}`} style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function Skeleton({ h = 16, w = '100%', r = 8, className = '' }) {
  return <span className={`skeleton ${className}`} style={{ height: h, width: w, borderRadius: r }} />;
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.querySelector('input, button:not(.modal__close), [href]')?.focus(), 30);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
        <header className="modal__head">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-btn modal__close" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div className={`accordion__item ${open === i ? 'is-open' : ''}`} key={it.q}>
          <button className="accordion__q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{it.q}</span>
            <Icon name="down" size={18} />
          </button>
          <div className="accordion__a" hidden={open !== i}><p>{it.a}</p></div>
        </div>
      ))}
    </div>
  );
}

export function Chip({ active, children, ...rest }) {
  return <button className={`chip ${active ? 'is-active' : ''}`} aria-pressed={!!active} {...rest}>{children}</button>;
}

export function EmptyState({ icon = 'search', title, children, action }) {
  return (
    <div className="empty">
      <span className="empty__icon"><Icon name={icon} size={28} /></span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorNote({ error, onRetry }) {
  return (
    <div className="error-note" role="alert">
      <Icon name="info" />
      <span>{error?.message || 'Something went wrong.'}</span>
      {onRetry && <button className="link-btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function Stars({ value, onChange, size = 22 }) {
  return (
    <div className="stars" role={onChange ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? 'is-on' : ''}><Icon name="star" filled size={size} /></span>
      ))}
    </div>
  );
}
