# Lost & Found Item Management System

MERN stack project created for the `AI Driven Full Stack Development (AI308B)` MSE-2 exam.

## Structure

- `backend` - Node.js, Express, MongoDB, JWT authentication
- `frontend` - React + Vite client
- `PROJECT_REPORT.md` - submission report template to convert into PDF later

## Backend Setup

1. Open `backend/.env` and update the values if needed.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Main Features

- User registration and login with hashed password
- JWT authentication
- Add, list, search, update, and delete lost/found items
- Protected dashboard route
- Local storage based login session
- Logout handling

## Deployment Notes

Deployment to GitHub and Render requires your account credentials and live environment variables. The project is prepared for deployment, and the report template includes sections for adding those final links and screenshots.
