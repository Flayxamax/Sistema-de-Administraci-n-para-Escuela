const express = require('express');
const router = express.Router();
const { registrarClase, buscarClase, asignarEstudianteAClase, obtenerClases, obtenerEstudiantesPorClase } = require('../clases_ABC');

// Ruta para registrar una clase
router.post('/', async (req, res) => {
    try {
        const clase = await registrarClase(req.body);
        res.status(201).json(clase);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la clase' });
    }
});

router.post('/buscar', async (req, res) => {
    const { nombre } = req.body;
    try {
        const clases = await buscarClase(nombre);
        res.json(clases);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar las clases' });
    }
});

// Ruta para asignar un alumno a una clase
router.post('/asignar-alumno-clase', async (req, res) => {
    const { alumnoId, claseId } = req.body;
    try {
        const resultado = await asignarEstudianteAClase(alumnoId, claseId);

        // Verificar si hubo un error de asignación
        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }

        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar el alumno a la clase' });
    }
});

router.get('/consulta', async (req, res) => {
    try {
        const clases = await obtenerClases();
        res.status(200).json(clases);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clases' });
    }
});

router.get('/:id/estudiantes', async (req, res) => {
    const idClase = req.params.id;
    try {
        const estudiantes = await obtenerEstudiantesPorClase(idClase);
        res.status(200).json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estudiantes de la clase' });
    }
});

module.exports = router;