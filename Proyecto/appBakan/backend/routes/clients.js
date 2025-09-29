const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        COUNT(p.idpaciente) as patientCount
      FROM cliente c
      LEFT JOIN paciente p ON c.idcliente = p.idcliente
      GROUP BY c.idcliente
      ORDER BY c.cliente
    `);

    res.json({
      success: true,
      clients: rows
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const clientId = req.params.id;

    const [clientRows] = await pool.execute(
      'SELECT * FROM cliente WHERE idcliente = ?',
      [clientId]
    );

    if (clientRows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Get patients for this client
    const [patients] = await pool.execute(`
      SELECT 
        idpaciente, nombre, apellidopaterno, apellidomaterno, 
        rut, fechanacimiento, genero, telefono, email
      FROM paciente 
      WHERE idcliente = ?
      ORDER BY nombre, apellidopaterno
    `, [clientId]);

    const client = {
      ...clientRows[0],
      patients
    };

    res.json({
      success: true,
      client
    });

  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { cliente } = req.body;

    if (!cliente) {
      return res.status(400).json({ 
        error: 'Client name is required' 
      });
    }

    // Get next client ID
    const [maxId] = await pool.execute(
      'SELECT MAX(idcliente) as maxId FROM cliente'
    );
    const nextId = (maxId[0].maxId || 0) + 1;

    // Insert client
    await pool.execute(
      'INSERT INTO cliente (idcliente, cliente) VALUES (?, ?)',
      [nextId, cliente]
    );

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      clientId: nextId
    });

  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const clientId = req.params.id;
    const { cliente } = req.body;

    if (!cliente) {
      return res.status(400).json({ 
        error: 'Client name is required' 
      });
    }

    const [result] = await pool.execute(
      'UPDATE cliente SET cliente = ? WHERE idcliente = ?',
      [cliente, clientId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      success: true,
      message: 'Client updated successfully'
    });

  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const clientId = req.params.id;

    // Check if client has patients
    const [patients] = await pool.execute(
      'SELECT COUNT(*) as count FROM paciente WHERE idcliente = ?',
      [clientId]
    );

    if (patients[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete client with existing patients' 
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM cliente WHERE idcliente = ?',
      [clientId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;