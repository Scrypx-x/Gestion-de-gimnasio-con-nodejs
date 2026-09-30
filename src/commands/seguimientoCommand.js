import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarInfo, mostrarTabla } from '../utils/console.js';
import { hoy, seleccionarCliente, seleccionarContratoActivo } from './helpers.js';

export class SeguimientoCommand extends BaseCommand {
  constructor({ seguimientoService, clienteService, contratoService }) {
    super();
    this.seguimientoService = seguimientoService;
    this.clienteService = clienteService;
    this.contratoService = contratoService;
  }

  get titulo() {
    return 'Seguimiento físico';
  }

  acciones() {
    return {
      'Registrar seguimiento': () => this.registrar(),
      'Ver historial de un cliente': () => this.historial(),
      'Ver evolución de un cliente': () => this.evolucion()
    };
  }

  async registrar() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const idContrato = await seleccionarContratoActivo(this.contratoService, idCliente, { opcional: true });

    const medidas = await inquirer.prompt([
      { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):', default: hoy() },
      { type: 'input', name: 'peso', message: 'Peso (kg, opcional):' },
      { type: 'input', name: 'grasaCorporal', message: 'Grasa corporal % (opcional):' },
      { type: 'input', name: 'cintura', message: 'Cintura (cm, opcional):' },
      { type: 'input', name: 'pecho', message: 'Pecho (cm, opcional):' },
      { type: 'input', name: 'brazo', message: 'Brazo (cm, opcional):' },
      { type: 'input', name: 'pierna', message: 'Pierna (cm, opcional):' },
      { type: 'input', name: 'foto', message: 'Ruta de foto (opcional):' },
      { type: 'input', name: 'comentarios', message: 'Comentarios (opcional):' }
    ]);

    const id = await this.seguimientoService.registrar({ idCliente, idContrato, ...medidas });
    mostrarExito(`Seguimiento registrado con ID ${id}.`);
  }

  async historial() {
    const idCliente = await seleccionarCliente(this.clienteService);
    mostrarTabla(await this.seguimientoService.listarPorCliente(idCliente), 'El cliente no tiene seguimientos.');
  }

  async evolucion() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const evolucion = await this.seguimientoService.evolucion(idCliente);

    if (!evolucion || evolucion.length === 0) {
      mostrarInfo('Se necesitan al menos dos registros con la misma medida para calcular la evolución.');
      return;
    }
    console.table(evolucion);
  }
}
