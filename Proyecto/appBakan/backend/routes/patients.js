const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all patients
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.*,
        c.cliente as clienteName,
        GROUP_CONCAT(DISTINCT a.nombrealergia) as allergies,
        GROUP_CONCAT(DISTINCT cr.enfermedadcronica) as chronicDiseases
      FROM paciente p
      LEFT JOIN cliente c ON p.idcliente = c.idcliente
      LEFT JOIN pacientealergia pa ON p.idpaciente = pa.idpaciente
      LEFT JOIN alergia a ON pa.idalergia = a.idalergia
      LEFT JOIN pacientecronica pc ON p.idpaciente = pc.idpaciente
      LEFT JOIN cronico cr ON pc.idcronico = cr.idcronico
      GROUP BY p.idpaciente
      ORDER BY p.nombre, p.apellidopaterno
    `);

    res.json({
      success: true,
      patients: rows
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get patient by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.id;

    const [patientRows] = await pool.execute(`
      SELECT 
        p.*,
        c.cliente as clienteName
      FROM paciente p
      LEFT JOIN cliente c ON p.idcliente = c.idcliente
      WHERE p.idpaciente = ?
    `, [patientId]);

    if (patientRows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get allergies
    const [allergies] = await pool.execute(`
      SELECT a.idalergia, a.nombrealergia, a.descripcionAlergia
      FROM pacientealergia pa
      JOIN alergia a ON pa.idalergia = a.idalergia
      WHERE pa.idpaciente = ?
    `, [patientId]);

    // Get chronic diseases
    const [chronicDiseases] = await pool.execute(`
      SELECT cr.idcronico, cr.enfermedadcronica
      FROM pacientecronica pc
      JOIN cronico cr ON pc.idcronico = cr.idcronico
      WHERE pc.idpaciente = ?
    `, [patientId]);

    // Get recent consultations
    const [consultations] = await pool.execute(`
      SELECT 
        co.*,
        prof.nombreprofesional,
        s.servicio
      FROM consulta co
      LEFT JOIN profesional prof ON co.idprofesional = prof.idprofesional
      LEFT JOIN servicio s ON co.idservicio = s.idservicio
      WHERE co.idpaciente = ?
      ORDER BY co.fecha DESC
      LIMIT 10
    `, [patientId]);

    const patient = {
      ...patientRows[0],
      allergies,
      chronicDiseases,
      recentConsultations: consultations
    };

    res.json({
      success: true,
      patient
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new patient
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      nombre,
      apellidopaterno,
      apellidomaterno,
      rut,
      fechanacimiento,
      genero,
      telefono,
      email,
      direccion,
      idcliente,
      allergies = [],
      chronicDiseases = []
    } = req.body;

    // Validate required fields
    if (!nombre || !apellidopaterno || !rut) {
      return res.status(400).json({ 
        error: 'Name, last name, and RUT are required' 
      });
    }

    // Get next patient ID
    const [maxId] = await pool.execute(
      'SELECT MAX(idpaciente) as maxId FROM paciente'
    );
    const nextId = (maxId[0].maxId || 0) + 1;

    // Insert patient
    await pool.execute(`
      INSERT INTO paciente (
        idpaciente, nombre, apellidopaterno, apellidomaterno, 
        rut, fechanacimiento, genero, telefono, email, direccion, idcliente
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nextId, nombre, apellidopaterno, apellidomaterno,
      rut, fechanacimiento, genero, telefono, email, direccion, idcliente
    ]);

    // Add allergies if provided
    for (const allergyId of allergies) {
      await pool.execute(
        'INSERT INTO pacientealergia (idpaciente, idalergia) VALUES (?, ?)',
        [nextId, allergyId]
      );
    }

    // Add chronic diseases if provided
    for (const chronicId of chronicDiseases) {
      await pool.execute(
        'INSERT INTO pacientecronica (idpaciente, idcronico) VALUES (?, ?)',
        [nextId, chronicId]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patientId: nextId
    });

  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update patient
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.id;
    const {
      nombre,
      apellidopaterno,
      apellidomaterno,
      rut,
      fechanacimiento,
      genero,
      telefono,
      email,
      direccion,
      idcliente
    } = req.body;

    await pool.execute(`
      UPDATE paciente SET 
        nombre = ?, apellidopaterno = ?, apellidomaterno = ?,
        rut = ?, fechanacimiento = ?, genero = ?, telefono = ?,
        email = ?, direccion = ?, idcliente = ?
      WHERE idpaciente = ?
    `, [
      nombre, apellidopaterno, apellidomaterno, rut,
      fechanacimiento, genero, telefono, email, direccion,
      idcliente, patientId
    ]);

    res.json({
      success: true,
      message: 'Patient updated successfully'
    });

  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete patient
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.id;

    // First delete related records due to foreign key constraints
    await pool.execute('DELETE FROM pacientealergia WHERE idpaciente = ?', [patientId]);
    await pool.execute('DELETE FROM pacientecronica WHERE idpaciente = ?', [patientId]);
    
    // Delete the patient
    const [result] = await pool.execute('DELETE FROM paciente WHERE idpaciente = ?', [patientId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });

  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;