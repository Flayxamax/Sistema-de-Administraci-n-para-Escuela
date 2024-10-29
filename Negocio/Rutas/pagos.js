const express = require('express');
const router = express.Router();
const { registrarPago, obtenerPagos, eliminarPago } = require('../pagos_ABC');

// Ruta para registrar o actualizar un pago
router.post('/registrar', async (req, res) => {
    try {
        const { nombreEstudiante, mes, monto } = req.body;
        await registrarPago(nombreEstudiante, mes, monto);
        res.status(201).json({ message: 'Pago registrado o actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el pago', error: error.message });
    }
});

// Ruta para obtener todos los pagos
router.get('/listar', async (req, res) => {
    try {
        const pagos = await obtenerPagos();
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
    }
});

// Ruta para eliminar un pago
router.delete('/eliminar', async (req, res) => {
    try {
        const { nombreEstudiante, mes } = req.body;
        const resultado = await eliminarPago(nombreEstudiante, mes);
        if (resultado) {
            res.json({ message: 'Pago eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Pago no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pago', error: error.message });
    }
});

module.exports = router;
