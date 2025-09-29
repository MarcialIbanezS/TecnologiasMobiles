const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    console.log('Querying database for user:', username);
    // Query the professional table using RUT as username
    // Get professional with specialty information
    const [rows] = await pool.execute(`
      SELECT 
        p.idprofesional,
        p.nombreprofesional,
        p.rut,
        e.especialidad
      FROM profesional p
      LEFT JOIN especialidad e ON p.idespecialidad = e.idespecialidad
      WHERE p.rut = ?
    `, [username]);

    console.log('Database query result:', rows);

    if (rows.length === 0) {
      console.log('No user found for RUT:', username);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    const user = rows[0];
    console.log('User found:', user);

    // For demo purposes, accept any password
    // In production, you should implement proper password validation
    if (!password || password.length < 1) {
      console.log('Invalid password');
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    console.log('Generating JWT token');
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.idprofesional,
        username: user.rut,
        name: user.nombreprofesional,
        specialty: user.especialidad
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.nombreprofesional);
    res.json({
      success: true,
      token,
      user: {
        id: user.idprofesional,
        username: user.rut,
        name: user.nombreprofesional,
        specialty: user.especialidad || 'General'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Register endpoint (for creating new professionals)
router.post('/register', async (req, res) => {
  try {
    const { rut, name, specialtyId } = req.body;

    if (!rut || !name) {
      return res.status(400).json({ 
        error: 'RUT and name are required' 
      });
    }

    // Check if professional already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM profesional WHERE rut = ?',
      [rut]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        error: 'Professional with this RUT already exists' 
      });
    }

    // Get the next ID
    const [maxId] = await pool.execute(
      'SELECT MAX(idprofesional) as maxId FROM profesional'
    );
    const nextId = (maxId[0].maxId || 0) + 1;

    // Insert new professional
    await pool.execute(
      'INSERT INTO profesional (idprofesional, idespecialidad, nombreprofesional, rut) VALUES (?, ?, ?, ?)',
      [nextId, specialtyId || 1, name, rut]
    );

    res.json({
      success: true,
      message: 'Professional registered successfully',
      user: {
        id: nextId,
        username: rut,
        name,
        specialty: 'General'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Profile endpoint
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.idprofesional,
        p.nombreprofesional,
        p.rut,
        e.especialidad
      FROM profesional p
      LEFT JOIN especialidad e ON p.idespecialidad = e.idespecialidad
      WHERE p.idprofesional = ?
    `, [req.user.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: rows[0].idprofesional,
        username: rows[0].rut,
        name: rows[0].nombreprofesional,
        specialty: rows[0].especialidad || 'General'
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;