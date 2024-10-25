const { Op } = require('sequelize');
const Estudiante = require('../Persistencia/Modelos/estudiante');

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
const buscarEstudiante = async (busqueda) => {
    try {
        const estudiantes = await Estudiante.findAll({
            where: {
                [Op.or]: [
                    {
                        nombre: {
                            [Op.like]: `%${busqueda}%`
                        }
                    },
                    {
                        apellido: {
                            [Op.like]: `%${busqueda}%`
                        }
                    },
                    {
                        [Op.and]: [
                            { nombre: { [Op.like]: `%${busqueda.split(' ')[0]}%` } },
                            { apellido: { [Op.like]: `%${busqueda.split(' ')[1] || ''}%` } }
                        ]
                    }
                ]
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