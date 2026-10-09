import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Avatar, Button, ErrorNote, Icon, Modal, Skeleton } from '@/components/ui';
import SlotPicker from '@/components/booking/SlotPicker';
import { bookingApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/context/AppProviders';
import { inr, prettyDate, time12 } from '@/utils/format';

const STAGES = [
  { id: 'confirmed', label: 'Booking confirmed' },
  { id: 'assigned', label: 'Professional assigned' },
  { id: 'onway', label: 'On the way' },
  { id: 'started', label: 'Service started' },
  { id: 'completed', label: 'Completed' },
];

export function StatusPill({ status }) {
  const map = { confirmed: ['Upcoming', 'info'], completed: ['Completed', 'ok'], cancelled: ['Cancelled', 'muted'] };
  const [label, tone] = map[status] || [status, 'info'];
  return <span className={`status status--${tone}`}>{label}</span>;
}

export default function BookingDetail() {
  const { bookingId } = useParams();
  const [params] = useSearchParams();
  const toast = useToast();
  const { data: b, loading, error, reload } = useAsync(() => bookingApi.get(bookingId), [bookingId]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  if (error) return <div className="container page"><ErrorNote error={error} onRetry={reload} /><Link className="text-link" to="/bookings">All bookings</Link></div>;
  if (loading || !b) return <div className="container page narrow"><Skeleton h={160} r={18} /><div style={{ height: 16 }} /><Skeleton h={260} r={14} /></div>;

  const isNew = params.get('new') === '1';
  const stageIdx = b.status === 'completed' ? 4 : b.status === 'cancelled' ? -1 : 1;

  async function cancel() {
    setBusy(true);
    try { await bookingApi.cancel(b.id, reason || 'Not specified'); toast('Booking cancelled'); setCancelOpen(false); reload(); } finally { setBusy(false); }
  }
  async function reschedule(slot) {
    await bookingApi.reschedule(b.id, slot);
    toast(`Moved to ${prettyDate(slot.date)}, ${time12(slot.time)}`, 'success');
    setResOpen(false);
    reload();
  }

  return (
    <div className="container page narrow booking-detail">
      {isNew && b.status === 'confirmed' && (
        <section className="confirm-hero">
          <span className="confirm-hero__mark"><Icon name="check" size={34} strokeWidth={2.4} /></span>
          <div>
            <h1>You’re booked</h1>
            <p>{prettyDate(b.slot.date, { weekday: 'long', day: 'numeric', month: 'long' })} at {time12(b.slot.time)}. We’ll text updates to +91 {b.userPhone}.</p>
          </div>
        </section>
      )}

      <div className="booking-detail__head">
        <div>
          <p className="muted-sm">Booking {b.id}</p>
          {!isNew && <h1>{b.items[0].name}{b.items.length > 1 ? ` + ${b.items.length - 1} more` : ''}</h1>}
        </div>
        <StatusPill status={b.status} />
      </div>

      <div className="detail-grid">
        <section className="panel">
          <h2>When and where</h2>
          <dl className="kv">
            <div><dt><Icon name="calendar" size={18} />Slot</dt><dd>{prettyDate(b.slot.date, { weekday: 'short', day: 'numeric', month: 'short' })}, {time12(b.slot.time)}</dd></div>
            <div><dt><Icon name="pin" size={18} />Address</dt><dd>{b.address.line1}, {b.address.area}{b.address.landmark ? ` (${b.address.landmark})` : ''}</dd></div>
            <div><dt><Icon name="user" size={18} />Contact</dt><dd>{b.address.name}</dd></div>
          </dl>
          {b.status === 'confirmed' && (
            <div className="row-actions">
              <Button variant="outline" size="sm" icon="calendar" onClick={() => setResOpen(true)}>Reschedule</Button>
              <Button variant="ghost" size="sm" onClick={() => setCancelOpen(true)}>Cancel booking</Button>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Your professional</h2>
          {b.pro ? (
            <div className="assigned">
              <Avatar name={b.pro.name} tone={b.pro.tone} size={52} />
              <div>
                <strong>{b.pro.name}</strong>
                <span className="muted-xs"><Icon name="star" filled size={12} className="rating__star" /> {b.pro.rating} · Background verified</span>
              </div>
              <Link to={`/pro/${b.pro.id}`} className="link-btn">Profile</Link>
            </div>
          ) : <p className="muted-sm">We’ll assign a professional about 2 hours before your slot.</p>}
          {b.status === 'confirmed' && (
            <div className="start-code">
              <span className="muted-xs">Start code</span>
              <strong className="tnum">{b.otp}</strong>
              <span className="muted-xs">Share it only when the professional arrives.</span>
            </div>
          )}
        </section>

        {b.status !== 'cancelled' && (
          <section className="panel panel--wide">
            <h2>Progress</h2>
            <ol className="timeline">
              {STAGES.map((s, i) => (
                <li key={s.id} className={i <= stageIdx ? 'is-done' : i === stageIdx + 1 ? 'is-next' : ''}>
                  <span className="timeline__dot">{i <= stageIdx && <Icon name="check" size={12} strokeWidth={2.5} />}</span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="panel panel--wide">
          <h2>Payment summary</h2>
          <ul className="cart-lines">
            {b.items.map((i) => (
              <li key={i.id}><div className="cart-lines__name"><span>{i.name}</span></div><span className="muted-sm">×{i.qty}</span><span className="cart-lines__price tnum">{i.price ? inr(i.price * i.qty) : 'Free'}</span></li>
            ))}
          </ul>
          <dl className="bill">
            <div><dt>Item total</dt><dd className="tnum">{inr(b.bill.subtotal)}</dd></div>
            {b.bill.coupon && <div className="bill__off"><dt>Coupon {b.bill.coupon.code}</dt><dd className="tnum">−{inr(b.bill.coupon.discount)}</dd></div>}
            <div><dt>Taxes and platform fee</dt><dd className="tnum">{inr(b.bill.fee)}</dd></div>
            <div className="bill__total"><dt>{b.payment === 'now' ? 'Paid online' : 'Pay after service'}</dt><dd className="tnum">{inr(b.bill.total)}</dd></div>
          </dl>
        </section>
      </div>

      <div className="row-actions row-actions--end">
        <Link to="/bookings" className="btn btn--outline">All bookings</Link>
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </div>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel this booking?" size="sm"
        footer={<><Button variant="ghost" onClick={() => setCancelOpen(false)}>Keep booking</Button><Button variant="danger" loading={busy} onClick={cancel}>Cancel booking</Button></>}>
        <p className="muted">Cancelling is free until 3 hours before your slot. Want a different time instead? You can reschedule for free.</p>
        <fieldset className="radios">
          <legend className="field__label">Reason (optional)</legend>
          {['Booked by mistake', 'Plans changed', 'Found someone else', 'Price too high'].map((r) => (
            <label key={r} className="radio"><input type="radio" name="cancel-reason" id={`cr-${r}`} checked={reason === r} onChange={() => setReason(r)} />{r}</label>
          ))}
        </fieldset>
      </Modal>

      <Modal open={resOpen} onClose={() => setResOpen(false)} title="Pick a new time">
        <SlotPicker value={b.slot} categoryId={b.items[0].categoryId} onSave={reschedule} />
      </Modal>
    </div>
  );
}
