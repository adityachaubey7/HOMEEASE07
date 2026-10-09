export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export function compact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K';
  return String(n);
}

export function duration(mins) {
  if (mins >= 1440) return `${Math.round(mins / 480)} days`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} mins`;
  return m ? `${h} hr ${m} mins` : `${h} hr${h > 1 ? 's' : ''}`;
}

export const time12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
};

export function prettyDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-IN', opts);
}

export const discountPct = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');
