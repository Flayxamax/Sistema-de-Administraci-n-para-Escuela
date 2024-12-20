const { actualizarCalificacion } = require('../Negocio/calificaciones_ABC'); 
const Calificacion = require('../Persistencia/Modelos/calificaciones'); 
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('escuela_idiomas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
});

jest.mock('../Persistencia/Modelos/calificaciones'); 

beforeAll(() => {
    console.log = jest.fn(); 
    console.error = jest.fn(); 
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100)); 
    await sequelize.close();
});

describe('Pruebas unitarias para Calificaciones_ABC', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('Actualizar calificación existente', async () => {
        const estudianteId = 1;
        const claseId = 1;
        const nuevaCalificacion = 8.5;
        const calificacionMock = { estudianteId, claseId, calificacion: 7 };

        Calificacion.findOne.mockResolvedValue(calificacionMock); 
        calificacionMock.save = jest.fn().mockResolvedValue(); 

        await actualizarCalificacion(estudianteId, claseId, nuevaCalificacion);

        expect(Calificacion.findOne).toHaveBeenCalledWith({ where: { estudianteId, claseId } });
        expect(calificacionMock.calificacion).toBe(nuevaCalificacion);
        expect(calificacionMock.save).toHaveBeenCalled();
    });

    test('Crear nueva calificación si no existe', async () => {
        const estudianteId = 1;
        const claseId = 1;
        const nuevaCalificacion = 9;

        Calificacion.findOne.mockResolvedValue(null); 
        Calificacion.create.mockResolvedValue({ estudianteId, claseId, calificacion: nuevaCalificacion }); 

        await actualizarCalificacion(estudianteId, claseId, nuevaCalificacion);

        expect(Calificacion.findOne).toHaveBeenCalledWith({ where: { estudianteId, claseId } });
        expect(Calificacion.create).toHaveBeenCalledWith({ estudianteId, claseId, calificacion: nuevaCalificacion });
    });

    test('Lanzar un error si ocurre un problema', async () => {
        const estudianteId = 1;
        const claseId = 1;
        const nuevaCalificacion = 5;

        Calificacion.findOne.mockRejectedValue(new Error('Error en la búsqueda')); 

        await expect(actualizarCalificacion(estudianteId, claseId, nuevaCalificacion)).rejects.toThrow('Error en la búsqueda');
    });

});

