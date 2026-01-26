# Contest Tracker (Codeforces Portfolio)

A focused dashboard for competitive programmers that brings Codeforces activity, teammates, and upcoming contests into one clean home base.

## Story

You open the app the way you open Codeforces: to compete. But instead of a blank dashboard, you see the people you practice with, the contests that are about to start, and the numbers that tell your story as a coder. The app feels like a team room: who is active, who is climbing, who needs a nudge. Your profile becomes your identity card, your stats become a map, and the upcoming contests become your next checkpoints. It is built for that small but powerful moment between practice and performance.

## Purpose and Role

Contest Tracker is a personal and team portfolio for Codeforces users. It helps you:
- track your own performance over time
- follow teammates and compare progress
- stay ready for upcoming contests
- keep profile and academic identity tied to your competitive handle

## Key Features

- Secure auth flow with register, login, and OTP-based password reset
- Profile creation with name, username, university, department, and Codeforces link
- Codeforces data aggregation (solved count, rating, contest participation, success rate)
- Dashboard with top performers, highest rated, and most active contestants
- Upcoming contest list with countdowns and formatted times
- Personal stats graph and quick summary cards
- Dark and light mode toggles
- Protected routes for the dashboard and profile

## Tech Stack

- Astro (server routes + static output)
- React + React Router (client-only SPA shell)
- Redux Toolkit + redux-persist (auth state)
- Tailwind CSS + shadcn/ui components
- MongoDB + Mongoose (users and profiles)
- JWT authentication
- Nodemailer + OTP flow for password resets
- D3 for stats visualization
- Codeforces API for contests and user stats

## App Flow

1) Register or login
2) Create your profile and attach your Codeforces handle
3) View your dashboard with stats, graph, and upcoming contests
4) Explore teammates and compare performance

## API Routes (Astro)

Auth
- `POST /api/register`
- `POST /api/login`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`

User
- `GET /api/userApi/allUser`
- `GET /api/userApi/[id]`
- `POST /api/userApi/profileCreate`
- `GET /api/userApi/codeforces?handle=...`
- `GET /api/userApi/upComingContest`

## Project Structure

```
.
+-- public/
+-- src/
�   +-- components/
�   �   +-- pages/         # login, register, profile, home
�   �   +-- ui/            # shared UI primitives
�   +-- pages/             # Astro pages + API routes
�   +-- lib/               # DB connection, Codeforces API helpers
�   +-- model/             # Mongoose schemas
�   +-- redux/             # auth store and slices
�   +-- styles/
+-- astro.config.mjs
+-- package.json
```

## Environment Variables

Create a `.env` file (see `.env.example`) and set:

```
MONGODB_URI=...
JWT_SECRET=...

# Email (OTP flow)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_FROM="Contest Tracker <noreply@yourapp.com>"
```

Optional
```
VITE_API_BASE_URL=...   # If hosting API separately
```

## Getting Started

```
pnpm install
pnpm dev
```

Then open `http://localhost:4321`.

## Scripts

- `pnpm dev` - start the dev server
- `pnpm build` - build to `dist/`
- `pnpm preview` - preview production build

## Deployment

This project ships well on Netlify, Vercel, or any Node-compatible platform that supports Astro server routes.

---
