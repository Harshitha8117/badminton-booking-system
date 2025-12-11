// backend/server.js
const path = require('path');
const express = require('express');
const connectDB = require('./config/db'); // your existing DB connector
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect DB
connectDB();

// ---- API routes (import your existing route files) ----
// keep the same relative paths you already use
app.use('/api/courts', require('./routes/courtRoutes'));
app.use('/api/coaches', require('./routes/coachRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/pricingrules', require('./routes/pricingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---- Serve frontend build in production / when built ----
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

// any unknown GET -> serve index.html for SPA routing
app.get('*', (req, res) => {
  // If the request looks like an API call, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  // otherwise serve the frontend app
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) {
      res.status(500).send('Frontend not built. Run `npm run build` in frontend.');
    }
  });
});

// port (Render sets PORT, local fallback 4000)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
