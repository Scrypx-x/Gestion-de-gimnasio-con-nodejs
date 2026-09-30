import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarInfo, mostrarTabla } from '../utils/console.js';
import { confirmar, hoy, seleccionarCliente, seleccionarContratoActivo, seleccionarPlan } from './helpers.js';

export class ContratoCommand extends BaseCommand {
  constructor({ contratoService, clienteService, planService }) {
    super();
    this.contratoService = contratoService;
    this.clienteService = clienteService;
    this.planService = planService;
  }

  get titulo() {
    return 'Contratos';
  }

  acciones() {
    return {
      'Listar todos': () => this.listar(),
      'Contratos de un cliente': () => this.listarPorCliente(),
      'Asignar plan a cliente': () => this.asignar(),
      'Cancelar contrato': () => this.cancelar()
    };
  }

  async listar() {
    mostrarTabla(await this.contratoService.listar(), 'No hay contratos registrados.');
  }

  async listarPorCliente() {
    const idCliente = await seleccionarCliente(this.clienteService);
    mostrarTabla(await this.contratoService.listarPorCliente(idCliente), 'El cliente no tiene contratos.');
  }

  async asignar() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const idPlan = await seleccionarPlan(this.planService, { soloActivos: true });

    const { fechaInicio, condiciones } = await inquirer.prompt([
      { type: 'input', name: 'fechaInicio', message: 'Fecha de inicio (YYYY-MM-DD):', default: hoy() },
      { type: 'input', name: 'condiciones', message: 'Condiciones (opcional):' }
    ]);

    const id = await this.contratoService.asignarPlan({ idCliente, idPlan, fechaInicio, condiciones });
    mostrarExito(`Contrato creado con ID ${id}.`);
  }

  async cancelar() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const idContrato = await seleccionarContratoActivo(this.contratoService, idCliente, { mensaje: 'Contrato a cancelar:' });

    if (!(await confirmar('Se cancelará el contrato y se eliminará su seguimiento físico. ¿Continuar?'))) {
      mostrarInfo('Operación cancelada.');
      return;
    }

    const { seguimientosEliminados, nutricionCancelados } = await this.contratoService.cancelarPlan(idContrato);
    mostrarExito(`Contrato cancelado. Seguimientos eliminados: ${seguimientosEliminados}. Planes de nutrición cancelados: ${nutricionCancelados}.`);
  }
}
