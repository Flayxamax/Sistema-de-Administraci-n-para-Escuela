const Calificacion = require('../Persistencia/Modelos/calificaciones');

const actualizarCalificacion = async (estudianteId, claseId, parciales) => {
    try {
        const calificacionExistente = await Calificacion.findOne({
            where: { estudianteId, claseId }
        });

        if (calificacionExistente) {
            if (parciales.parcial1 !== undefined) {
                calificacionExistente.parcial1 = parciales.parcial1;
            }
            if (parciales.parcial2 !== undefined) {
                calificacionExistente.parcial2 = parciales.parcial2;
            }
            if (parciales.parcial3 !== undefined) {
                calificacionExistente.parcial3 = parciales.parcial3;
            }
            await calificacionExistente.save();
        } else {
            if (parciales.parcial1 !== undefined || parciales.parcial2 !== undefined || parciales.parcial3 !== undefined) {
                await Calificacion.create({
                    estudianteId,
                    claseId,
                    parcial1: parciales.parcial1, 
                    parcial2: parciales.parcial2 !== "" ? parciales.parcial2 : null,
                    parcial3: parciales.parcial3 !== "" ? parciales.parcial3 : null
                });
            } else {
                throw new Error("No se puede crear una calificación sin parciales válidos.");
            }
        }
    } catch (error) {
        throw error;
    }
};

const obtenerCalificacion = async (estudianteId, claseId) => {
    try {
        const calificacion = await Calificacion.findOne({
            where: { estudianteId, claseId }
        });
        return calificacion || { parcial1: null, parcial2: null, parcial3: null }; // Retorna null si no hay calificación
    } catch (error) {
        throw error; 
    }    
};

module.exports = { actualizarCalificacion, obtenerCalificacion };
