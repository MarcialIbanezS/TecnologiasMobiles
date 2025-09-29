const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get all professionals
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.idprofesional,
        p.nombreprofesional,
        p.especialidad,
        p.nombreusuario,
        COUNT(c.idconsulta) as consultationCount
      FROM profesional p
      LEFT JOIN consulta c ON p.idprofesional = c.idprofesional
      GROUP BY p.idprofesional
      ORDER BY p.nombreprofesional
    `);

    res.json({
      success: true,
      professionals: rows
    });

  } catch (error) {
    console.error('Get professionals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const professionalId = req.params.id;

    const [professionalRows] = await pool.execute(`
      SELECT 
        idprofesional, nombreprofesional, especialidad, nombreusuario
      FROM profesional 
      WHERE idprofesional = ?
    `, [professionalId]);

    if (professionalRows.length === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    // Get recent consultations for this professional
    const [consultations] = await pool.execute(`
      SELECT 
        c.*,
        p.nombre as patientName,
        p.apellidopaterno,
        s.servicio
      FROM consulta c
      LEFT JOIN paciente p ON c.idpaciente = p.idpaciente
      LEFT JOIN servicio s ON c.idservicio = s.idservicio
      WHERE c.idprofesional = ?
      ORDER BY c.fecha DESC
      LIMIT 10
    `, [professionalId]);

    const professional = {
      ...professionalRows[0],
      recentConsultations: consultations
    };

    res.json({
      success: true,
      professional
    });

  } catch (error) {
    console.error('Get professional error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new professional
router.post('/', async (req, res) => {
  try {
    const { nombreprofesional, especialidad, nombreusuario, contrasena } = req.body;

    if (!nombreprofesional || !nombreusuario || !contrasena) {
      return res.status(400).json({ 
        error: 'Name, username, and password are required' 
      });
    }

    // Check if username already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM profesional WHERE nombreusuario = ?',
      [nombreusuario]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    // Get next professional ID
    const [maxId] = await pool.execute(
      'SELECT MAX(idprofesional) as maxId FROM profesional'
    );
    const nextId = (maxId[0].maxId || 0) + 1;

    // Insert professional
    await pool.execute(`
      INSERT INTO profesional (idprofesional, nombreprofesional, especialidad, nombreusuario, contrasena)
      VALUES (?, ?, ?, ?, ?)
    `, [nextId, nombreprofesional, especialidad || 'General', nombreusuario, contrasena]);

    res.status(201).json({
      success: true,
      message: 'Professional created successfully',
      professionalId: nextId
    });

  } catch (error) {
    console.error('Create professional error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update professional
router.put('/:id', async (req, res) => {
  try {
    const professionalId = req.params.id;
    const { nombreprofesional, especialidad, nombreusuario } = req.body;

    if (!nombreprofesional || !nombreusuario) {
      return res.status(400).json({ 
        error: 'Name and username are required' 
      });
    }

    // Check if username already exists for other professionals
    const [existingUsers] = await pool.execute(
      'SELECT * FROM profesional WHERE nombreusuario = ? AND idprofesional != ?',
      [nombreusuario, professionalId]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    const [result] = await pool.execute(`
      UPDATE profesional SET 
        nombreprofesional = ?, especialidad = ?, nombreusuario = ?
      WHERE idprofesional = ?
    `, [nombreprofesional, especialidad, nombreusuario, professionalId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.json({
      success: true,
      message: 'Professional updated successfully'
    });

  } catch (error) {
    console.error('Update professional error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete professional
router.delete('/:id', async (req, res) => {
  try {
    const professionalId = req.params.id;

    // Check if professional has consultations
    const [consultations] = await pool.execute(
      'SELECT COUNT(*) as count FROM consulta WHERE idprofesional = ?',
      [professionalId]
    );

    if (consultations[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete professional with existing consultations' 
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM profesional WHERE idprofesional = ?',
      [professionalId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.json({
      success: true,
      message: 'Professional deleted successfully'
    });

  } catch (error) {
    console.error('Delete professional error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
