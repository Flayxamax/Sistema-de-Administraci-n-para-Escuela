const Calificacion = require('../Persistencia/modelos/calificaciones');

const actualizarCalificacion = async (estudianteId, claseId, calificacion) => {
    try {
        const calificacionExistente = await Calificacion.findOne({
            where: { estudianteId, claseId }
        });

        if (calificacionExistente) {
            calificacionExistente.calificacion = calificacion;
            await calificacionExistente.save();
        } else {
            await Calificacion.create({ estudianteId, claseId, calificacion });
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { actualizarCalificacion };
