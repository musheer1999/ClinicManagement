# ClinicDesk — Multi-Tenant SaaS Clinic Management System

> 🚀 **This is my most recent project.** Currently in active development — live deployment coming very soon.

![Status](https://img.shields.io/badge/Status-In%20Development-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-informational)
![Auth](https://img.shields.io/badge/Auth-OTP%20%2B%20JWT-green)
![Architecture](https://img.shields.io/badge/Architecture-Multi--Tenant%20SaaS-orange)

---

## What is ClinicDesk?

ClinicDesk is a full-stack, production-ready **SaaS platform** that enables clinics to completely digitize their patient management workflow. Built for the Indian healthcare market, it allows multiple clinics to operate on a single platform with complete data isolation — each clinic sees only their own patients, visits, and records.

The platform is currently serving its first customer and is being actively developed for a wider clinic base.

---

## Live Demo

> 🔧 **Coming very soon.** The platform is currently in final development and will be live shortly at `app.clinicdesk.in`

---

## Screenshots

### Clinic Dashboard
- Real-time stats: total patients, today's visits, upcoming revisits
- Recent visits table with quick actions

### Patient Management
- Search by phone number or unique patient ID
- Complete visit history timeline per patient

### Visit & Prescription
- Dynamic medicine builder with dosage, frequency, duration
- One-click A4 PDF report generation with clinic letterhead

### Admin Console
- Dark-themed admin panel
- Per-clinic subscription and custom pricing control

---

## Key Features

### For Clinics
- **Secure OTP Login** — email OTP authentication, no passwords to remember
- **Patient Records** — add, search, and manage unlimited patients
- **Smart Search** — find any patient instantly by phone number or unique ID
- **Digital Visits** — record diagnosis, prescription, and medicines per visit
- **PDF Report Cards** — generate print-ready A4 reports with clinic letterhead
- **Revisit Tracking** — set next visit dates, dashboard shows upcoming revisits
- **Account Settings** — update clinic name, address, logo, and contact details

### For Platform Admin
- **Admin Console** — separate dark-themed dashboard for platform management
- **All Clinics Overview** — view all registered clinics with status and stats
- **Subscription Control** — set each clinic as Active, Free, or Expired
- **Custom Pricing** — override global price for specific clinics individually
- **Global Config** — toggle free access for all clinics with one switch
- **Subscription Middleware** — every API call enforces subscription status

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Custom CSS | Design system with CSS variables |
| Inter + Poppins | Typography |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | REST API framework |
| PostgreSQL | Primary database |
| pg (node-postgres) | Raw SQL queries, no ORM |
| PDFKit | Server-side PDF generation |
| Nodemailer | OTP email delivery via Gmail SMTP |
| jsonwebtoken | JWT session management |
| cookie-parser | httpOnly cookie handling |

---

## Architecture

This project follows a strict **clean layered architecture** — the same pattern used across all my production projects:

```
Request → Routes → Controllers → Services → Repositories → Database
```

### Backend Structure
```
backend/
├── server.js                  # Express setup, middleware, route mounting
└── src/
    ├── config/database.js     # PostgreSQL pool connection
    ├── routes/                # Route definitions only — no logic
    ├── controllers/           # HTTP req/res handling — calls services
    ├── services/              # All business logic lives here
    ├── repositories/          # All SQL queries — raw SQL via pg pool
    ├── middleware/            # JWT auth + subscription enforcement
    └── utils/                 # jwt.js, email.js helpers
```

### Frontend Structure
Every page follows a strict **3-file pattern**:
```
pages/FeatureName/
├── index.js                   # JSX/UI only — no business logic
├── useFeatureName.js          # State management and business logic
└── useFeatureNameQuery.js     # All API calls isolated here
```

```
frontend/src/
├── pages/
│   ├── auth/                  # Login, Register
│   ├── clinic/                # Dashboard, Patients, Visits, Settings
│   └── admin/                 # Admin panel pages
├── components/ui/             # Reusable UI component library
├── context/                   # AuthContext
└── utils/apiCall.js           # Single fetch wrapper
```

---

## Database Schema

```sql
clinics        — registered clinics with subscription info and custom pricing
patients       — patient records linked to clinic (unique PT-XXXX ID per clinic)
visits         — consultation records with medicines (JSONB), diagnosis, next visit
otp_tokens     — OTP storage with 10-minute expiry and used flag
admin_config   — global subscription price and free-for-all toggle
admins         — admin email whitelist for role detection
```

**Multi-tenant isolation:** Every patient and visit row has a `clinic_id` foreign key. All queries filter by the authenticated clinic's ID — no cross-clinic data leakage is possible.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/request-otp` | Generate and email OTP |
| POST | `/api/auth/verify-otp` | Verify OTP → set JWT cookie |
| POST | `/api/auth/register` | Register new clinic |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Get current authenticated user |

### Clinic
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clinic/me` | Get clinic profile |
| PUT | `/api/clinic/me` | Update clinic profile |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List patients (search by phone or ID) |
| POST | `/api/patients` | Create patient (auto-generates PT-XXXX) |
| GET | `/api/patients/:id` | Patient profile + full visit history |
| PUT | `/api/patients/:id` | Update patient details |

### Visits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visits/dashboard` | Dashboard stats |
| GET | `/api/visits/today` | Today's visits |
| POST | `/api/visits` | Record new visit |
| GET | `/api/visits/:id` | Visit detail |
| PUT | `/api/visits/:id` | Edit visit |
| GET | `/api/visits/:id/pdf` | Generate and download PDF report |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/clinics` | All registered clinics |
| GET | `/api/admin/clinics/:id` | Clinic detail |
| PUT | `/api/admin/clinics/:id/subscription` | Update subscription |
| PUT | `/api/admin/clinics/:id/price` | Set custom price for clinic |
| GET | `/api/admin/config` | Global config |
| PUT | `/api/admin/config` | Update global config |

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Gmail account with App Password enabled

### 1. Clone and install
```bash
git clone https://github.com/yourusername/clinicdesk.git
cd clinicdesk

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Setup PostgreSQL database
```bash
createdb clinicdesk_db
psql -U postgres -d clinicdesk_db -f backend/database/schema.sql
```

### 3. Configure environment variables
Create `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinicdesk_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

NODE_ENV=development
```

### 4. Set your admin email
```sql
UPDATE admins SET email = 'your_email@gmail.com' WHERE id = 1;
```

### 5. Run the application
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Security Highlights

- **No passwords stored** — pure OTP-based authentication
- **httpOnly cookies** — JWT token never exposed to JavaScript
- **Role detection** — admin vs clinic role determined server-side from email whitelist
- **Subscription middleware** — enforced on every protected API route
- **Multi-tenant isolation** — all queries scoped to authenticated clinic ID
- **OTP expiry** — tokens expire in 10 minutes and are marked used after verification

---

## Roadmap

- [ ] Live deployment on Railway + Vercel
- [ ] Razorpay payment integration for self-serve subscription renewal
- [ ] WhatsApp reminders for patient revisit dates
- [ ] Data export to Excel for clinic records
- [ ] Patient-facing appointment booking portal
- [ ] Mobile responsive PWA
- [ ] Multi-language support (Hindi)
- [ ] Analytics dashboard for admin

---

## About This Project

ClinicDesk is my most recent project, built entirely from scratch as a real SaaS product targeting the Indian clinic market. It is currently serving its first paying customer and live deployment is coming very soon.

The project was built with production quality in mind — clean architecture, proper security practices, real business logic (subscription enforcement, multi-tenancy, role-based access), and a design system that scales.

---

## Author

**Musheer Ahmad**
Software Engineer | Full Stack Developer
- Samsung R&D Institute, Noida
- Toptal Network Member

---

*⭐ Star this repo if you find it useful. Live URL coming soon.*