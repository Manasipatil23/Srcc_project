# SRCC Appointment System — Deployment Options (LAN vs Internet)

This answers the question raised by SRCC: *"Whether the system is intended to run on a LAN, or whether users will be able to access it remotely via internet."*

The system supports **both** modes. It is currently configured for LAN use, which is the recommended starting point.

## Option A — LAN deployment (recommended to start)

All components (MongoDB, backend API, frontend) run on one machine at the SRCC centre. Staff and reception desks access it from any computer or tablet on the same office network.

- The frontend dev server listens on all network interfaces (`server.host: true` in `frontend/vite.config.js`).
- The backend Express server already listens on all interfaces (port 5001).
- The frontend automatically calls the API on whichever host served the page, so no per-machine configuration is needed.

**To use from another machine on the LAN:** find the server machine's IP (e.g. `192.168.1.50` via `ipconfig`) and open `http://192.168.1.50:5173` in a browser. Allow ports 5173 and 5001 through Windows Firewall on the server machine.

Pros: patient data never leaves the premises, no hosting cost, works even if the internet connection is down.
Cons: not reachable from home / other branches; patients cannot self-book from outside.

## Option B — Internet deployment

If SRCC wants remote access (therapists checking schedules from home, patients booking online), the same codebase can be hosted on a cloud VM or platform:

1. Build the frontend (`npm run build` in `frontend/`) and serve the static files (e.g. Nginx, or a static host).
2. Run the backend (`npm start` in `backend/`) behind HTTPS (reverse proxy such as Nginx + Let's Encrypt).
3. Use a managed MongoDB (MongoDB Atlas) or a secured self-hosted instance.
4. Set `VITE_API_URL` at build time to the public API URL, and set strong values for `JWT_SECRET` in `backend/.env`.

Additional requirements before going public: HTTPS everywhere, rate limiting, database backups, and a review of authorization rules (role checks on admin/accounts endpoints), since the system holds children's health and payment records.

## Hybrid

A common middle path: run on the LAN for daily operations, and expose it later through a VPN for staff remote access — this keeps the security profile of Option A while allowing trusted remote users.

## Environment variables (backend/.env)

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | API port | `5001` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/srcc` |
| `JWT_SECRET` | Token signing secret (change in production) | long random string |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
