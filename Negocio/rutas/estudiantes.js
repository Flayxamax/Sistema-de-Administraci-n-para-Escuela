const express = require('express');
const router = express.Router();
const { registrarEstudiante } = require('../estudiante_ABC');
const { buscarEstudiante } = require('../estudiante_ABC');

// Ruta para registrar un estudiante
router.post('/', async (req, res) => {
    try {
        const estudiante = await registrarEstudiante(req.body);
        res.status(201).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar estudiante' });
    }
});

router.post('/buscar', async (req, res) => {
    const { nombre } = req.body;
    try {
        const estudiantes = await buscarEstudiante(nombre);
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar estudiantes' });
    }
});

module.exports = router;
