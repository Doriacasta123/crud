
const express = require('express');
const router = express.Router();
const pool = require('../../db');


router.get('/', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});


router.post('/', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const [result] = await pool.query('INSERT INTO users (nombre, email) VALUES (?, ?)', [nombre, email]);
        res.status(201).json({ id: result.insertId, nombre, email });
    } catch (err) {
        res.status(400).json({ error: 'Error para crear el usuario' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const [result] = await pool.query('UPDATE users SET nombre = ?, email = ? WHERE id = ?', [nombre, email, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ id: req.params.id, nombre, email });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;
