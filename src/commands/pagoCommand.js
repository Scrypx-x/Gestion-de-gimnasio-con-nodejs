import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarTabla } from '../utils/console.js';
import { seleccionarCliente, seleccionarContratoActivo } from './helpers.js';

export class PagoCommand extends BaseCommand {
  constructor({ pagoService, clienteService, contratoService }) {
    super();
    this.pagoService = pagoService;
    this.clienteService = clienteService;
    this.contratoService = contratoService;
  }

  get titulo() {
    return 'Pagos';
  }

  acciones() {
    return {
      'Listar todos': () => this.listar(),
      'Pagos de un cliente': () => this.listarPorCliente(),
      'Registrar pago': () => this.registrar(),
      'Cancelar pago': () => this.cancelar(),
      'Estado de cuenta de un contrato': () => this.estadoDeCuenta()
    };
  }

  async listar() {
    mostrarTabla(await this.pagoService.listar(), 'No hay pagos registrados.');
  }

  async listarPorCliente() {
    const idCliente = await seleccionarCliente(this.clienteService);
    mostrarTabla(await this.pagoService.listarPorCliente(idCliente), 'El cliente no tiene pagos.');
  }

  async registrar() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const idContrato = await seleccionarContratoActivo(this.contratoService, idCliente, { opcional: true });

    const { monto, metodoPago } = await inquirer.prompt([
      { type: 'number', name: 'monto', message: 'Monto:' },
      { type: 'list', name: 'metodoPago', message: 'Método de pago:', choices: ['efectivo', 'tarjeta', 'transferencia'] }
    ]);

    const id = await this.pagoService.registrarPago({ idCliente, idContrato, monto, metodoPago });
    mostrarExito(`Pago registrado con ID ${id} y su ingreso financiero fue generado.`);
  }

  async cancelar() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const pagos = (await this.pagoService.listarPorCliente(idCliente)).filter((p) => p.estado === 'completado');
    if (pagos.length === 0) throw new Error('El cliente no tiene pagos completados.');

    const { idPago } = await inquirer.prompt([{
      type: 'list',
      name: 'idPago',
      message: 'Pago a cancelar:',
      choices: pagos.map((p) => ({
        name: `#${p.id_pago} - Q${p.monto} (${p.metodo_pago}) ${p.fecha_pago}`,
        value: p.id_pago
      }))
    }]);

    await this.pagoService.cancelarPago(idPago);
    mostrarExito('Pago cancelado y movimiento de reversión registrado.');
  }

  async estadoDeCuenta() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const idContrato = await seleccionarContratoActivo(this.contratoService, idCliente);
    console.table([await this.pagoService.estadoDeCuenta(idContrato)]);
  }
}
