const express = require('express');
const router = express.Router();
const { registrarClase} = require('../clases_ABC');

// Ruta para registrar una clase
router.post('/', async (req, res) => {
    try {
        const clase = await registrarClase(req.body);
        res.status(201).json(clase);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la clase' });
    }
});

module.exports = router;