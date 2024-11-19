const { registrarEstudiante, buscarEstudiantes, obtenerEstudiantePorId, editarEstudiante, eliminarEstudiante } = require('../Negocio/estudiante_ABC');
const Estudiante = require('../Persistencia/Modelos/estudiante');
const { Sequelize } = require('sequelize');

jest.mock('../Persistencia/Modelos/estudiante');

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Pruebas unitarias para Estudiantes_ABC', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    

    test('Registrar un nuevo estudiante', async () => {
        const datos = { nombre: 'Juan', apellido: 'Pérez' };
        Estudiante.create.mockResolvedValue(datos); 

        const resultado = await registrarEstudiante(datos);

        expect(Estudiante.create).toHaveBeenCalledWith(datos);
        expect(resultado).toEqual(datos);
    });

    test('Buscar estudiantes por nombre', async () => {
        const busqueda = 'Juan';
        const estudiantesMock = [{ nombre: 'Juan', apellido: 'Pérez' }];
        Estudiante.findAll.mockResolvedValue(estudiantesMock); 

        const resultado = await buscarEstudiantes(busqueda);

        expect(Estudiante.findAll).toHaveBeenCalled(); 
        expect(resultado).toEqual(estudiantesMock);
    });

    test('Obtener estudiante por ID', async () => {
        const id = 1;
        const estudianteMock = { id: 1, nombre: 'Juan', apellido: 'Pérez' };
        Estudiante.findByPk.mockResolvedValue(estudianteMock); 

        const resultado = await obtenerEstudiantePorId(id);

        expect(Estudiante.findByPk).toHaveBeenCalledWith(id);
        expect(resultado).toEqual(estudianteMock);
    });

    test('Lanzar error al no encontrar estudiante por Id', async () => {
        const id = 99;
        Estudiante.findByPk.mockResolvedValue(null); 

        await expect(obtenerEstudiantePorId(id)).rejects.toThrow('Estudiante no encontrado');
    });

    test('Editar un estudiante existente', async () => {
        const id = 1;
        const datosActualizados = { nombre: 'Juan Carlos', apellido: 'Gámez Carballo' };
        const estudianteMock = { id: 1, nombre: 'Juan', apellido: 'Gámez', save: jest.fn() };

        Estudiante.findByPk.mockResolvedValue(estudianteMock);

        const resultado = await editarEstudiante(id, datosActualizados);

        expect(Estudiante.findByPk).toHaveBeenCalledWith(id);
        expect(estudianteMock.save).toHaveBeenCalled();
        expect(resultado).toEqual(expect.objectContaining(datosActualizados));
    });

    test('Lanzar error al editar un estudiante inexistente', async () => {
        const id = 99;
        const datosActualizados = { nombre: 'nombre', apellido: 'apellido' };

        Estudiante.findByPk.mockResolvedValue(null);

        await expect(editarEstudiante(id, datosActualizados)).rejects.toThrow('Estudiante no encontrado');
        expect(Estudiante.findByPk).toHaveBeenCalledWith(id);
    });

    test('Eliminar un estudiante existente', async () => {
        const id = 1;
        const estudianteMock = { id: 1, nombre: 'Juan', apellido: 'Gámez', destroy: jest.fn() };

        Estudiante.findByPk.mockResolvedValue(estudianteMock);

        const resultado = await eliminarEstudiante(id);

        expect(Estudiante.findByPk).toHaveBeenCalledWith(id);
        expect(estudianteMock.destroy).toHaveBeenCalled();
        expect(resultado).toEqual({ message: 'Estudiante eliminado con éxito' });
    });

    test('Lanzar error al eliminar un estudiante inexistente', async () => {
        const id = 99;

        Estudiante.findByPk.mockResolvedValue(null);

        await expect(eliminarEstudiante(id)).rejects.toThrow('Estudiante no encontrado');
        expect(Estudiante.findByPk).toHaveBeenCalledWith(id);
    });

});



