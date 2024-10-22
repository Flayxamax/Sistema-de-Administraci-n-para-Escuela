const { Op } = require('sequelize');
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

// Buscar estudiantes por nombre
const buscarEstudiante = async (nombre) => {
    try {
        const estudiantes = await Estudiante.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${nombre}%`
                }
            }
        });
        return estudiantes;
    } catch (error) {
        console.error('Error al buscar estudiantes:', error);
        throw error;
    }
};

// Obtener estudiante por ID
const obtenerEstudiantePorId = async (id) => {
    try {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        return estudiante;
    } catch (error) {
        console.error('Error al obtener estudiante por ID:', error);
        throw error;
    }
};

module.exports = { registrarEstudiante, buscarEstudiante, obtenerEstudiantePorId };