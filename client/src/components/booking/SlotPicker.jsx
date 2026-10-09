import { useEffect, useMemo, useState } from 'react';
import { Button, Skeleton } from '@/components/ui';
import { bookingApi } from '@/services/api';
import { toISODate } from '@/services/mockDb';
import { prettyDate, time12 } from '@/utils/format';

export function nextDays(n = 7) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) { out.push(toISODate(d)); d.setDate(d.getDate() + 1); }
  return out;
}

export default function SlotPicker({ value, onSave, categoryId }) {
  const days = useMemo(() => nextDays(7), []);
  const [date, setDate] = useState(value?.date || days[0]);
  const [time, setTime] = useState(value?.time || '');
  const [slots, setSlots] = useState(null);

  useEffect(() => {
    setSlots(null);
    let live = true;
    bookingApi.availability(date, categoryId).then((s) => live && setSlots(s));
    return () => { live = false; };
  }, [date, categoryId]);

  const groups = [
    { label: 'Morning', test: (h) => h < 12 },
    { label: 'Afternoon', test: (h) => h >= 12 && h < 16 },
    { label: 'Evening', test: (h) => h >= 16 },
  ];

  return (
    <div className="slot-picker">
      <p className="field__label">When should the professional arrive?</p>
      <div className="date-strip" role="radiogroup" aria-label="Date">
        {days.map((d, i) => {
          const [wd, day] = [prettyDate(d, { weekday: 'short' }), prettyDate(d, { day: 'numeric' })];
          return (
            <button key={d} role="radio" aria-checked={d === date} className={`date-chip ${d === date ? 'is-active' : ''}`} onClick={() => { setDate(d); setTime(''); }}>
              <small>{i === 0 ? 'Today' : i === 1 ? 'Tmrw' : wd}</small>
              <strong>{day}</strong>
            </button>
          );
        })}
      </div>
      {!slots ? (
        <div className="slot-grid">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h={44} r={10} />)}</div>
      ) : slots.every((s) => !s.available) ? (
        <p className="notice">No slots left on this day. Pick another date.</p>
      ) : (
        groups.map((g) => {
          const list = slots.filter((s) => g.test(Number(s.time.slice(0, 2))));
          if (!list.length) return null;
          return (
            <div key={g.label} className="slot-group">
              <p className="muted-xs">{g.label}</p>
              <div className="slot-grid" role="radiogroup" aria-label={`${g.label} slots`}>
                {list.map((s) => (
                  <button
                    key={s.time}
                    role="radio"
                    aria-checked={time === s.time}
                    disabled={!s.available}
                    className={`slot ${time === s.time ? 'is-active' : ''}`}
                    onClick={() => setTime(s.time)}
                    title={s.reason === 'full' ? 'Fully booked' : s.reason === 'past' ? 'Too soon' : undefined}
                  >
                    {time12(s.time)}
                    {s.reason === 'full' && <small>Full</small>}
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
      <Button disabled={!time} onClick={() => onSave({ date, time })}>{time ? `Continue with ${time12(time)}` : 'Choose a time'}</Button>
    </div>
  );
}

