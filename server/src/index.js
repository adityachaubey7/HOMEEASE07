import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { errorHandler } from './middleware/auth.js';

const app = express();
// CLIENT_ORIGIN may list several origins, comma-separated. localhost and 127.0.0.1 are treated as the same host.
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim()).filter(Boolean);
const allowed = new Set(origins.flatMap((o) => [o, o.replace('localhost', '127.0.0.1'), o.replace('127.0.0.1', 'localhost')]));
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.has(origin)) }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }));
app.use('/api', routes);
app.use((_req, res) => res.status(404).json({ message: 'Not found.' }));
app.use(errorHandler);

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homeease')
  .then(() => app.listen(port, () => console.log(`HomeEase API on http://localhost:${port}/api`)))
  .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
