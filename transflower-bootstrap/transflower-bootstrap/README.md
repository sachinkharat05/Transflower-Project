# Transflower - Full Stack Flower Store

Transflower is a flower e-commerce project with a **React + Vite + Bootstrap** frontend and a **Node.js + Express** API. It includes product browsing, user registration, login, cart handling, order placement, and a dashboard-style user flow.

The UI is a single-page application. The backend **only** exposes JSON APIs under `/api` (it no longer serves the old static HTML).

## Project Status

Ready to run locally with two processes:

- **Backend (API)**: `http://localhost:3000`
- **Frontend (Vite)**: `http://localhost:5173` (proxies `/api` to the backend during development)

## Features

- Home page with flower store design (including featured cards and testimonials)
- Product catalog with REST-backed products
- Login and registration pages
- Shopping cart workflow (guest `localStorage` cart merges on login)
- Checkout and order creation
- Dashboard page (`/dashboard`) for user/order display
- Node.js + Express REST API
- MySQL-backed cart and orders
- Demo users for quick testing

## Tech Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Frontend        | React 18, React Router, Bootstrap 5, Bootstrap Icons |
| Frontend build  | Vite                                              |
| Backend         | Node.js, Express                                   |
| API data        | MySQL                                             |
| Local browser   | localStorage                                       |
| Fonts           | Cormorant Garamond, DM Sans                       |

## Requirements

Recommended:

```text
Node.js 20 or newer
npm 10 or newer
```

Install **MySQL** for full API/catalog support.

## Quick Start

Install dependencies:

```bash
npm run install:all
```

Configure MySQL (see `.env.example` in `backend/`). Create `backend/.env` (example keys):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=transflower_user
DB_PASSWORD=transflower123
DB_NAME=transflower
```

Run schema/user setup scripts as documented in `docs/SETUP.md` (for example `backend/database/create-user.sql`).

Initialize / verify DB scripts (optional, depending on your workflow):

```bash
npm run db:init
npm run db:test
```

Start backend + frontend **in separate terminals**:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

API health:

```text
http://localhost:3000/api/health
```

## Demo Accounts

| Email              | Password |
| ------------------ | -------- |
| john@example.com   | pass123  |
| jane@example.com   | pass123  |

## Project Structure

```text
transflower-bootstrap/
├── README.md
├── package.json                     # Convenience scripts only
├── backend/
│   ├── package.json
│   ├── server.js                    # Express API entry
│   ├── database/
│   ├── scripts/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       └── seedData.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── image/                   # Product + marketing images
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── layouts/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── utils/
└── docs/
    ├── API.md
    └── SETUP.md
```

## Important Files

| File | Purpose |
| --- | --- |
| `backend/server.js` | Express API server |
| `backend/src/routes/*.js` | API route definitions |
| `backend/src/controllers/*.js` | API handlers |
| `backend/src/config/db.js` | MySQL pool / startup hooks |
| `frontend/src/services/transflowerApi.js` | Cart/auth/order API client (localStorage + `/api`) |
| `frontend/src/styles/app.css` | Global theme styles migrated from the old `style.css` |
| `docs/API.md` | REST API documentation |

## Backend API Summary

All API routes start with:

```text
/api
```

(See `docs/API.md` for full examples.)

## Data Storage

| Area | Storage |
| --- | --- |
| Logged-in session | Browser `localStorage` key `tf_currentUser` |
| Guest shopping cart | Browser `localStorage` key `tf_guest_cart` until login, then merged to MySQL |
| Products, users, carts, orders | MySQL database `transflower` via the Express API |

## Useful Commands

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
npm run start:backend
npm run check:backend
```

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Blank catalog / API errors | Ensure MySQL is running and `backend/.env` is correct; visit `/api/health`. |
| Port `3000` already in use | Stop the other server or set `PORT` in `backend/.env`. |
| Images not showing | Ensure files exist under `frontend/public/image/` (paths should match `backend/src/seedData.js`). |
| CORS issues (non-proxy setups) | Prefer the Vite dev proxy (`/api`). If you call a remote API origin, configure CORS on the backend. |

## Security Notes

This project is for learning and demo use. Before production: hash passwords, add real auth sessions/tokens, validate inputs strictly, and harden CORS.

## Documentation

- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)

## License

MIT License.
