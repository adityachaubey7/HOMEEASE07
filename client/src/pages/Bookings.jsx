import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyState, Icon, Skeleton, Thumb } from '@/components/ui';
import { StatusPill } from './BookingDetail';
import { bookingApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/context/AppProviders';
import { inr, prettyDate, time12 } from '@/utils/format';
import { toISODate } from '@/services/mockDb';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function Bookings() {
  const { user, openAuth } = useAuth();
  const [tab, setTab] = useState('upcoming');
  const { data, loading, error } = useAsync(() => bookingApi.list(), [user?.id]);
  const needsLogin = error?.status === 401;
  const today = toISODate(new Date());

  const groups = {
    upcoming: data?.filter((b) => b.status === 'confirmed' && b.slot.date >= today) || [],
    past: data?.filter((b) => b.status === 'completed' || (b.status === 'confirmed' && b.slot.date < today)) || [],
    cancelled: data?.filter((b) => b.status === 'cancelled') || [],
  };
  const list = groups[tab];

  return (
    <div className="container page narrow">
      <header className="page-head">
        <h1>My bookings</h1>
        {!user && <Button variant="outline" size="sm" onClick={() => openAuth()}>Log in to sync bookings</Button>}
      </header>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
            {t.label}{groups[t.id].length > 0 && <span className="tabs__count">{groups[t.id].length}</span>}
          </button>
        ))}
      </div>
      {needsLogin ? (
        <EmptyState icon="user" title="Log in to see your bookings" action={<Button onClick={() => openAuth()}>Log in</Button>}>
          Your bookings are saved to your account, so you can see them on any device.
        </EmptyState>
      ) : (
      <div role="tabpanel">
        {loading && <><Skeleton h={110} r={14} /><div style={{ height: 12 }} /><Skeleton h={110} r={14} /></>}
        {!loading && list.length === 0 && (
          <EmptyState icon="calendar" title={tab === 'upcoming' ? 'No upcoming bookings' : `No ${tab} bookings`}
            action={tab === 'upcoming' && <Link to="/search" className="btn btn--primary">Book a service</Link>}>
            {tab === 'upcoming' ? 'Services you book will show here with your slot, professional and start code.' : null}
          </EmptyState>
        )}
        <ul className="booking-list">
          {list.map((b) => (
            <li key={b.id}>
              <Link to={`/bookings/${b.id}`} className="booking-item">
                <Thumb categoryId={b.items[0].categoryId} size="sm" />
                <div className="booking-item__main">
                  <strong>{b.items[0].name}{b.items.length > 1 ? ` + ${b.items.length - 1} more` : ''}</strong>
                  <span className="muted-sm"><Icon name="calendar" size={14} />{prettyDate(b.slot.date)}, {time12(b.slot.time)}</span>
                  <span className="muted-xs">{b.address.area} · {b.id}</span>
                </div>
                <div className="booking-item__side">
                  <StatusPill status={b.status} />
                  <span className="tnum">{inr(b.bill.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}
