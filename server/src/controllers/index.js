import jwt from 'jsonwebtoken';
import { Booking, Category, Professional, Review, Service, User } from '../models/index.js';
import { HttpError } from '../middleware/auth.js';
import { cities, coupons, faqs, rooms, timeSlots } from '../../../shared/catalog.js';

/* ---------- Catalog ---------- */
export const listCities = async (_req, res) => res.json(cities);
export const listRooms = async (_req, res) => res.json(rooms);

export async function listCategories(_req, res) {
  const [cats, services] = await Promise.all([
    Category.find().lean(),
    Service.find({}, { categoryId: 1, price: 1 }).lean(),
  ]);
  res.json(cats.map(({ _id, __v, code, ...c }) => {
    const own = services.filter((s) => s.categoryId === code);
    const paid = own.map((s) => s.price).filter((p) => p > 0);
    return { ...c, id: code, serviceCount: own.length, startsAt: paid.length ? Math.min(...paid) : 0 };
  }));
}

export async function getCategory(req, res) {
  const cat = await Category.findOne({ code: req.params.id });
  if (!cat) throw new HttpError(404, 'We couldn’t find that category.');
  const services = await Service.find({ categoryId: cat.code });
  res.json({ ...cat.toJSON(), services: services.map((s) => s.toJSON()), faqs: [...(faqs[cat.code] || []), ...faqs.common] });
}

const SORTS = { popular: { reviewCount: -1 }, rating: { rating: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 } };

export async function listServices(req, res) {
  const { q, categoryId, minRating, maxPrice, maxDuration, sort, ids } = req.query;
  const filter = {};
  if (ids) filter.code = { $in: ids.split(',') };
  if (categoryId) filter.categoryId = { $in: categoryId.split(',') };
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };
  if (maxDuration) filter.durationMins = { $lte: Number(maxDuration) };
  if (q) {
    // Every word must appear (as a substring) in the name, the inclusions or the category name,
    // so "clean" finds "Cleaning" and "ac service" finds "Foam-jet AC service".
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cats = await Category.find().lean();
    filter.$and = q.trim().split(/\s+/).map((t) => {
      const re = new RegExp(esc(t), 'i');
      const catIds = cats.filter((c) => re.test(c.name) || re.test(c.short)).map((c) => c.code);
      return { $or: [{ name: re }, { includes: re }, { categoryId: { $in: catIds } }] };
    });
  }
  const services = await Service.find(filter).sort(SORTS[sort] || {}).limit(100);
  res.json(services.map((s) => s.toJSON()));
}

export async function getService(req, res) {
  const s = await Service.findOne({ code: req.params.id });
  if (!s) throw new HttpError(404, 'Service not found.');
  res.json(s.toJSON());
}

/* ---------- Professionals & reviews ---------- */
export async function listPros(req, res) {
  const filter = { active: true };
  if (req.query.categoryId) filter.categoryIds = req.query.categoryId;
  const pros = await Professional.find(filter).sort({ rating: -1 }).limit(Number(req.query.limit) || 50);
  res.json(pros.map((p) => p.toJSON()));
}

export async function getPro(req, res) {
  const pro = await Professional.findOne({ code: req.params.id });
  if (!pro) throw new HttpError(404, 'Professional not found.');
  const [services, reviews] = await Promise.all([
    Service.find({ categoryId: { $in: pro.categoryIds } }),
    Review.find({ proId: pro.code }).sort({ date: -1 }).limit(20),
  ]);
  res.json({ ...pro.toJSON(), services: services.map((s) => s.toJSON()), reviews: reviews.map((r) => r.toJSON()) });
}

export async function listReviews(req, res) {
  const filter = {};
  if (req.query.categoryId) filter.categoryId = req.query.categoryId;
  if (req.query.proId) filter.proId = req.query.proId;
  const reviews = await Review.find(filter).sort({ date: -1 }).limit(Number(req.query.limit) || 20);
  res.json(reviews.map((r) => r.toJSON()));
}

/* ---------- Auth (phone + OTP) ---------- */
export async function requestOtp(req, res) {
  const { phone } = req.body;
  if (!/^[6-9]\d{9}$/.test(phone || '')) throw new HttpError(400, 'Enter a 10-digit Indian mobile number.');
  const code = String(1000 + Math.floor(Math.random() * 9000));
  await User.findOneAndUpdate({ phone }, { phone, otp: { code, expiresAt: new Date(Date.now() + 5 * 60e3) } }, { upsert: true });
  // TODO: send `code` via your SMS provider. Logged for local development only.
  if (process.env.NODE_ENV !== 'production') console.log(`OTP for ${phone}: ${code}`);
  res.json({ sent: true });
}

export async function verifyOtp(req, res) {
  const { phone, code } = req.body;
  const user = await User.findOne({ phone });
  if (!user?.otp?.code || user.otp.code !== code || user.otp.expiresAt < new Date()) throw new HttpError(400, 'That code doesn’t match or has expired. Request a new one.');
  user.otp = undefined;
  await user.save();
  const token = jwt.sign({ uid: String(user._id), phone }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: String(user._id), phone: user.phone, name: user.name || '' } });
}

/* ---------- Coupons ---------- */
export const listCoupons = async (_req, res) => res.json(coupons);

function priceCoupon(code, subtotal) {
  const c = coupons.find((x) => x.code === String(code || '').trim().toUpperCase());
  if (!c) throw new HttpError(400, 'That code isn’t valid.');
  if (subtotal < c.minOrder) throw new HttpError(400, `Add ₹${c.minOrder - subtotal} more to use ${c.code}.`);
  return { code: c.code, label: c.label, discount: c.flat ?? Math.min(Math.round((subtotal * c.pct) / 100), c.maxOff) };
}
export const validateCoupon = async (req, res) => res.json(priceCoupon(req.body.code, Number(req.body.subtotal)));

/* ---------- Bookings ---------- */
export async function availability(req, res) {
  const { date } = req.query;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new HttpError(400, 'Pass a date as YYYY-MM-DD.');
  const taken = await Booking.aggregate([
    { $match: { 'slot.date': date, status: { $ne: 'cancelled' } } },
    { $group: { _id: '$slot.time', n: { $sum: 1 } } },
  ]);
  const capacity = 5; // simple per-slot capacity; replace with real pro schedules
  const full = new Set(taken.filter((t) => t.n >= capacity).map((t) => t._id));
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  res.json(timeSlots.map((time) => {
    const past = date === today && Number(time.slice(0, 2)) <= now.getHours() + 1;
    return { time, available: !past && !full.has(time), reason: past ? 'past' : full.has(time) ? 'full' : null };
  }));
}

export async function createBooking(req, res) {
  const { items, address, slot, proId, payment, coupon } = req.body;
  if (!items?.length) throw new HttpError(400, 'Your cart is empty.');
  if (!address?.line1) throw new HttpError(400, 'Add an address for the visit.');
  if (!slot?.date || !slot?.time) throw new HttpError(400, 'Choose a date and time.');

  // Never trust client prices: re-price from the database.
  const services = await Service.find({ code: { $in: items.map((i) => i.id) } });
  const lines = items.map((i) => {
    const s = services.find((x) => x.code === i.id);
    if (!s) throw new HttpError(400, `“${i.name}” is no longer available.`);
    return { id: s.code, name: s.name, price: s.price, mrp: s.mrp, durationMins: s.durationMins, categoryId: s.categoryId, qty: Math.max(1, Number(i.qty) || 1) };
  });
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const mrpTotal = lines.reduce((a, l) => a + Math.max(l.mrp, l.price) * l.qty, 0);
  const applied = (coupon?.code || req.body.bill?.coupon?.code) ? priceCoupon(coupon?.code || req.body.bill.coupon.code, subtotal) : null;
  const fee = 49;
  const total = Math.max(0, subtotal - (applied?.discount || 0) + fee);

  const pro = proId
    ? await Professional.findOne({ code: proId })
    : await Professional.findOne({ categoryIds: lines[0].categoryId, active: true }).sort({ rating: -1 });

  const booking = await Booking.create({
    code: 'HE' + Date.now().toString(36).toUpperCase().slice(-6),
    user: req.user.uid, userPhone: req.user.phone,
    items: lines, address, slot, proId: proId || null, payment,
    pro: pro ? { id: pro.code, name: pro.name, rating: pro.rating, tone: pro.tone } : undefined,
    bill: { subtotal, mrpTotal, coupon: applied ? { code: applied.code, discount: applied.discount } : undefined, fee, total },
    otp: String(1000 + Math.floor(Math.random() * 9000)),
  });
  res.status(201).json(booking.toJSON());
}

export async function listBookings(req, res) {
  const list = await Booking.find({ user: req.user.uid }).sort({ createdAt: -1 });
  res.json(list.map((b) => b.toJSON()));
}

async function ownBooking(req) {
  const b = await Booking.findOne({ code: req.params.id, user: req.user.uid });
  if (!b) throw new HttpError(404, 'Booking not found.');
  return b;
}

export async function getBooking(req, res) { res.json((await ownBooking(req)).toJSON()); }

export async function cancelBooking(req, res) {
  const b = await ownBooking(req);
  if (b.status === 'completed') throw new HttpError(400, 'Completed bookings can’t be cancelled.');
  b.status = 'cancelled'; b.cancelReason = req.body.reason;
  await b.save();
  res.json(b.toJSON());
}

export async function rescheduleBooking(req, res) {
  const b = await ownBooking(req);
  if (b.status !== 'confirmed') throw new HttpError(400, 'Only upcoming bookings can be rescheduled.');
  b.slot = req.body.slot;
  await b.save();
  res.json(b.toJSON());
}
