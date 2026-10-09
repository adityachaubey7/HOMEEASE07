import { Router } from 'express';
import * as c from '../controllers/index.js';
import { asyncHandler as h, requireAuth } from '../middleware/auth.js';

const r = Router();

// Catalog (public)
r.get('/cities', h(c.listCities));
r.get('/rooms', h(c.listRooms));
r.get('/categories', h(c.listCategories));
r.get('/categories/:id', h(c.getCategory));
r.get('/services', h(c.listServices));
r.get('/services/:id', h(c.getService));
r.get('/professionals', h(c.listPros));
r.get('/professionals/:id', h(c.getPro));
r.get('/reviews', h(c.listReviews));

// Auth
r.post('/auth/otp', h(c.requestOtp));
r.post('/auth/verify', h(c.verifyOtp));

// Pricing
r.get('/coupons', h(c.listCoupons));
r.post('/coupons/validate', h(c.validateCoupon));

// Bookings (signed-in)
r.get('/bookings/availability', h(c.availability));
r.get('/bookings', requireAuth, h(c.listBookings));
r.post('/bookings', requireAuth, h(c.createBooking));
r.get('/bookings/:id', requireAuth, h(c.getBooking));
r.patch('/bookings/:id/cancel', requireAuth, h(c.cancelBooking));
r.patch('/bookings/:id/reschedule', requireAuth, h(c.rescheduleBooking));

export default r;
