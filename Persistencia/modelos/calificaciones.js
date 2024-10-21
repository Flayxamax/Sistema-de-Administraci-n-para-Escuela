const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

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
    comentarios: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'calificaciones',
    timestamps: false,
});

module.exports = Calificacion;
