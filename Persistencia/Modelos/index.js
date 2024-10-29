const Estudiante = require('./estudiante');
const Clase = require('./clase');
const Calificacion = require('./calificaciones');
const Pago = require('./pagos');

// Relaciones
Estudiante.belongsToMany(Clase, { through: 'Estudiantes_Clases' });
Clase.belongsToMany(Estudiante, { through: 'Estudiantes_Clases' });

Estudiante.hasMany(Calificacion, { foreignKey: 'estudianteId' });
Calificacion.belongsTo(Estudiante, { foreignKey: 'estudianteId' });

Clase.hasMany(Calificacion, { foreignKey: 'claseId' });
Calificacion.belongsTo(Clase, { foreignKey: 'claseId' });

Pago.belongsTo(Estudiante, { foreignKey: 'estudianteId' });
module.exports = { Estudiante, Clase, Calificacion,Pago };
