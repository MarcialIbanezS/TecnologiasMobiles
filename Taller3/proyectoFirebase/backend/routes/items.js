const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database');

const router = express.Router();

// Validation middleware
const validateItem = [
  body('titulo').notEmpty().trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters long'),
  body('detalle').optional().trim().isLength({ max: 1000 }).withMessage('Detail must not exceed 1000 characters')
];

// Error handler for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/items - List all items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, titulo, detalle, creadoEn FROM items ORDER BY creadoEn DESC'
    );
    
    // Format the response to match the frontend interface
    const items = rows.map(item => ({
      id: item.id.toString(),
      titulo: item.titulo,
      detalle: item.detalle,
      creadoEn: item.creadoEn.toISOString()
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id - Get a specific item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, titulo, detalle, creadoEn FROM items WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = {
      id: rows[0].id.toString(),
      titulo: rows[0].titulo,
      detalle: rows[0].detalle,
      creadoEn: rows[0].creadoEn.toISOString()
    };
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items - Create a new item
router.post('/', validateItem, handleValidationErrors, async (req, res) => {
  try {
    const { titulo, detalle } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO items (titulo, detalle) VALUES (?, ?)',
      [titulo, detalle || null]
    );
    
    // Get the created item
    const [rows] = await pool.execute(
      'SELECT id, titulo, detalle, creadoEn FROM items WHERE id = ?',
      [result.insertId]
    );
    
    const item = {
      id: rows[0].id.toString(),
      titulo: rows[0].titulo,
      detalle: rows[0].detalle,
      creadoEn: rows[0].creadoEn.toISOString()
    };
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id - Update an item
router.put('/:id', validateItem, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, detalle } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE items SET titulo = ?, detalle = ? WHERE id = ?',
      [titulo, detalle || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Get the updated item
    const [rows] = await pool.execute(
      'SELECT id, titulo, detalle, creadoEn FROM items WHERE id = ?',
      [id]
    );
    
    const item = {
      id: rows[0].id.toString(),
      titulo: rows[0].titulo,
      detalle: rows[0].detalle,
      creadoEn: rows[0].creadoEn.toISOString()
    };
    
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM items WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;