const { Op } = require('sequelize');
const Clase = require('../Persistencia/modelos/clase');
const Estudiante = require('../Persistencia/modelos/estudiante');
const EstudianteClase = require('../Persistencia/modelos/estudianteClase');

// Registrar una nueva clase
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

// Buscar clases por nombre
const buscarClase = async (nombre) => {
    try {
        const clases = await Clase.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${nombre}%`
                }
            }
        });
        return clases;
    } catch (error) {
        console.error('Error al buscar clases:', error);
        throw error;
    }
};

// Asignar un Estudiante a una clase
const asignarEstudianteAClase = async (alumnoId, claseId) => {
    try {
        console.log('Estudiante IDAAAAAAA:', alumnoId);
        console.log('Clase IDAAAAAAAAAA:', claseId); 
        const estudiante = await Estudiante.findByPk(alumnoId);
        const clase = await Clase.findByPk(claseId);
        
        if (!estudiante || !clase) {
            throw new Error('El Estudiante o la clase no existen');
        }

        const asignacion = await EstudianteClase.create({ estudianteId: alumnoId, claseId });
        console.log('Estudiante asignado a clase:', asignacion);
        return asignacion;
    } catch (error) {
        console.error('Error al asignar el Estudiante a la clase:', error);
        throw error;
    }
};

// Obtener todas las clases
const obtenerClases = async () => {
    try {
        const clases = await Clase.findAll();
        console.log('Clases encontradas:', clases);
        return clases;
    } catch (error) {
        console.error('Error al obtener clases:', error);
        throw error;
    }
};

const obtenerEstudiantesPorClase = async (idClase) => {
    try {
        const estudiantes = await EstudianteClase.findAll({
            where: { claseId: idClase }
        });
        
        if (!estudiantes.length) {
            return { error: 'No hay estudiantes para esta clase' };
        }

        return estudiantes; 
    } catch (error) {
        console.error('Error al obtener estudiantes por clase:', error);
        throw error;
    }
};


module.exports = { registrarClase, buscarClase, asignarEstudianteAClase, obtenerClases, obtenerEstudiantesPorClase };
