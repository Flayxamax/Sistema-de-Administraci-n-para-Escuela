const { Op } = require('sequelize');
const Estudiante = require('../Persistencia/Modelos/estudiante');
const Calificacion = require('../Persistencia/Modelos/calificaciones');
const EstudianteClase = require('../Persistencia/Modelos/estudianteClase'); 
const EstudiantesClases = require('../Persistencia/Modelos/estudianteClase');

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
            attributes: ['id', 'nombre', 'apellido', 'correo'],
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

//Editar un Estudiante
const editarEstudiante = async (id, datosActualizados) =>{
   try{
        const estudiante = await Estudiante.findByPk(id);

        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        } 

        // Actualizar los valores del estudiante
        Object.assign(estudiante, datosActualizados);

        // Guardar los cambios en la base de datos
        await estudiante.save();

        console.log('Estudiante actualizado:', estudiante);
        return estudiante;   
   }catch (error){
        console.error('Error al actualizar la informacion del Estudiante:', error);
        throw error;
   }
}

//Eliminar un Estudiante
const eliminarEstudiante = async (id) => {
    try {
        const estudiante = await Estudiante.findByPk(id);

        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }

        // Eliminar asociaciones en la tabla estudiantes_clases
        await EstudianteClase.destroy({ where: { estudianteId: id } });

        // Eliminar las calificaciones asociadas
        await Calificacion.destroy({ where: { estudianteId: id } });

        // Eliminar el estudiante
        await estudiante.destroy();
        console.log('Estudiante eliminado:', estudiante);
        return { message: 'Estudiante eliminado con éxito' };
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        throw error;
    }
};

module.exports = { registrarEstudiante, buscarEstudiantes, obtenerEstudiantePorId, editarEstudiante, eliminarEstudiante };