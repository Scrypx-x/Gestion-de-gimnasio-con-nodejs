import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarInfo, mostrarTabla } from '../utils/console.js';
import { CATEGORIAS_MOVIMIENTO } from '../models/MovimientoFinanciero.js';
import { confirmar, seleccionarCliente } from './helpers.js';

export class FinanzasCommand extends BaseCommand {
  constructor({ finanzaService, clienteService }) {
    super();
    this.finanzaService = finanzaService;
    this.clienteService = clienteService;
  }

  get titulo() {
    return 'Finanzas';
  }

  acciones() {
    return {
      'Listar movimientos': () => this.listar(),
      'Registrar ingreso': () => this.registrar('ingreso'),
      'Registrar egreso': () => this.registrar('egreso'),
      'Resumen financiero': () => this.resumen()
    };
  }

  async #pedirRango() {
    return inquirer.prompt([
      { type: 'input', name: 'desde', message: 'Desde (YYYY-MM-DD, vacío = sin límite):' },
      { type: 'input', name: 'hasta', message: 'Hasta (YYYY-MM-DD, vacío = sin límite):' }
    ]);
  }

  async listar() {
    const rango = await this.#pedirRango();
    mostrarTabla(await this.finanzaService.listar(rango), 'No hay movimientos en ese rango.');
  }

  async registrar(tipo) {
    const datos = await inquirer.prompt([
      { type: 'list', name: 'categoria', message: 'Categoría:', choices: CATEGORIAS_MOVIMIENTO },
      { type: 'number', name: 'monto', message: 'Monto:' },
      { type: 'input', name: 'descripcion', message: 'Descripción (opcional):' },
      { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD, vacío = hoy):' }
    ]);

    let idCliente = null;
    if (await confirmar('¿Asociarlo a un cliente?')) {
      idCliente = await seleccionarCliente(this.clienteService);
    }

    const id = await this.finanzaService.registrarMovimiento({ tipo, idCliente, ...datos });
    mostrarExito(`Movimiento registrado con ID ${id}.`);
  }

  async resumen() {
    const rango = await this.#pedirRango();
    const { ingresos, egresos, balance, porCategoria } = await this.finanzaService.resumen(rango);

    console.table([{ ingresos, egresos, balance }]);
    mostrarTabla(porCategoria, 'Sin movimientos para desglosar.');
    if (balance < 0) mostrarInfo('El balance del período es negativo.');
  }
}
