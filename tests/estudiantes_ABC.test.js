const { registrarEstudiante, buscarEstudiante, obtenerEstudiantePorId } = require('../Negocio/estudiante_ABC'); 
const Estudiante = require('../Persistencia/Modelos/estudiante'); 
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('escuela_idiomas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
});

jest.mock('../Persistencia/Modelos/estudiante'); 

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn(); 
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100)); 
    await sequelize.close();
});

describe('Pruebas unitarias Estudiantes_ABC', () => {
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

        const resultado = await buscarEstudiante(busqueda);

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
});


