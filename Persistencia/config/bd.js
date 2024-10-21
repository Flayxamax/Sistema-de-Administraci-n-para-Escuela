const { Sequelize } = require('sequelize');

// Configuración de conexión a la base de datos
const sequelize = new Sequelize('escuela_idiomas', 'root', 'Movagro123.,', {
    host: 'localhost',
    dialect: 'mysql',
});

// Función para probar la conexión
const probarConexion = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

// Sincronización de tablas
const sincronizarTablas = async () => {
    try {
        await sequelize.sync({ force: true }); // Elimina y crea las tablas nuevamente
        console.log('¡Las tablas se han sincronizado correctamente!');
    } catch (error) {
        console.error('Error al sincronizar las tablas:', error);
    } finally {
        await sequelize.close();
    }
};

(async () => {
    await probarConexion();
    await sincronizarTablas();
})();

module.exports = sequelize;
