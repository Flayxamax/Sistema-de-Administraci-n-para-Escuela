const { DataTypes } = require('sequelize');
const sequelize = require('../Config/bd');

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
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    aula: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'clases',
    timestamps: false,
});

module.exports = Clase;
