const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all medical records for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Get medical records with consultation and patient details
    const query = `
      SELECT 
        fm.idfichamedica,
        fm.idpaciente,
        fm.idconsulta,
        fm.fechaingreso,
        p.nombrePaciente,
        p.rut,
        p.fechaNacimiento,
        p.sexo,
        p.direccion,
        c.fecha as fechaConsulta,
        s.servicio as tipoServicio,
        pr.nombreprofesional as nombreProfesional
      FROM fichamedica fm
      JOIN paciente p ON fm.idpaciente = p.idpaciente
      LEFT JOIN consulta c ON fm.idconsulta = c.idconsulta
      LEFT JOIN servicio s ON c.idservicio = s.idservicio
      LEFT JOIN profesional pr ON c.idprofesional = pr.idprofesional
      WHERE fm.idpaciente = ?
      ORDER BY fm.fechaingreso DESC
    `;

    const [records] = await pool.execute(query, [patientId]);

    res.json({
      success: true,
      data: records,
      message: `Found ${records.length} medical records for patient ID ${patientId}`
    });

  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical records',
      error: error.message
    });
  }
});

// Get detailed medical record by ID (includes allergies, chronic conditions, operations)
router.get('/:recordId/details', async (req, res) => {
  try {
    const recordId = req.params.recordId;

    // Get main medical record info
    const recordQuery = `
      SELECT 
        fm.idfichamedica,
        fm.idpaciente,
        fm.idconsulta,
        fm.fechaingreso,
        p.nombrePaciente,
        p.rut,
        p.fechaNacimiento,
        p.sexo,
        p.direccion,
        c.fecha as fechaConsulta,
        s.servicio as tipoServicio,
        pr.nombreprofesional as nombreProfesional
      FROM fichamedica fm
      JOIN paciente p ON fm.idpaciente = p.idpaciente
      LEFT JOIN consulta c ON fm.idconsulta = c.idconsulta
      LEFT JOIN servicio s ON c.idservicio = s.idservicio
      LEFT JOIN profesional pr ON c.idprofesional = pr.idprofesional
      WHERE fm.idfichamedica = ?
    `;

    // Get allergies
    const allergiesQuery = `
      SELECT a.idalergia, a.nombrealergia, a.descripcionAlergia
      FROM fichaalergia fa
      JOIN alergia a ON fa.idalergia = a.idalergia
      WHERE fa.idfichamedica = ?
    `;

    // Get chronic conditions
    const chronicQuery = `
      SELECT c.idcronico, c.enfermedadcronica
      FROM fichacronico fc
      JOIN cronico c ON fc.idcronico = c.idcronico
      WHERE fc.idfichamedica = ?
    `;

    // Get operations
    const operationsQuery = `
      SELECT o.idoperacion, o.operacion
      FROM fichaoperacion fo
      JOIN operacion o ON fo.idoperacion = o.idoperacion
      WHERE fo.idfichamedica = ?
    `;

    const [recordResult] = await pool.execute(recordQuery, [recordId]);
    const [allergies] = await pool.execute(allergiesQuery, [recordId]);
    const [chronic] = await pool.execute(chronicQuery, [recordId]);
    const [operations] = await pool.execute(operationsQuery, [recordId]);

    if (recordResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Medical record with ID ${recordId} not found`
      });
    }

    const medicalRecord = {
      ...recordResult[0],
      allergies,
      chronicConditions: chronic,
      operations
    };

    res.json({
      success: true,
      data: medicalRecord,
      message: 'Medical record details retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching medical record details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical record details',
      error: error.message
    });
  }
});

// Create new medical record
router.post('/', async (req, res) => {
  try {
    
    const { idpaciente, idconsulta, fechaingreso } = req.body;

    if (!idpaciente || !fechaingreso) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and admission date are required'
      });
    }

    // Get next ID for medical record
    const [maxIdResult] = await pool.execute(
      'SELECT COALESCE(MAX(idfichamedica), 0) + 1 as nextId FROM fichamedica'
    );
    const nextId = maxIdResult[0].nextId;

    const query = `
      INSERT INTO fichamedica (idfichamedica, idpaciente, idconsulta, fechaingreso)
      VALUES (?, ?, ?, ?)
    `;

    await pool.execute(query, [nextId, idpaciente, idconsulta, fechaingreso]);

    res.status(201).json({
      success: true,
      data: {
        idfichamedica: nextId,
        idpaciente,
        idconsulta,
        fechaingreso
      },
      message: 'Medical record created successfully'
    });

  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating medical record',
      error: error.message
    });
  }
});

// Update medical record
router.put('/:recordId', async (req, res) => {
  try {
    
    const recordId = req.params.recordId;
    const { idconsulta, fechaingreso } = req.body;

    const query = `
      UPDATE fichamedica 
      SET idconsulta = ?, fechaingreso = ?
      WHERE idfichamedica = ?
    `;

    const [result] = await pool.execute(query, [idconsulta, fechaingreso, recordId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Medical record with ID ${recordId} not found`
      });
    }

    res.json({
      success: true,
      message: 'Medical record updated successfully'
    });

  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medical record',
      error: error.message
    });
  }
});

// Delete medical record
router.delete('/:recordId', async (req, res) => {
  try {
    
    const recordId = req.params.recordId;

    // Delete related records first (due to foreign key constraints)
    await pool.execute('DELETE FROM fichaalergia WHERE idfichamedica = ?', [recordId]);
    await pool.execute('DELETE FROM fichacronico WHERE idfichamedica = ?', [recordId]);
    await pool.execute('DELETE FROM fichaoperacion WHERE idfichamedica = ?', [recordId]);

    // Delete main medical record
    const [result] = await pool.execute('DELETE FROM fichamedica WHERE idfichamedica = ?', [recordId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Medical record with ID ${recordId} not found`
      });
    }

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medical record',
      error: error.message
    });
  }
});

module.exports = router;
