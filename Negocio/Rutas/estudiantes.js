const express = require('express');
const router = express.Router();
const { registrarEstudiante, buscarEstudiantes, obtenerEstudiantePorId, editarEstudiante } = require('../estudiante_ABC');

// Ruta para registrar un estudiante
router.post('/', async (req, res) => {
    try {
        const estudiante = await registrarEstudiante(req.body);
        res.status(201).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar estudiante' });
    }
});

router.get('/buscar', async (req, res) => {
    const { nombre } = req.query;
    try {
        const estudiantes = await buscarEstudiantes(nombre);
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar estudiantes' });
    }
});

// Ruta para obtener un estudiante por ID
router.get('/:id', async (req, res) => {
    const estudianteId = req.params.id;
    try {
        const estudiante = await obtenerEstudiantePorId(estudianteId);
        res.status(200).json(estudiante);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para editar un estudiante
router.put('/editar/:id', async (req, res) => {
    const { id } = req.params; 
    const datosActualizados = req.body;

    try {
        const estudianteActualizado = await editarEstudiante(id, datosActualizados);
        res.status(200).json({ 
            message: 'Estudiante actualizado con éxito', 
            estudiante: estudianteActualizado 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el estudiante', 
            error: error.message 
        });
    }
});

module.exports = router;
