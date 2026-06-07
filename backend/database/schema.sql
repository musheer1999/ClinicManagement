-- ClinicDesk Database Schema
-- Run: psql -U postgres -d clinicdesk_db -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  logo_url TEXT,
  subscription_status VARCHAR(20) DEFAULT 'active'
    CHECK (subscription_status IN ('free', 'active', 'expired')),
  subscription_expiry DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  custom_price DECIMAL(10,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OTP tokens table
CREATE TABLE IF NOT EXISTS otp_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  unique_patient_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  phone VARCHAR(20) NOT NULL,
  blood_group VARCHAR(5),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_unique_id ON patients(unique_patient_id);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnosis TEXT,
  prescription TEXT,
  medicines JSONB DEFAULT '[]',
  next_visit_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_clinic ON visits(clinic_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);

-- Admin config table
CREATE TABLE IF NOT EXISTS admin_config (
  id SERIAL PRIMARY KEY,
  subscription_price DECIMAL(10,2) DEFAULT 999.00,
  is_free_for_all BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed default admin config
INSERT INTO admin_config (subscription_price, is_free_for_all)
VALUES (999.00, false)
ON CONFLICT DO NOTHING;

-- Seed default admin (change email as needed)
INSERT INTO admins (email)
VALUES ('admin@clinicdesk.in')
ON CONFLICT DO NOTHING;
