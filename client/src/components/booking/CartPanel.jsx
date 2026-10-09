import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { useCart } from '@/context/AppProviders';
import { duration, inr } from '@/utils/format';

export function CartLines({ editable = true }) {
  const cart = useCart();
  return (
    <ul className="cart-lines">
      {cart.items.map((i) => (
        <li key={i.id}>
          <div className="cart-lines__name">
            <span>{i.name}</span>
            <small className="muted-xs">{duration(i.durationMins)}{i.qty > 1 ? ` × ${i.qty}` : ''}</small>
          </div>
          {editable ? (
            <div className="stepper stepper--sm">
              <button onClick={() => cart.dec(i.id)} aria-label={`Remove one ${i.name}`}><Icon name="minus" size={14} /></button>
              <span>{i.qty}</span>
              <button onClick={() => cart.add(i)} aria-label={`Add one ${i.name}`} disabled={i.price === 0}><Icon name="plus" size={14} /></button>
            </div>
          ) : <span className="muted-sm">×{i.qty}</span>}
          <span className="cart-lines__price tnum">{i.price === 0 ? 'Free' : inr(i.price * i.qty)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Sticky summary on category pages. */
export function CartPanel() {
  const cart = useCart();
  const navigate = useNavigate();
  const saved = cart.mrpTotal - cart.subtotal;
  return (
    <aside className="cart-panel" aria-label="Your cart">
      {cart.count === 0 ? (
        <div className="cart-panel__empty">
          <Icon name="bag" size={28} />
          <p>Your cart is empty</p>
          <span className="muted-xs">Add a service to see the total and pick a slot.</span>
        </div>
      ) : (
        <>
          <h2 className="cart-panel__title">Cart <span className="muted-sm">{cart.count} item{cart.count > 1 ? 's' : ''}</span></h2>
          <CartLines />
          {saved > 0 && <p className="savings"><Icon name="tag" size={15} />You save {inr(saved)} on this order</p>}
          <button className="btn btn--primary btn--block btn--lg cart-panel__cta" onClick={() => navigate('/checkout')}>
            <span>{inr(cart.subtotal)}</span><span>Choose a slot</span><Icon name="right" size={18} />
          </button>
        </>
      )}
    </aside>
  );
}

/** Bottom bar for small screens. */
export function CartBar() {
  const cart = useCart();
  if (!cart.count) return null;
  return (
    <div className="cart-bar">
      <div>
        <strong className="tnum">{inr(cart.subtotal)}</strong>
        <span className="muted-xs">{cart.count} item{cart.count > 1 ? 's' : ''}{cart.mrpTotal > cart.subtotal ? ` · saving ${inr(cart.mrpTotal - cart.subtotal)}` : ''}</span>
      </div>
      <Link to="/checkout" className="btn btn--primary">View cart</Link>
    </div>
  );
}
