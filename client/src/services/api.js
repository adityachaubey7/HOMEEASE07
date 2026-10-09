/**
 * Public API surface used by components and hooks.
 * Each function maps 1:1 to an Express route (see server/src/routes) and
 * falls back to the mock database when no API URL is configured.
 */
import { http, delay, USE_MOCK, setToken } from './http';
import { db } from './mockDb';

const mock = async (fn, ms) => { await delay(ms); return fn(); };

export const catalogApi = {
  cities: () => (USE_MOCK ? mock(db.cities, 0) : http('/cities')),
  rooms: () => (USE_MOCK ? mock(db.rooms, 0) : http('/rooms')),
  categories: () => (USE_MOCK ? mock(db.categories, 120) : http('/categories')),
  category: (id) => (USE_MOCK ? mock(() => db.category(id)) : http(`/categories/${id}`)),
  services: (params = {}) => (USE_MOCK ? mock(() => db.services(params), 200) : http('/services', { params })),
  service: (id) => (USE_MOCK ? mock(() => db.service(id)) : http(`/services/${id}`)),
};

export const proApi = {
  list: (params = {}) => (USE_MOCK ? mock(() => db.pros(params)) : http('/professionals', { params })),
  get: (id) => (USE_MOCK ? mock(() => db.pro(id)) : http(`/professionals/${id}`)),
};

export const reviewApi = {
  list: (params = {}) => (USE_MOCK ? mock(() => db.reviews(params)) : http('/reviews', { params })),
};

export const bookingApi = {
  availability: (date, categoryId) => (USE_MOCK ? mock(() => db.availability({ date }), 180) : http('/bookings/availability', { params: { date, categoryId } })),
  validateCoupon: (code, subtotal) => (USE_MOCK ? mock(() => db.validateCoupon({ code, subtotal }), 300) : http('/coupons/validate', { method: 'POST', body: { code, subtotal } })),
  coupons: () => (USE_MOCK ? mock(db.coupons, 0) : http('/coupons')),
  create: (payload) => (USE_MOCK ? mock(() => db.createBooking(payload), 700) : http('/bookings', { method: 'POST', body: payload })),
  list: () => (USE_MOCK ? mock(db.bookings) : http('/bookings')),
  get: (id) => (USE_MOCK ? mock(() => db.booking(id)) : http(`/bookings/${id}`)),
  cancel: (id, reason) => (USE_MOCK ? mock(() => db.updateBooking(id, { status: 'cancelled', cancelReason: reason })) : http(`/bookings/${id}/cancel`, { method: 'PATCH', body: { reason } })),
  reschedule: (id, slot) => (USE_MOCK ? mock(() => db.updateBooking(id, { slot, status: 'confirmed' })) : http(`/bookings/${id}/reschedule`, { method: 'PATCH', body: { slot } })),
};

export const authApi = {
  requestOtp: async (phone) => {
    if (USE_MOCK) { await delay(500); return { sent: true, hint: '1234' }; }
    return http('/auth/otp', { method: 'POST', body: { phone } });
  },
  verifyOtp: async (phone, code) => {
    if (USE_MOCK) {
      await delay(500);
      if (code !== '1234') throw new Error('That code doesn’t match. In this demo the code is 1234.');
      const user = { id: 'u-' + phone.slice(-4), phone, name: '' };
      setToken('demo-token');
      return { user, token: 'demo-token' };
    }
    const res = await http('/auth/verify', { method: 'POST', body: { phone, code } });
    setToken(res.token);
    return res;
  },
  logout: () => setToken(null),
};
