# Mini Team Chat Application (Slack-like) – MERN + Socket.IO

This is a mini team chat application built with the MERN stack and Socket.IO.  
It supports:

- User signup & login (JWT-based)
- Channels (create, list, join, leave)
- Real-time messaging inside channels
- Online/offline user presence
- Message history with cursor-based pagination
- Deployed-ready structure (separate `server` and `client`)

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JSON Web Tokens (JWT)
- bcryptjs

### Frontend
- React
- Vite
- React Router
- Axios
- Socket.IO Client

---

## Local Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>.git
cd team-chat-mern
```

#### Backend

```bash
cd server
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Fill in:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

#### Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Overview

### Auth

- `POST /api/auth/signup` – Register
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Get current user

### Channels

- `GET /api/channels` – List channels
- `POST /api/channels` – Create channel
- `POST /api/channels/:id/join` – Join channel
- `POST /api/channels/:id/leave` – Leave channel

### Messages

- `GET /api/channels/:id/messages?limit=20&before=<ISO date>` – Paginated history
- Real-time via Socket.IO:
  - `send-message` – Send message
  - `new-message` – Broadcasted new message
  - `presence-update` – Online users

---

## Socket.IO Events (High Level)

Client → Server:
- `join-channel` – join a room for a channel
- `leave-channel` – leave a channel room
- `send-message` – send a message `{ channelId, text }`

Server → Client:
- `new-message` – a message was sent in the channel
- `presence-update` – list of online user IDs

---

## Assumptions & Limitations

- Presence is kept in-memory (resets when server restarts).
- JWT is stored in `localStorage` (simple for assignment, not ideal for production).
- No file uploads, only text messages.
- No private channels, typing indicators, or search yet (you can add as bonus).

---

## Deployment Notes

- Deploy backend (Render/Railway) and set ENV variables there.
- Deploy frontend (Vercel/Netlify) with env `VITE_API_URL` pointing to backend.
- Ensure CORS is configured correctly in backend (`CLIENT_ORIGIN`).

---

## How to Use This for Your Assignment

1. Push this project to your own GitHub repo.
2. Update README with:
   - Your name
   - Live URLs after deployment
   - Any extra features you add
3. Record the screen demo:
   - Signup/login
   - Create/join channels
   - Real-time chat in two browser windows
   - Online/offline presence
   - Pagination demo
4. Walk through structure and explain important files:
   - `server/src/index.js`, `routes/*`, `models/*`, Socket.IO logic.
   - `client/src/pages`, `components`, `context/AuthContext`, `hooks/useSocket`.
