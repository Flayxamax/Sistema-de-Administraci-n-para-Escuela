const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rutasEstudiantes = require('./Negocio/Rutas/estudiantes'); 
const rutasClases = require('./Negocio/Rutas/clases');
const rutasCalificaciones = require('./Negocio/Rutas/calificaciones');
const sequelize = require('./Persistencia/Config/bd');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/estudiantes', rutasEstudiantes);
app.use('/api/clases', rutasClases);
app.use('/api/calificaciones', rutasCalificaciones);


app.use(bodyParser.json());

// Probar conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos exitosa.'))
    .catch((error) => console.error('Error al conectar con la base de datos:', error));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

