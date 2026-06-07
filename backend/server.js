const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

require('./src/config/database');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));

app.get('/', (req, res) => res.json({ message: '🏥 ClinicDesk API running', status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/clinic', require('./src/routes/clinicRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/visits', require('./src/routes/visitRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
