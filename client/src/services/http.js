/**
 * Thin fetch wrapper for the Express API.
 * Every service module calls `http` when VITE_API_URL is set, and falls back to
 * the in-browser mock database otherwise. Swapping to the real backend is a
 * one-line env change; no component code changes.
 */
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const USE_MOCK = !API_URL;

const TOKEN_KEY = 'homeease.token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token) {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ }
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function http(path, { method = 'GET', body, params } = {}) {
  const url = new URL(API_URL + path, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && url.searchParams.set(k, v));
  const token = getToken();
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'Something went wrong. Please try again.', res.status, data);
  return data;
}

/** Simulated network latency for the mock layer, so loading states are real. */
export const delay = (ms = 260) => new Promise((r) => setTimeout(r, ms));
