const { registrarClase, buscarClase, asignarEstudianteAClase, obtenerClases, obtenerEstudiantesPorClase } = require('../Negocio/clases_ABC'); 
const Clase = require('../Persistencia/Modelos/clase');
const Estudiante = require('../Persistencia/Modelos/estudiante'); 
const EstudianteClase = require('../Persistencia/Modelos/estudianteClase');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('escuela_idiomas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
});

jest.mock('../Persistencia/Modelos/clase');
jest.mock('../Persistencia/Modelos/estudiante');
jest.mock('../Persistencia/Modelos/estudianteClase');

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100)); 
    await sequelize.close();
});

describe('Pruebas unitarias Clases_ABC', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('Registrar una nueva clase', async () => {
        const datos = { nombre: 'Ingles' };
        Clase.create.mockResolvedValue(datos); 

        const resultado = await registrarClase(datos);

        expect(Clase.create).toHaveBeenCalledWith(datos);
        expect(resultado).toEqual(datos);
    });

    test('Buscar clases por nombre', async () => {
        const nombre = 'Ingles';
        const clasesMock = [{ nombre: 'Ingles' }];
        Clase.findAll.mockResolvedValue(clasesMock); 

        const resultado = await buscarClase(nombre);

        expect(Clase.findAll).toHaveBeenCalled();
        expect(resultado).toEqual(clasesMock);
    });

    test('Asignar un estudiante a una clase', async () => {
        const alumnoId = 1;
        const claseId = 1;
        const estudianteMock = { id: alumnoId, nombre: 'Juan' };
        const claseMock = { id: claseId, nombre: 'Ingles' };
        const asignacionMock = { estudianteId: alumnoId, claseId: claseId };

        Estudiante.findByPk.mockResolvedValue(estudianteMock);
        Clase.findByPk.mockResolvedValue(claseMock);
        EstudianteClase.findOne.mockResolvedValue(null); 
        EstudianteClase.create.mockResolvedValue(asignacionMock); 

        const resultado = await asignarEstudianteAClase(alumnoId, claseId);

        expect(Estudiante.findByPk).toHaveBeenCalledWith(alumnoId);
        expect(Clase.findByPk).toHaveBeenCalledWith(claseId);
        expect(EstudianteClase.findOne).toHaveBeenCalled();
        expect(EstudianteClase.create).toHaveBeenCalledWith(asignacionMock);
        expect(resultado).toEqual(asignacionMock);
    });

    test('Lanzar error al asignar un estudiante a una clase no existente', async () => {
        const alumnoId = 1;
        const claseId = 99;
        Estudiante.findByPk.mockResolvedValue({ id: alumnoId });
        Clase.findByPk.mockResolvedValue(null); 

        await expect(asignarEstudianteAClase(alumnoId, claseId)).rejects.toThrow('El Estudiante o la clase no existen');
    });

    test('Obtener todas las clases', async () => {
        const clasesMock = [{ nombre: 'Ingles' }, { nombre: 'Portugues' }];
        Clase.findAll.mockResolvedValue(clasesMock); 

        const resultado = await obtenerClases();

        expect(Clase.findAll).toHaveBeenCalled();
        expect(resultado).toEqual(clasesMock);
    });

    test('Obtener estudiantes por clase', async () => {
        const idClase = 1;
        const estudiantesMock = [{ estudianteId: 1, claseId: idClase }];
        EstudianteClase.findAll.mockResolvedValue(estudiantesMock); 

        const resultado = await obtenerEstudiantesPorClase(idClase);

        expect(EstudianteClase.findAll).toHaveBeenCalledWith({ where: { claseId: idClase } });
        expect(resultado).toEqual(estudiantesMock);
    });

    test('Retornar error si no hay estudiantes para la clase', async () => {
        const idClase = 1;
        EstudianteClase.findAll.mockResolvedValue([]); 

        const resultado = await obtenerEstudiantesPorClase(idClase);

        expect(resultado).toEqual({ error: 'No hay estudiantes para esta clase' });
    });


});


