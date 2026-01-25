# Codeforces Contest Tracker

A full-stack contest tracking dashboard built with Astro + React. It provides user authentication, profile management, and Codeforces contest and rating insights. The app ships with serverless API routes and uses MongoDB as the database.

## Features
- User registration and login with JWT-based auth
- Profile creation and user management
- Codeforces data integration (contest list, user stats, rating graph)
- Dashboard UI with tabs, search, and charts
- Password reset flow (OTP email)
- Redux state management with persistence

## Tech Stack
- Astro 5 (server output) with React
- Tailwind CSS and Radix UI components
- Redux Toolkit + redux-persist
- MongoDB + Mongoose
- Netlify adapter (serverless SSR/API)
- D3 for rating charts

## Project Structure
```
src/
  components/           # React UI and pages
  layouts/              # App shell and theme
  pages/
    api/                # Serverless API routes
  lib/                  # DB connection and helpers
  model/                # Mongoose models
  redux/                # Store + slices
```

## Environment Variables
Create a `.env` file (or set in Netlify) with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret

# Email/OTP (optional, for password reset)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM="My App <noreply@example.com>"
```

If you build the frontend against a separate API host, you can also set:
```
VITE_API_BASE_URL=https://your-site.netlify.app
```

## Scripts
```
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## API Routes (serverless)
These live under `src/pages/api/` and are deployed as Netlify functions:
- `POST /api/register`
- `POST /api/login`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `GET  /api/userApi/allUser`
- `GET  /api/userApi/codeforces`
- `POST /api/userApi/profileCreate`
- `GET  /api/userApi/[id]`

## Deployment
This project is configured for Netlify via `@astrojs/netlify`. Ensure the environment variables above are set in Netlify, then deploy the build output.
