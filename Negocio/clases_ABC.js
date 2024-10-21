const Clase = require('../Persistencia/modelos/clase');

// Registrar un nuevo estudiante
const registrarClase = async (datos) => {
    try {
        const nuevaClase = await Clase.create(datos);
        console.log('Clase registrada:', nuevaClase);
        return nuevaClase;
    } catch (error) {
        console.error('Error al registrar la Clase:', error);
        throw error;
    }
};
module.exports = { registrarClase };