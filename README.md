# Appointment Booking App

A Next.js web app for booking time slots with service providers at pre-defined shops. Authenticated users browse shops, pick a provider, and reserve an available hour, with a strict conflict guard that prevents the same `(shop, provider, time)` from being double-booked.

![screenshot](./docs/image%20copy.png)

## Stack

| Concern   | Tool                                                    |
| --------- | ------------------------------------------------------- |
| Framework | Next.js 16 (App Router, React 19, Turbopack)            |
| Language  | TypeScript                                              |
| Styling   | Tailwind CSS v4 + shadcn/ui                             |
| Auth      | Custom JWT sessions via `jose` (HttpOnly cookies)       |
| Database  | SQLite via Prisma 7 (using the `libsql` driver adapter) |

## Prerequisites

- **Node.js 20.9+** (Prisma 7 and Next.js 16 require it)
- **npm** (or a compatible package manager)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env

# Generate a strong random secret and paste it into .env as SESSION_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# 3. Create the local SQLite database and apply migrations
npx prisma migrate deploy
```

## Run locally

```bash
npm run dev
```

Visit http://localhost:3000.

### Trying the app

1. On the landing page, click **Create account** and sign up with any email + password (min 6 chars).
2. After signup you're redirected to `/shops`.
3. Pick a shop -> pick a provider -> click any time slot to book it.
4. Booked slots are disabled and struck through. A toast confirms the booking.
5. Try booking the same slot twice, the second attempt returns a conflict toast.
6. Book the **same time** with a **different provider** -> allowed, because conflict is per-provider.
7. Click **Log out** in the navbar; `/shops` will redirect you back to `/login`.

### Seeded data

Three shops are hardcoded in `lib/shops.ts` as requested by the task:

- **Serene Cuts**: Alice, Bob
- **Glow Spa**: Diana, Femi, Carla
- **Peak Physio**: Dr. Hakim, Dr. Park

Each provider has availability from **09:00 to 22:00** in hourly slots (14 slots per day).

## Project structure

```
app/
  layout.tsx                            Root layout with Navbar + Toaster
  page.tsx                              Landing page (redirects to /shops when logged in)
  login/page.tsx, signup/page.tsx       Auth pages
  shops/
    page.tsx                            Shop grid
    [shopId]/page.tsx                   Provider cards
    [shopId]/[providerId]/page.tsx      Slot picker page
  actions/auth.ts                       signup / login / logout Server Actions
  api/bookings/route.ts                 GET + POST booking endpoints
components/
  auth/                                 Login/signup forms + shared shell
  booking/slot-picker.tsx               Client component: grid + fetch + toasts
  nav/                                  Navbar + logout button
  ui/                                   shadcn primitives (Button, Input, Card, Sonner, ...)
lib/
  jwt.ts                                Pure JWT encrypt/decrypt (no cookies), proxy-safe
  session.ts                            Cookie-bound session API (createSession / getSession / deleteSession)
  auth-validation.ts                    Email / password / name validators
  booking-validation.ts                 POST /api/bookings body validator
  shops.ts                              Hardcoded shops + generateSlots()
  users.ts                              Prisma wrapper: findUserByEmail / createUser / verifyPassword
  bookings.ts                           Prisma wrapper: getBookingsForProvider / createBooking
  db.ts                                 Prisma client singleton
prisma/
  schema.prisma                         User + Booking models (@@unique constraint)
proxy.ts                                Route protection (redirects /shops when unauthenticated)
```

## API reference

### `GET /api/bookings?shopId=<id>&providerId=<id>`

Returns the list of booked times for a provider.

- **200**: `[{ "time": "10:00" }, ...]`
- **400**: missing query params

Public -> no auth required.

### `POST /api/bookings`

Creates a booking for the authenticated user.

Body: `{ "shopId": string, "providerId": string, "time": string }` (time must be `"HH:00"` between `09:00` and `22:00`).

- **201**: `{ "id": "...", "shopId": "...", "providerId": "...", "time": "..." }`
- **400**: invalid body / unknown shop or provider / invalid time
- **401**: no session
- **409**: slot already booked for this (shop, provider, time)

The conflict guard is enforced at the database level via a `@@unique([shopId, providerId, time])` constraint plus Prisma's `P2002` error code, so concurrent requests are handled atomically without a read-then-write race.

## Useful commands

```bash
npx prisma studio       # GUI for the local SQLite DB
npx prisma migrate dev  # create a new migration after schema changes
npx tsc --noEmit        # type-check without emitting
```

## Notes on Next.js 16

This codebase uses Next.js 16 conventions, which differ from older versions:

- Route protection lives in `proxy.ts` (formerly `middleware.ts`) and exports a `proxy` function.
- `cookies()`, `headers()`, and dynamic route `params` all return Promises and must be `await`ed.
- Turbopack is the default bundler in both `dev` and `build`.
