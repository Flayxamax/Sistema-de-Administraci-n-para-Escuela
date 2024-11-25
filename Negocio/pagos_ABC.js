const Pago = require('../Persistencia/Modelos/pagos');

// Registrar o actualizar un pago
const registrarPago = async (nombreEstudiante, mes, monto) => {
    try {
        const pagoExistente = await Pago.findOne({
            where: { nombreEstudiante, mes }
        });

        if (pagoExistente) {
            // Si ya existe un pago para ese estudiante y mes, se actualiza el monto
            pagoExistente.monto = monto;
            await pagoExistente.save();
        } else {
            // Si no existe, se crea un nuevo pago
            await Pago.create({ nombreEstudiante, mes, monto });
        }
    } catch (error) {
        throw error;
    }
};

// Obtener todos los pagos registrados
const obtenerPagos = async () => {
    try {
        const pagos = await Pago.findAll();
        return pagos;
    } catch (error) {
        throw error;
    }
};

// Eliminar un pago por nombre del estudiante y mes
const eliminarPago = async (nombreEstudiante, mes) => {
    try {
        const resultado = await Pago.destroy({
            where: { nombreEstudiante, mes }
        });
        return resultado;
    } catch (error) {
        throw error;
    }
};

module.exports = { registrarPago, obtenerPagos, eliminarPago };
