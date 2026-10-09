/**
 * In-browser stand-in for MongoDB. Mirrors the server's controllers so the UI
 * behaves the same with or without a backend. Bookings persist in localStorage.
 */
import { categories, services, professionals, reviews, faqs, timeSlots, coupons, cities, rooms } from '@shared/catalog.js';
import { ApiError } from './http';

const BOOKINGS_KEY = 'homeease.bookings';
let memoryBookings = null;

function readBookings() {
  if (memoryBookings) return memoryBookings;
  try { memoryBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]'); } catch { memoryBookings = []; }
  return memoryBookings;
}
function writeBookings(list) {
  memoryBookings = list;
  try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list)); } catch { /* storage blocked: keep in memory */ }
}

const norm = (t) => t.toLowerCase().normalize('NFKD');

export const db = {
  cities: () => cities,
  rooms: () => rooms,
  categories: () => categories.map((c) => ({ ...c, serviceCount: services.filter((s) => s.categoryId === c.id).length, startsAt: Math.min(...services.filter((s) => s.categoryId === c.id && s.price > 0).map((s) => s.price)) })),
  category: (id) => {
    const c = categories.find((x) => x.id === id);
    if (!c) throw new ApiError('We couldn’t find that category.', 404);
    return { ...c, services: services.filter((s) => s.categoryId === id), faqs: [...(faqs[id] || []), ...faqs.common] };
  },
  services: ({ q, categoryId, minRating, maxPrice, maxDuration, sort, ids } = {}) => {
    let list = services.slice();
    if (ids) { const set = ids.split(','); list = set.map((i) => list.find((s) => s.id === i)).filter(Boolean); }
    if (categoryId) list = list.filter((s) => categoryId.split(',').includes(s.categoryId));
    if (q) {
      const terms = norm(q).split(/\s+/).filter(Boolean);
      list = list.filter((s) => {
        const cat = categories.find((c) => c.id === s.categoryId);
        const hay = norm([s.name, cat.name, cat.short, ...s.includes].join(' '));
        return terms.every((t) => hay.includes(t));
      });
    }
    if (minRating) list = list.filter((s) => s.rating >= Number(minRating));
    if (maxPrice) list = list.filter((s) => s.price <= Number(maxPrice));
    if (maxDuration) list = list.filter((s) => s.durationMins <= Number(maxDuration));
    const sorters = {
      popular: (a, b) => b.reviewCount - a.reviewCount,
      rating: (a, b) => b.rating - a.rating,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    };
    if (sort && sorters[sort]) list.sort(sorters[sort]);
    return list;
  },
  service: (id) => {
    const s = services.find((x) => x.id === id);
    if (!s) throw new ApiError('Service not found.', 404);
    return s;
  },
  pros: ({ categoryId, limit } = {}) => {
    let list = professionals.slice();
    if (categoryId) list = list.filter((p) => p.categoryIds.includes(categoryId));
    list.sort((a, b) => b.rating - a.rating);
    return limit ? list.slice(0, Number(limit)) : list;
  },
  pro: (id) => {
    const p = professionals.find((x) => x.id === id);
    if (!p) throw new ApiError('Professional not found.', 404);
    return { ...p, services: services.filter((s) => p.categoryIds.includes(s.categoryId)), reviews: reviews.filter((r) => r.proId === id) };
  },
  reviews: ({ categoryId, proId, limit } = {}) => {
    let list = reviews.slice();
    if (categoryId) list = list.filter((r) => r.categoryId === categoryId);
    if (proId) list = list.filter((r) => r.proId === proId);
    list.sort((a, b) => b.date.localeCompare(a.date));
    return limit ? list.slice(0, Number(limit)) : list;
  },
  availability: ({ date }) => {
    // Deterministic pseudo-availability so the same date always shows the same gaps.
    const seed = [...date].reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const now = new Date();
    const isToday = date === toISODate(now);
    return timeSlots.map((t, i) => {
      const hour = Number(t.slice(0, 2));
      const past = isToday && hour <= now.getHours() + 1;
      const full = (seed + i * 7) % 5 === 0;
      return { time: t, available: !past && !full, reason: past ? 'past' : full ? 'full' : null };
    });
  },
  validateCoupon: ({ code, subtotal }) => {
    const c = coupons.find((x) => x.code === String(code).trim().toUpperCase());
    if (!c) throw new ApiError('That code isn’t valid. Check the spelling or try EASE100.', 400);
    if (subtotal < c.minOrder) throw new ApiError(`Add ₹${c.minOrder - subtotal} more to use ${c.code}.`, 400);
    const discount = c.flat ?? Math.min(Math.round((subtotal * c.pct) / 100), c.maxOff);
    return { code: c.code, label: c.label, discount };
  },
  coupons: () => coupons,
  bookings: () => readBookings().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  booking: (id) => {
    const b = readBookings().find((x) => x.id === id);
    if (!b) throw new ApiError('Booking not found.', 404);
    return b;
  },
  createBooking: (payload) => {
    if (!payload.items?.length) throw new ApiError('Your cart is empty.', 400);
    if (!payload.address?.line1) throw new ApiError('Add an address for the visit.', 400);
    if (!payload.slot?.date || !payload.slot?.time) throw new ApiError('Choose a date and time.', 400);
    const pro = payload.proId
      ? professionals.find((p) => p.id === payload.proId)
      : professionals.find((p) => p.categoryIds.includes(payload.items[0].categoryId));
    const booking = {
      id: 'HE' + Date.now().toString(36).toUpperCase().slice(-6),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...payload,
      pro: pro ? { id: pro.id, name: pro.name, rating: pro.rating, tone: pro.tone } : null,
      otp: String(1000 + Math.floor(Math.random() * 9000)),
    };
    writeBookings([booking, ...readBookings()]);
    return booking;
  },
  updateBooking: (id, patch) => {
    const list = readBookings();
    const i = list.findIndex((x) => x.id === id);
    if (i < 0) throw new ApiError('Booking not found.', 404);
    list[i] = { ...list[i], ...patch, updatedAt: new Date().toISOString() };
    writeBookings([...list]);
    return list[i];
  },
};

export function toISODate(d) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
