const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/bd');

class EstudiantesClases extends Model {}

EstudiantesClases.init({
    estudianteId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Estudiantes',
            key: 'id'
        },
        primaryKey: true
    },
    claseId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Clases', 
            key: 'id'
        },
        primaryKey: true
    },
}, {
    sequelize,
    modelName: 'EstudiantesClases',
    tableName: 'estudiantes_Clases',
    timestamps: true // Cambiado a true para habilitar el manejo automático de createdAt y updatedAt
});

module.exports = EstudiantesClases;