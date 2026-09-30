import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarInfo, mostrarTabla } from '../utils/console.js';
import { hoy, seleccionarCliente, seleccionarContratoActivo } from './helpers.js';
import { COMIDAS, DIAS_SEMANA } from '../models/PlanAlimento.js';

export class NutricionCommand extends BaseCommand {
  constructor({ nutricionService, clienteService, contratoService }) {
    super();
    this.nutricionService = nutricionService;
    this.clienteService = clienteService;
    this.contratoService = contratoService;
  }

  get titulo() {
    return 'Nutrición';
  }

  acciones() {
    return {
      'Listar alimentos': () => this.listarAlimentos(),
      'Crear alimento': () => this.crearAlimento(),
      'Crear plan de nutrición': () => this.crearPlan(),
      'Planes de un cliente': () => this.listarPlanes(),
      'Agregar alimento a un plan': () => this.agregarAlimento(),
      'Ver detalle de un plan': () => this.verPlan(),
      'Cambiar estado de un plan': () => this.cambiarEstado()
    };
  }

  async listarAlimentos() {
    mostrarTabla(await this.nutricionService.listarAlimentos(), 'No hay alimentos registrados.');
  }

  async crearAlimento() {
    const datos = await inquirer.prompt([
      { type: 'input', name: 'nombre', message: 'Nombre del alimento:' },
      { type: 'number', name: 'caloriasPorPorcion', message: 'Calorías por porción:' },
      { type: 'input', name: 'unidad', message: 'Unidad (g, taza, unidad...):' }
    ]);
    const id = await this.nutricionService.crearAlimento(datos);
    mostrarExito(`Alimento creado con ID ${id}.`);
  }

  async crearPlan() {
    const idCliente = await seleccionarCliente(this.clienteService);
    const idContrato = await seleccionarContratoActivo(this.contratoService, idCliente, { opcional: true });

    const datos = await inquirer.prompt([
      { type: 'input', name: 'nombre', message: 'Nombre del plan:' },
      { type: 'input', name: 'objetivo', message: 'Objetivo (opcional):' },
      { type: 'input', name: 'fechaInicio', message: 'Fecha de inicio (YYYY-MM-DD):', default: hoy() },
      { type: 'input', name: 'fechaFin', message: 'Fecha final (YYYY-MM-DD, opcional):' }
    ]);

    const id = await this.nutricionService.crearPlan({ idCliente, idContrato, ...datos });
    mostrarExito(`Plan de nutrición creado con ID ${id}.`);
  }

  async listarPlanes() {
    const idCliente = await seleccionarCliente(this.clienteService);
    mostrarTabla(await this.nutricionService.listarPlanesPorCliente(idCliente), 'El cliente no tiene planes de nutrición.');
  }

  async #elegirPlan({ soloActivos = false } = {}) {
    const idCliente = await seleccionarCliente(this.clienteService);
    let planes = await this.nutricionService.listarPlanesPorCliente(idCliente);
    if (soloActivos) planes = planes.filter((p) => p.estado === 'activo');
    if (planes.length === 0) throw new Error('No hay planes de nutrición disponibles para ese cliente.');

    const { id } = await inquirer.prompt([{
      type: 'list',
      name: 'id',
      message: 'Plan de nutrición:',
      choices: planes.map((p) => ({ name: `#${p.id_plan_nutricion} - ${p.nombre} (${p.estado})`, value: p.id_plan_nutricion }))
    }]);
    return id;
  }

  async agregarAlimento() {
    const idPlanNutricion = await this.#elegirPlan({ soloActivos: true });

    const alimentos = await this.nutricionService.listarAlimentos();
    if (alimentos.length === 0) throw new Error('Primero crea al menos un alimento.');

    const datos = await inquirer.prompt([
      {
        type: 'list',
        name: 'idAlimento',
        message: 'Alimento:',
        choices: alimentos.map((a) => ({ name: `${a.nombre} (${a.calorias_por_porcion} kcal/${a.unidad})`, value: a.id_alimento }))
      },
      { type: 'list', name: 'diaSemana', message: 'Día:', choices: DIAS_SEMANA },
      { type: 'list', name: 'comida', message: 'Comida:', choices: COMIDAS },
      { type: 'number', name: 'cantidad', message: 'Cantidad (porciones):' }
    ]);

    const id = await this.nutricionService.agregarAlimentoAlPlan({ idPlanNutricion, ...datos });
    mostrarExito(`Alimento agregado al plan (registro ${id}).`);
  }

  async verPlan() {
    const idPlan = await this.#elegirPlan();
    const { plan, items, caloriasPorDia, totalSemanal } = await this.nutricionService.verPlan(idPlan);

    mostrarInfo(`${plan.nombre} — ${plan.objetivo ?? 'sin objetivo'} (${plan.estado})`);
    mostrarTabla(items, 'Este plan aún no tiene alimentos.');
    if (items.length > 0) {
      mostrarTabla(caloriasPorDia);
      mostrarInfo(`Total semanal: ${totalSemanal} kcal`);
    }
  }

  async cambiarEstado() {
    const idPlan = await this.#elegirPlan();
    const { estado } = await inquirer.prompt([{
      type: 'list', name: 'estado', message: 'Nuevo estado:', choices: ['activo', 'finalizado', 'cancelado']
    }]);
    await this.nutricionService.cambiarEstado(idPlan, estado);
    mostrarExito('Estado actualizado.');
  }
}
