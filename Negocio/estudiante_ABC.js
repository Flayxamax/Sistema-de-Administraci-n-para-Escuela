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

// Función para buscar estudiantes por coincidencia de nombre
async function buscarEstudiantes(nombre) {
    try {
        const estudiantes = await Estudiante.findAll({
            where: {
                [Op.or]: [  
                    { nombre: { [Op.like]: `%${nombre}%` } },
                    { apellido: { [Op.like]: `%${nombre}%` } }
                ]
            },
            attributes: ['nombre', 'apellido'],
        });
        return estudiantes;
    } catch (error) {
        throw new Error('Error al buscar estudiantes: ' + error.message);
    }
}

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

module.exports = { registrarEstudiante, buscarEstudiantes, obtenerEstudiantePorId };