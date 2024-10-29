const { DataTypes } = require('sequelize');
const sequelize = require('../Config/bd'); 

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombreEstudiante: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mes: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0, 
        },
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
    },
}, {
    tableName: 'pagos',
    timestamps: false, 
});

module.exports = Pago;
