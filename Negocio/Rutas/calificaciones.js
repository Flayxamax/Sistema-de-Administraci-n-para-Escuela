const express = require('express');
const router = express.Router();
const { actualizarCalificacion } = require('../calificaciones_ABC');
const { obtenerCalificacion } = require('../calificaciones_ABC');

// Ruta para actualizar la calificación de un estudiante en una clase
router.post('/:claseId/estudiantes/:estudianteId/calificacion', async (req, res) => {
    const { claseId, estudianteId } = req.params;
    const  parciales  = req.body;
    try {
        await actualizarCalificacion(estudianteId, claseId, parciales);
        res.status(200).json({ message: 'Calificación actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la calificación' });
    }
});

router.get('/:claseId/estudiantes/:estudianteId', async (req, res) => {
    const { claseId, estudianteId } = req.params;
    try {
        const calificacion = await obtenerCalificacion(estudianteId, claseId);
        res.status(200).json(calificacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la calificación' });
    }
});

module.exports = router;
