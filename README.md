<<<<<<< HEAD
# HomeEase

A home services marketplace: browse by category or by room, add services to a cart, pick an address, slot and professional, and book. Built with React (Vite) and an Express + MongoDB API skeleton.

## Run it

```bash
# Frontend only, on built-in mock data (no backend needed)
cd client
npm install
npm run dev            # http://localhost:5173
```

Login in mock mode accepts any valid Indian mobile number with OTP `1234`. Coupons: `EASE100`, `FIRST15`.

```bash
# With the real API
cd server
cp .env.example .env    # set MONGODB_URI and JWT_SECRET
npm install
npm run seed            # loads shared/catalog.js into MongoDB
npm run dev             # http://localhost:5000/api

cd ../client
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

`npm run build:preview` produces a single self-contained HTML file in `client/dist-preview/` (in-memory routing), used for the hosted preview.

## Structure

```
shared/catalog.js          Seed data used by both client mocks and the Mongo seed script
client/src/
  services/http.js         fetch wrapper, token storage, USE_MOCK switch
  services/api.js          catalogApi, proApi, reviewApi, bookingApi, authApi (1:1 with Express routes)
  services/mockDb.js       in-browser stand-in for the controllers
  context/AppProviders.jsx cart (useReducer + localStorage), auth, city, toasts
  hooks/useAsync.js        data loading, debounce, media queries
  components/ui            Button, Rating, Price, AddToCart stepper, Thumb, Modal, Accordion…
  components/layout        Header, SearchBox (live suggestions, keyboard nav), Footer, MobileNav, AuthModal
  components/home          RoomExplorer (interactive house)
  components/service       ServiceCard, ServiceRow, ProCard, ReviewCard, RatingBreakdown
  components/booking       CartPanel / CartBar, SlotPicker
  pages/                   Home, Search, Category, Professional, Checkout, BookingDetail, Bookings, JoinPro
  styles/                  tokens.css (light + dark), base, components, pages
server/src/
  models/                  Category, Service, Professional, Review, User, Booking
  controllers/ routes/     REST API below
  middleware/auth.js       JWT auth, async + error handling
```

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/api/categories` | with `serviceCount`, `startsAt` |
| GET | `/api/categories/:id` | category + services + FAQs |
| GET | `/api/services?q=&categoryId=&minRating=&maxPrice=&maxDuration=&sort=` | sort: `popular`, `rating`, `price-asc`, `price-desc` |
| GET | `/api/professionals?categoryId=&limit=` · `/api/professionals/:id` | profile includes services and reviews |
| GET | `/api/reviews?categoryId=&proId=&limit=` | |
| POST | `/api/auth/otp` · `/api/auth/verify` | phone + OTP, returns JWT |
| POST | `/api/coupons/validate` | `{ code, subtotal }` |
| GET | `/api/bookings/availability?date=YYYY-MM-DD` | slot list with `available` and `reason` |
| GET/POST | `/api/bookings` | auth; server re-prices items from the database |
| GET | `/api/bookings/:id` | auth |
| PATCH | `/api/bookings/:id/cancel` · `/api/bookings/:id/reschedule` | auth |

## Next steps for production

- Send OTPs through an SMS provider (`requestOtp` logs the code in development).
- Replace the per-slot capacity in `availability` with real professional schedules.
- Add a payment gateway for "Pay now" and webhook-driven booking status updates.
- Swap the illustrated thumbnails (`Thumb`) for real photography once you have licensed images.
=======
# HOMEEASE07
>>>>>>> 89d2050bd70a1d7cdd7569484f78d40654cdc826
