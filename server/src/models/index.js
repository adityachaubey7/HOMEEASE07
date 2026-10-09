import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// `code` keeps the stable string id the client uses in URLs (e.g. "ac-foam-jet").
const toJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => { ret.id = ret.code ?? String(ret._id); delete ret._id; return ret; },
};

const SectionSchema = new Schema({ id: String, title: String }, { _id: false });

export const Category = model('Category', new Schema({
  code: { type: String, unique: true, index: true },
  name: String, short: String, icon: String, tone: String, tagline: String,
  rating: Number, bookings: Number, earliest: String,
  group: { type: String, enum: ['home', 'repair', 'beauty'] },
  sections: [SectionSchema],
}, { toJSON }));

export const Service = model('Service', new Schema({
  code: { type: String, unique: true, index: true },
  categoryId: { type: String, index: true },
  sectionId: String,
  name: { type: String, required: true },
  price: { type: Number, min: 0 }, mrp: Number, durationMins: Number,
  rating: Number, reviewCount: Number,
  includes: [String], excludes: [String],
  popular: Boolean, perUnit: String, quote: Boolean,
}, { toJSON }));

export const Professional = model('Professional', new Schema({
  code: { type: String, unique: true },
  name: String, categoryIds: [String], rating: Number, jobs: Number, years: Number,
  area: String, languages: [String], tone: String, bio: String, skills: [String], badges: [String],
  active: { type: Boolean, default: true },
}, { toJSON }));

export const Review = model('Review', new Schema({
  code: { type: String, unique: true },
  categoryId: { type: String, index: true }, proId: { type: String, index: true }, serviceId: String,
  bookingId: String, author: String, area: String,
  rating: { type: Number, min: 1, max: 5 }, date: String, text: String,
}, { toJSON }));

export const User = model('User', new Schema({
  phone: { type: String, unique: true, required: true },
  name: String,
  addresses: [{ label: String, line1: String, area: String, landmark: String, city: String, name: String }],
  otp: { code: String, expiresAt: Date },
}, { timestamps: true, toJSON }));

const BookingItem = new Schema({ id: String, name: String, price: Number, mrp: Number, durationMins: Number, categoryId: String, qty: Number }, { _id: false });

export const Booking = model('Booking', new Schema({
  code: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  userPhone: String,
  items: [BookingItem],
  address: { label: String, line1: String, area: String, landmark: String, city: String, name: String },
  slot: { date: String, time: String },
  proId: String,
  pro: { id: String, name: String, rating: Number, tone: String },
  payment: { type: String, enum: ['after', 'now'] },
  bill: { subtotal: Number, mrpTotal: Number, coupon: { code: String, discount: Number }, fee: Number, total: Number },
  status: { type: String, enum: ['confirmed', 'assigned', 'onway', 'started', 'completed', 'cancelled'], default: 'confirmed' },
  cancelReason: String,
  otp: String,
}, { timestamps: true, toJSON }));
