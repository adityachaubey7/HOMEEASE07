import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartLines } from '@/components/booking/CartPanel';
import { Avatar, Button, EmptyState, Icon, Skeleton } from '@/components/ui';
import { bookingApi, proApi } from '@/services/api';
import { useAuth, useCart, useLocationPref, useToast } from '@/context/AppProviders';
import { cities, professionals } from '@shared/catalog.js';
import SlotPicker from '@/components/booking/SlotPicker';
import { toISODate } from '@/services/mockDb';
import { duration, inr, prettyDate, time12 } from '@/utils/format';

const PLATFORM_FEE = 49;

function Step({ n, title, done, summary, active, onEdit, children }) {
  return (
    <section className={`co-step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`} aria-current={active ? 'step' : undefined}>
      <header className="co-step__head">
        <span className="co-step__n">{done && !active ? <Icon name="check" size={16} /> : n}</span>
        <div className="co-step__title">
          <h2>{title}</h2>
          {done && !active && summary && <p className="muted-sm">{summary}</p>}
        </div>
        {done && !active && <button className="link-btn" onClick={onEdit}>Change</button>}
      </header>
      {active && <div className="co-step__body">{children}</div>}
    </section>
  );
}

function AddressForm({ value, onSave }) {
  const { city } = useLocationPref();
  const areas = cities.find((c) => c.id === city)?.areas || [];
  const [form, setForm] = useState(value || { line1: '', area: areas[0] || '', landmark: '', label: 'Home', name: '' });
  const [err, setErr] = useState({});
  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  function submit(e) {
    e.preventDefault();
    const errors = {};
    if (form.line1.trim().length < 3) errors.line1 = 'Enter your house or flat number and building.';
    if (form.name.trim().length < 2) errors.name = 'Enter the name the professional should ask for.';
    setErr(errors);
    if (!Object.keys(errors).length) onSave({ ...form, city });
  }
  return (
    <form className="form form--grid" onSubmit={submit} noValidate>
      <label className="field field--full">
        <span className="field__label">House / flat no. and building</span>
        <input id="addr-line1" value={form.line1} onChange={up('line1')} placeholder="B-204, Palm Grove Apartments" aria-invalid={!!err.line1} />
        {err.line1 && <span className="field__error">{err.line1}</span>}
      </label>
      <label className="field">
        <span className="field__label">Area</span>
        <span className="select select--field">
          <select id="addr-area" value={form.area} onChange={up('area')}>{areas.map((a) => <option key={a}>{a}</option>)}</select>
          <Icon name="down" size={16} />
        </span>
      </label>
      <label className="field">
        <span className="field__label">Landmark <span className="muted-xs">(optional)</span></span>
        <input id="addr-landmark" value={form.landmark} onChange={up('landmark')} placeholder="Near Select City Mall" />
      </label>
      <label className="field">
        <span className="field__label">Name</span>
        <input id="addr-name" value={form.name} onChange={up('name')} placeholder="Who will be at home?" aria-invalid={!!err.name} />
        {err.name && <span className="field__error">{err.name}</span>}
      </label>
      <fieldset className="field">
        <legend className="field__label">Save as</legend>
        <div className="seg">
          {['Home', 'Work', 'Other'].map((l) => (
            <label key={l} className={form.label === l ? 'is-active' : ''}>
              <input type="radio" name="addr-label" id={`addr-label-${l}`} value={l} checked={form.label === l} onChange={up('label')} />{l}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field--full"><Button type="submit">Save and continue</Button></div>
    </form>
  );
}

function ProPicker({ value, onSave, categoryId }) {
  const [pros, setPros] = useState(null);
  const [choice, setChoice] = useState(value ?? '');
  useEffect(() => { proApi.list({ categoryId }).then(setPros); }, [categoryId]);
  return (
    <div className="pro-picker">
      <div className="radio-cards" role="radiogroup">
        <label className={`radio-card ${choice === '' ? 'is-active' : ''}`}>
          <input type="radio" name="pro" id="pro-auto" checked={choice === ''} onChange={() => setChoice('')} />
          <span className="radio-card__icon"><Icon name="sparkle" size={22} /></span>
          <span><strong>Best available professional</strong><small className="muted-xs">Matched by distance, rating and your slot. Usually the fastest.</small></span>
          <span className="badge badge--brand">Recommended</span>
        </label>
        {!pros && <Skeleton h={72} r={12} />}
        {pros?.map((p) => (
          <label key={p.id} className={`radio-card ${choice === p.id ? 'is-active' : ''}`}>
            <input type="radio" name="pro" id={`pro-${p.id}`} checked={choice === p.id} onChange={() => setChoice(p.id)} />
            <Avatar name={p.name} tone={p.tone} size={40} />
            <span><strong>{p.name}</strong><small className="muted-xs"><Icon name="star" filled size={12} className="rating__star" /> {p.rating} · {p.jobs.toLocaleString('en-IN')} jobs · {p.area}</small></span>
            <Link to={`/pro/${p.id}`} className="link-btn" onClick={(e) => e.stopPropagation()}>Profile</Link>
          </label>
        ))}
      </div>
      <Button onClick={() => onSave(choice)}>Continue</Button>
    </div>
  );
}

export default function Checkout() {
  const cart = useCart();
  const { user, openAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [slot, setSlot] = useState(null);
  const [proId, setProId] = useState(undefined);
  const [payment, setPayment] = useState('after');
  const [coupon, setCoupon] = useState(null);
  const [code, setCode] = useState('');
  const [couponErr, setCouponErr] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placeErr, setPlaceErr] = useState('');

  const categoryId = cart.items[0]?.categoryId;
  const fee = cart.subtotal > 0 ? PLATFORM_FEE : 0;
  const couponOff = coupon && cart.subtotal >= 0 ? Math.min(coupon.discount, cart.subtotal) : 0;
  const total = Math.max(0, cart.subtotal - couponOff + fee);

  // Re-validate an applied coupon when the cart changes.
  useEffect(() => {
    if (!coupon) return;
    bookingApi.validateCoupon(coupon.code, cart.subtotal).then(setCoupon).catch((e) => { setCoupon(null); setCouponErr(e.message); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.subtotal]);

  async function applyCoupon(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setCouponBusy(true); setCouponErr('');
    try { const c = await bookingApi.validateCoupon(code, cart.subtotal); setCoupon(c); toast(`${c.code} applied: ${inr(c.discount)} off`, 'success'); setCode(''); }
    catch (err) { setCouponErr(err.message); }
    finally { setCouponBusy(false); }
  }

  async function place() {
    if (!user) { openAuth(() => setTimeout(() => document.getElementById('place-btn')?.click(), 50)); return; }
    setPlacing(true); setPlaceErr('');
    try {
      const booking = await bookingApi.create({
        items: cart.items, address, slot, proId: proId || null, payment,
        bill: { subtotal: cart.subtotal, mrpTotal: cart.mrpTotal, coupon: coupon ? { code: coupon.code, discount: couponOff } : null, fee, total },
        userPhone: user.phone,
      });
      cart.clear();
      navigate(`/bookings/${booking.id}?new=1`);
    } catch (err) {
      setPlaceErr(err.message);
    } finally { setPlacing(false); }
  }

  if (cart.count === 0) {
    return (
      <div className="container page">
        <EmptyState icon="bag" title="Your cart is empty" action={<Link to="/search" className="btn btn--primary">Browse services</Link>}>
          Add a service to choose a time and book.
        </EmptyState>
      </div>
    );
  }

  const ready = address && slot && proId !== undefined;

  return (
    <div className="container page checkout">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to={`/c/${categoryId}`}><Icon name="arrowLeft" size={16} />Keep browsing</Link></nav>
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <div className="checkout__steps">
          {!user && (
            <div className="notice notice--brand">
              <Icon name="user" size={18} />
              <span>Log in to see saved addresses and get booking updates by SMS.</span>
              <button className="link-btn" onClick={() => openAuth()}>Log in</button>
            </div>
          )}
          <Step n={1} title="Address" active={step === 1} done={!!address} onEdit={() => setStep(1)}
            summary={address && `${address.label} · ${address.line1}, ${address.area}`}>
            <AddressForm value={address} onSave={(a) => { setAddress(a); setStep(slot ? (proId !== undefined ? 4 : 3) : 2); }} />
          </Step>
          <Step n={2} title="Date and time" active={step === 2} done={!!slot} onEdit={() => setStep(2)}
            summary={slot && `${prettyDate(slot.date)} at ${time12(slot.time)} · about ${duration(cart.minutes)}`}>
            <SlotPicker value={slot} categoryId={categoryId} onSave={(s) => { setSlot(s); setStep(proId !== undefined ? 4 : 3); }} />
          </Step>
          <Step n={3} title="Professional" active={step === 3} done={proId !== undefined} onEdit={() => setStep(3)}
            summary={proId === '' ? 'Best available professional' : professionals.find((p) => p.id === proId)?.name}>
            <ProPicker value={proId} categoryId={categoryId} onSave={(p) => { setProId(p); setStep(4); }} />
          </Step>
          <Step n={4} title="Payment" active={step === 4} done={false}>
            <div className="radio-cards" role="radiogroup" aria-label="Payment method">
              {[
                { id: 'after', icon: 'wallet', t: 'Pay after the service', d: 'UPI, card or cash once the job is done.' },
                { id: 'now', icon: 'shield', t: 'Pay now', d: 'UPI or card. Full refund if you cancel 3+ hours before.' },
              ].map((p) => (
                <label key={p.id} className={`radio-card ${payment === p.id ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" id={`pay-${p.id}`} checked={payment === p.id} onChange={() => setPayment(p.id)} />
                  <span className="radio-card__icon"><Icon name={p.icon} size={22} /></span>
                  <span><strong>{p.t}</strong><small className="muted-xs">{p.d}</small></span>
                </label>
              ))}
            </div>
          </Step>
        </div>

        <aside className="checkout__summary">
          <div className="summary-card">
            <h2>Your order</h2>
            <CartLines />
            <form className="coupon" onSubmit={applyCoupon}>
              {coupon ? (
                <div className="coupon__applied">
                  <Icon name="tag" size={16} />
                  <span><strong>{coupon.code}</strong> applied</span>
                  <button type="button" className="link-btn" onClick={() => setCoupon(null)}>Remove</button>
                </div>
              ) : (
                <>
                  <label className="sr-only" htmlFor="coupon">Coupon code</label>
                  <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code (try EASE100)" />
                  <Button variant="outline" size="sm" type="submit" loading={couponBusy}>Apply</Button>
                </>
              )}
              {couponErr && <p className="field__error">{couponErr}</p>}
            </form>
            <dl className="bill">
              <div><dt>Item total</dt><dd className="tnum">{cart.mrpTotal > cart.subtotal && <s>{inr(cart.mrpTotal)}</s>} {inr(cart.subtotal)}</dd></div>
              {couponOff > 0 && <div className="bill__off"><dt>Coupon {coupon.code}</dt><dd className="tnum">−{inr(couponOff)}</dd></div>}
              <div><dt>Taxes and platform fee</dt><dd className="tnum">{inr(fee)}</dd></div>
              <div className="bill__total"><dt>To pay</dt><dd className="tnum">{inr(total)}</dd></div>
            </dl>
            {cart.mrpTotal - cart.subtotal + couponOff > 0 && (
              <p className="savings"><Icon name="tag" size={15} />Total savings {inr(cart.mrpTotal - cart.subtotal + couponOff)}</p>
            )}
            {placeErr && <p className="field__error" role="alert">{placeErr}</p>}
            <Button id="place-btn" block size="lg" disabled={!ready} loading={placing} onClick={place}>
              {ready ? (payment === 'now' ? `Pay ${inr(total)} and book` : `Book for ${inr(total)}`) : 'Complete the steps to book'}
            </Button>
            <p className="muted-xs center">Free cancellation up to 3 hours before your slot.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
