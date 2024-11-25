const { registrarPago, obtenerPagos, eliminarPago } = require('../Negocio/pagos_ABC');
const Pago = require('../Persistencia/Modelos/pagos');

jest.mock('../Persistencia/Modelos/pagos');

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Pruebas unitarias para Pagos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Registrar un nuevo pago', async () => {
        const nombreEstudiante = 'Estudiante 1';
        const mes = 'Enero';
        const monto = 1000;

        Pago.findOne.mockResolvedValue(null);
        Pago.create.mockResolvedValue({ nombreEstudiante, mes, monto });

        await registrarPago(nombreEstudiante, mes, monto);

        expect(Pago.findOne).toHaveBeenCalledWith({ where: { nombreEstudiante, mes } });
        expect(Pago.create).toHaveBeenCalledWith({ nombreEstudiante, mes, monto });
    });

    test('Actualizar un pago existente', async () => {
        const nombreEstudiante = 'Estudiante 1';
        const mes = 'Enero';
        const nuevoMonto = 1200;

        const pagoExistente = { nombreEstudiante, mes, monto: 1000, save: jest.fn().mockResolvedValue() };
        Pago.findOne.mockResolvedValue(pagoExistente);

        await registrarPago(nombreEstudiante, mes, nuevoMonto);

        expect(Pago.findOne).toHaveBeenCalledWith({ where: { nombreEstudiante, mes } });
        expect(pagoExistente.monto).toBe(nuevoMonto);
        expect(pagoExistente.save).toHaveBeenCalled();
    });

    test('Obtener todos los pagos', async () => {
        const pagosMock = [
            { nombreEstudiante: 'Estudiante 1', mes: 'Enero', monto: 1000 },
            { nombreEstudiante: 'Estudiante 2', mes: 'Febrero', monto: 1500 },
        ];

        Pago.findAll.mockResolvedValue(pagosMock);

        const pagos = await obtenerPagos();

        expect(Pago.findAll).toHaveBeenCalled();
        expect(pagos).toEqual(pagosMock);
    });

    test('Eliminar un pago existente', async () => {
        const nombreEstudiante = 'Estudiante 1';
        const mes = 'Enero';

        Pago.destroy.mockResolvedValue(1); // 1 significa que un registro fue eliminado

        const resultado = await eliminarPago(nombreEstudiante, mes);

        expect(Pago.destroy).toHaveBeenCalledWith({ where: { nombreEstudiante, mes } });
        expect(resultado).toBe(1);
    });

    test('Eliminar un pago inexistente', async () => {
        const nombreEstudiante = 'Estudiante 3';
        const mes = 'Marzo';

        Pago.destroy.mockResolvedValue(0); // 0 significa que no se encontró el registro para eliminar

        const resultado = await eliminarPago(nombreEstudiante, mes);

        expect(Pago.destroy).toHaveBeenCalledWith({ where: { nombreEstudiante, mes } });
        expect(resultado).toBe(0);
    });

    test('Lanzar error si ocurre un problema al registrar pago', async () => {
        Pago.findOne.mockRejectedValue(new Error('Error en la búsqueda de pago'));

        await expect(registrarPago('Estudiante X', 'Abril', 1000)).rejects.toThrow('Error en la búsqueda de pago');
    });

    test('Lanzar error si ocurre un problema al obtener pagos', async () => {
        Pago.findAll.mockRejectedValue(new Error('Error al obtener pagos'));

        await expect(obtenerPagos()).rejects.toThrow('Error al obtener pagos');
    });

    test('Lanzar error si ocurre un problema al eliminar pago', async () => {
        Pago.destroy.mockRejectedValue(new Error('Error al eliminar pago'));

        await expect(eliminarPago('Estudiante X', 'Abril')).rejects.toThrow('Error al eliminar pago');
    });
});
