const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./backend/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8100',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files

// Test database connection on startup
testConnection();

// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/patients', require('./backend/routes/patients'));
app.use('/api/clients', require('./backend/routes/clients'));
app.use('/api/professionals', require('./backend/routes/professionals'));
app.use('/api/consultations', require('./backend/routes/consultations'));
app.use('/api/medical-records', require('./backend/routes/medical-records'));
app.use('/api/test', require('./backend/routes/test'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Medical Records API Server',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/patients',
      '/api/clients',
      '/api/professionals',
      '/api/consultations',
      '/api/medical-records'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation available at http://localhost:${PORT}`);
});