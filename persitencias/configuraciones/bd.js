const { Sequelize } = require('sequelize');

// Configuración de conexión a la base de datos
const sequelize = new Sequelize('escuela_idiomas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

// Función para probar la conexión
const probarConexion = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
       
    }
};

// Sincronización de tablas
const sincronizarTablas = async () => {
    try {
        await sequelize.sync();
    } catch (error) {
        
    }
};

(async () => {
    await probarConexion();
    await sincronizarTablas();
})();

module.exports = sequelize;
