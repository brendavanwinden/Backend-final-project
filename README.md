# Booking API

RESTful back-end for an online booking app, built with Express.js and Prisma (SQLite).
Resources: users, hosts, properties, bookings and reviews, with JWT login.

## Setup

1. `npm install`
2. Create a `.env` file:
   ```
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET_KEY="your-secret"
   SENTRY_DSN="your-sentry-dsn"
   ```
3. `npm run reset-db` (creates the database and seeds it)
4. `npm run dev` (server on http://localhost:3000)

## Tests

`npm test` runs the provided Postman tests (positive, then negative).
Run `npm run reset-db` before every test run, because the tests change data.

## Endpoints

| Resource | Routes |
|---|---|
| Login | `POST /login` |
| Users | `GET/POST /users`, `GET/PUT/DELETE /users/:id`, filters `?username=` `?email=` |
| Hosts | `GET/POST /hosts`, `GET/PUT/DELETE /hosts/:id`, filter `?name=` |
| Properties | `GET/POST /properties`, `GET/PUT/DELETE /properties/:id`, filters `?location=` `?pricePerNight=` |
| Bookings | `GET/POST /bookings`, `GET/PUT/DELETE /bookings/:id`, filter `?userId=` |
| Reviews | `GET/POST /reviews`, `GET/PUT/DELETE /reviews/:id` |

`POST`, `PUT` and `DELETE` require a token in the `Authorization` header (get one from `POST /login`). `GET` routes are public.

## Notes

- Status codes: 200, 201, 400 (invalid input), 401 (no or invalid token / credentials), 404 (not found), 500 (unexpected error).
- Request durations are logged by a logging middleware.
- Unhandled errors are caught by an error handler and reported to Sentry.
- Passwords are never returned by the API.
- Deleting a user, host or property also deletes the related records (cascade).
- Because the SQLite setup uses `relationMode = "prisma"`, the API itself checks that referenced users, hosts and properties exist.
- Passwords are stored and compared as plain text, as in the provided seed data. In a production app they would be hashed (for example with bcrypt).
- The route files are intentionally similar to keep each resource easy to read; a shared helper could reduce the duplication.