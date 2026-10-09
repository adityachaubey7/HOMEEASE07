import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, Professional, Review, Service } from './models/index.js';
import { categories, professionals, reviews, services } from '../../shared/catalog.js';

const withCode = ({ id, ...rest }) => ({ code: id, ...rest });

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homeease');
await Promise.all([Category.deleteMany(), Service.deleteMany(), Professional.deleteMany(), Review.deleteMany()]);
await Category.insertMany(categories.map(withCode));
await Service.insertMany(services.map(withCode));
await Professional.insertMany(professionals.map(withCode));
await Review.insertMany(reviews.map(withCode));
console.log(`Seeded ${categories.length} categories, ${services.length} services, ${professionals.length} professionals, ${reviews.length} reviews.`);
await mongoose.disconnect();
