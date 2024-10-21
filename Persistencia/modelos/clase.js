const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Clase = sequelize.define('Clase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    tableName: 'clases',
    timestamps: false,
});

module.exports = Clase;
