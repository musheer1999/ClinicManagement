# ClinicDesk — Clinic Management System

A full-stack clinic management system with patient records, visit tracking, PDF report cards, OTP login, and an admin subscription panel.

## Tech Stack
- **Frontend**: React (CRA), React Router v6, plain CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (raw SQL via `pg`)
- **Auth**: Email OTP + JWT in httpOnly cookie
- **PDF**: PDFKit

---

## Setup

### 1. PostgreSQL
```bash
createdb clinicdesk_db
psql -U postgres -d clinicdesk_db -f backend/database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
# Edit .env with your DB credentials and Gmail app password
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**, backend on **http://localhost:5000**.

---

## Environment Variables (backend/.env)

```
PORT=5000
CLIENT_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinicdesk_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password   # Gmail App Password (not your login password)
NODE_ENV=development
```

### Gmail App Password Setup
1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → App passwords
3. Generate a password for "Mail" → use that as `EMAIL_PASS`

---

## Default Admin
The admin email is set in `schema.sql`:
```sql
INSERT INTO admins (email) VALUES ('admin@clinicdesk.in');
```
Change this to your email before running the schema.

---

## Project Structure

```
clinicdesk/
├── backend/
│   ├── server.js
│   ├── database/schema.sql
│   └── src/
│       ├── config/         # DB connection
│       ├── routes/         # Route definitions
│       ├── controllers/    # req/res handlers
│       ├── services/       # Business logic
│       ├── repositories/   # SQL queries
│       ├── middleware/     # Auth + subscription
│       └── utils/          # JWT, email helpers
└── frontend/
    └── src/
        ├── pages/
        │   ├── auth/       # Login, Register
        │   ├── clinic/     # Dashboard, Patients, Visits, Settings
        │   └── admin/      # Admin panel pages
        ├── components/ui/  # Reusable UI components
        ├── context/        # AuthContext
        └── utils/          # apiCall helper
```

Each page follows the 3-file pattern:
- `index.js` — UI only
- `usePageName.js` — state & logic
- `usePageNameQuery.js` — API calls

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/request-otp | Send OTP to email |
| POST | /api/auth/verify-otp | Verify OTP → set JWT cookie |
| POST | /api/auth/register | Register new clinic |
| POST | /api/auth/logout | Clear cookie |
| GET | /api/auth/me | Current user |
| GET | /api/clinic/me | Clinic details |
| PUT | /api/clinic/me | Update clinic |
| GET | /api/patients | List patients (search by phone/ID) |
| POST | /api/patients | Add patient |
| GET | /api/patients/:id | Patient + visits |
| PUT | /api/patients/:id | Update patient |
| GET | /api/visits/dashboard | Dashboard stats |
| GET | /api/visits/today | Today's visits |
| POST | /api/visits | Create visit |
| GET | /api/visits/:id | Visit detail |
| GET | /api/visits/:id/pdf | Download PDF report |
| GET | /api/admin/clinics | All clinics |
| PUT | /api/admin/clinics/:id/subscription | Update subscription |
| GET | /api/admin/config | Global config |
| PUT | /api/admin/config | Update global config |
