const { actualizarCalificacion } = require('../Negocio/calificaciones_ABC');
const Calificacion = require('../Persistencia/Modelos/calificaciones');
const { Sequelize } = require('sequelize');

jest.mock('../Persistencia/Modelos/calificaciones');

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Pruebas unitarias para Calificaciones_ABC', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Actualizar calificación existente', async () => {
        const estudianteId = 1;
        const claseId = 1;
        const parciales = { parcial1: 8.5, parcial2: undefined, parcial3: undefined };
        const calificacionMock = { 
            estudianteId, 
            claseId, 
            parcial1: 7, 
            parcial2: 6, 
            parcial3: 5, 
            save: jest.fn().mockResolvedValue() 
        };

        Calificacion.findOne.mockResolvedValue(calificacionMock);

        await actualizarCalificacion(estudianteId, claseId, parciales);

        expect(Calificacion.findOne).toHaveBeenCalledWith({ where: { estudianteId, claseId } });
        expect(calificacionMock.parcial1).toBe(parciales.parcial1);
        expect(calificacionMock.save).toHaveBeenCalled();
    });

    test('Crear nueva calificación si no existe', async () => {
        const estudianteId = 1;
        const claseId = 1;
        const parciales = { parcial1: 9, parcial2: 8, parcial3: 7 };

        Calificacion.findOne.mockResolvedValue(null);
        Calificacion.create.mockResolvedValue({ estudianteId, claseId, ...parciales });

        await actualizarCalificacion(estudianteId, claseId, parciales);

        expect(Calificacion.findOne).toHaveBeenCalledWith({ where: { estudianteId, claseId } });
        expect(Calificacion.create).toHaveBeenCalledWith({
            estudianteId, 
            claseId, 
            parcial1: parciales.parcial1, 
            parcial2: parciales.parcial2, 
            parcial3: parciales.parcial3
        });
    });

    test('Lanzar un error si ocurre un problema', async () => {
        const estudianteId = 1;
        const claseId = 1;
        const parciales = { parcial1: 5 };

        Calificacion.findOne.mockRejectedValue(new Error('Error en la búsqueda'));

        await expect(actualizarCalificacion(estudianteId, claseId, parciales)).rejects.toThrow('Error en la búsqueda');
    });
});

