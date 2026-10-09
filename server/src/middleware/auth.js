import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!token) return res.status(401).json({ message: 'Log in to continue.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Log in again.' });
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function errorHandler(err, _req, res, _next) {
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Something went wrong on our side. Please try again.' : err.message });
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
