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

// Get all consultations
router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, patientId, professionalId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    let queryParams = [];

    if (patientId) {
      whereClause += ' AND c.idpaciente = ?';
      queryParams.push(patientId);
    }

    if (professionalId) {
      whereClause += ' AND c.idprofesional = ?';
      queryParams.push(professionalId);
    }

    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        p.nombre as patientName,
        p.apellidopaterno,
        p.apellidomaterno,
        prof.nombreprofesional,
        prof.especialidad,
        s.servicio
      FROM consulta c
      LEFT JOIN paciente p ON c.idpaciente = p.idpaciente
      LEFT JOIN profesional prof ON c.idprofesional = prof.idprofesional
      LEFT JOIN servicio s ON c.idservicio = s.idservicio
      WHERE ${whereClause}
      ORDER BY c.fecha DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), parseInt(offset)]);

    // Get total count
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM consulta c 
      WHERE ${whereClause}
    `, queryParams);

    res.json({
      success: true,
      consultations: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get consultation by ID with full details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const consultationId = req.params.id;

    // Get consultation details
    const [consultationRows] = await pool.execute(`
      SELECT 
        c.*,
        p.nombre as patientName,
        p.apellidopaterno,
        p.apellidomaterno,
        p.rut,
        prof.nombreprofesional,
        prof.especialidad,
        s.servicio
      FROM consulta c
      LEFT JOIN paciente p ON c.idpaciente = p.idpaciente
      LEFT JOIN profesional prof ON c.idprofesional = prof.idprofesional
      LEFT JOIN servicio s ON c.idservicio = s.idservicio
      WHERE c.idconsulta = ?
    `, [consultationId]);

    if (consultationRows.length === 0) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Get diagnoses for this consultation
    const [diagnoses] = await pool.execute(`
      SELECT d.iddiagnostico, d.diagnostico
      FROM consultadiagnostico cd
      JOIN diagnostico d ON cd.iddiagnostico = d.iddiagnostico
      WHERE cd.idconsulta = ?
    `, [consultationId]);

    // Get interventions for this consultation
    const [interventions] = await pool.execute(`
      SELECT i.idintervencion, i.intervencion
      FROM consultaintervencion ci
      JOIN intervencion i ON ci.idintervencion = i.idintervencion
      WHERE ci.idconsulta = ?
    `, [consultationId]);

    const consultation = {
      ...consultationRows[0],
      diagnoses,
      interventions
    };

    res.json({
      success: true,
      consultation
    });

  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new consultation
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      idpaciente,
      idservicio,
      idprofesional,
      fecha,
      diagnoses = [],
      interventions = []
    } = req.body;

    if (!idpaciente || !idservicio || !idprofesional || !fecha) {
      return res.status(400).json({ 
        error: 'Patient ID, service ID, professional ID, and date are required' 
      });
    }

    // Get next consultation ID
    const [maxId] = await pool.execute(
      'SELECT MAX(idconsulta) as maxId FROM consulta'
    );
    const nextId = (maxId[0].maxId || 0) + 1;

    // Insert consultation
    await pool.execute(`
      INSERT INTO consulta (idconsulta, idpaciente, idservicio, idprofesional, fecha)
      VALUES (?, ?, ?, ?, ?)
    `, [nextId, idpaciente, idservicio, idprofesional, fecha]);

    // Add diagnoses
    for (const diagnosisId of diagnoses) {
      await pool.execute(
        'INSERT INTO consultadiagnostico (idconsulta, iddiagnostico) VALUES (?, ?)',
        [nextId, diagnosisId]
      );
    }

    // Add interventions
    for (const interventionId of interventions) {
      await pool.execute(
        'INSERT INTO consultaintervencion (idconsulta, idintervencion) VALUES (?, ?)',
        [nextId, interventionId]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Consultation created successfully',
      consultationId: nextId
    });

  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update consultation
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const consultationId = req.params.id;
    const {
      idpaciente,
      idservicio,
      idprofesional,
      fecha,
      diagnoses = [],
      interventions = []
    } = req.body;

    // Update consultation
    await pool.execute(`
      UPDATE consulta SET 
        idpaciente = ?, idservicio = ?, idprofesional = ?, fecha = ?
      WHERE idconsulta = ?
    `, [idpaciente, idservicio, idprofesional, fecha, consultationId]);

    // Remove existing diagnoses and interventions
    await pool.execute('DELETE FROM consultadiagnostico WHERE idconsulta = ?', [consultationId]);
    await pool.execute('DELETE FROM consultaintervencion WHERE idconsulta = ?', [consultationId]);

    // Add new diagnoses
    for (const diagnosisId of diagnoses) {
      await pool.execute(
        'INSERT INTO consultadiagnostico (idconsulta, iddiagnostico) VALUES (?, ?)',
        [consultationId, diagnosisId]
      );
    }

    // Add new interventions
    for (const interventionId of interventions) {
      await pool.execute(
        'INSERT INTO consultaintervencion (idconsulta, idintervencion) VALUES (?, ?)',
        [consultationId, interventionId]
      );
    }

    res.json({
      success: true,
      message: 'Consultation updated successfully'
    });

  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete consultation
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const consultationId = req.params.id;

    // Delete related records first
    await pool.execute('DELETE FROM consultadiagnostico WHERE idconsulta = ?', [consultationId]);
    await pool.execute('DELETE FROM consultaintervencion WHERE idconsulta = ?', [consultationId]);

    // Delete the consultation
    const [result] = await pool.execute('DELETE FROM consulta WHERE idconsulta = ?', [consultationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });

  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available services
router.get('/data/services', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM servicio ORDER BY servicio');
    res.json({ success: true, services: rows });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available diagnoses
router.get('/data/diagnoses', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM diagnostico ORDER BY diagnostico');
    res.json({ success: true, diagnoses: rows });
  } catch (error) {
    console.error('Get diagnoses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available interventions
router.get('/data/interventions', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM intervencion ORDER BY intervencion');
    res.json({ success: true, interventions: rows });
  } catch (error) {
    console.error('Get interventions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;