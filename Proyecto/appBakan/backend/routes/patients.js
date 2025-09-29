const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.idpaciente,
        p.nombrePaciente as nombre,
        p.rut,
        p.fechaNacimiento as fechanacimiento,
        p.sexo as genero,
        p.direccion
      FROM paciente p
      ORDER BY p.nombrePaciente
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
router.get('/:id', async (req, res) => {
  try {
    const patientId = req.params.id;

    const [patientRows] = await pool.execute(`
      SELECT 
        p.idpaciente,
        p.nombrePaciente as nombre,
        p.rut,
        p.fechaNacimiento as fechanacimiento,
        p.sexo as genero,
        p.direccion
      FROM paciente p
      WHERE p.idpaciente = ?
    `, [patientId]);

    if (patientRows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = patientRows[0];

    res.json({
      success: true,
      patient: patient
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new patient
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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