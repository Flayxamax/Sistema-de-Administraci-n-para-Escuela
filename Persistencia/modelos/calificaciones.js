const { DataTypes } = require('sequelize');
const sequelize = require('../Config/bd');

const Calificacion = sequelize.define('Calificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    calificacion: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 10,
        },
    },
    estudianteId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estudiantes',
            key: 'id',
        },
    },
    claseId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clases', 
            key: 'id',
        },
    },
}, {
    tableName: 'calificaciones',
    timestamps: true, 
});

module.exports = Calificacion;
