const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Test database connection and get some sample data
router.get('/test', async (req, res) => {
  try {
    // Test basic connection
    const [connection] = await pool.execute('SELECT 1 as test');
    
    // Get sample data from each main table
    const [patients] = await pool.execute('SELECT COUNT(*) as count FROM paciente');
    const [professionals] = await pool.execute('SELECT COUNT(*) as count FROM profesional');
    const [clients] = await pool.execute('SELECT COUNT(*) as count FROM cliente');
    const [consultations] = await pool.execute('SELECT COUNT(*) as count FROM consulta');
    
    // Get sample professional for login test
    const [sampleProf] = await pool.execute(`
      SELECT 
        p.rut,
        p.nombreprofesional,
        e.especialidad
      FROM profesional p
      LEFT JOIN especialidad e ON p.idespecialidad = e.idespecialidad
      LIMIT 1
    `);
    
    res.json({
      success: true,
      message: 'Database connection successful',
      database: 'tecnologiasmoviles',
      tables: {
        patients: patients[0].count,
        professionals: professionals[0].count,
        clients: clients[0].count,
        consultations: consultations[0].count
      },
      sampleLogin: sampleProf.length > 0 ? {
        username: sampleProf[0].rut,
        name: sampleProf[0].nombreprofesional,
        specialty: sampleProf[0].especialidad
      } : 'No professionals found'
    });

  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

module.exports = router;