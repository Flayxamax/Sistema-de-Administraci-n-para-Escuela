const Estudiante = require('../Persistencia/modelos/estudiante');

// Registrar un nuevo estudiante
const registrarEstudiante = async (datos) => {
    try {
        const nuevoEstudiante = await Estudiante.create(datos);
        console.log('Estudiante registrado:', nuevoEstudiante);
        return nuevoEstudiante;
    } catch (error) {
        console.error('Error al registrar estudiante:', error);
        throw error;
    }
};
module.exports = { registrarEstudiante };
