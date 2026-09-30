import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarTabla } from '../utils/console.js';
import { seleccionarPlan } from './helpers.js';

export class PlanCommand extends BaseCommand {
  constructor(planService) {
    super();
    this.planService = planService;
  }

  get titulo() {
    return 'Planes de entrenamiento';
  }

  acciones() {
    return {
      'Listar': () => this.listar(),
      'Crear': () => this.crear(),
      'Editar': () => this.editar(),
      'Activar / desactivar': () => this.cambiarEstado()
    };
  }

  async listar() {
    mostrarTabla(await this.planService.listar(), 'No hay planes registrados.');
  }

  async crear() {
    const datos = await inquirer.prompt(this.#preguntas());
    const id = await this.planService.crear(datos);
    mostrarExito(`Plan creado con ID ${id}.`);
  }

  async editar() {
    const id = await seleccionarPlan(this.planService, { mensaje: 'Plan a editar:' });
    const actual = await this.planService.obtener(id);

    const datos = await inquirer.prompt(this.#preguntas({
      nombre: actual.nombre,
      descripcion: actual.descripcion ?? '',
      duracionMeses: actual.duracion_meses,
      metaFisica: actual.meta_fisica ?? '',
      nivel: actual.nivel,
      precio: actual.precio
    }));

    await this.planService.actualizar(id, datos);
    mostrarExito('Plan actualizado.');
  }

  async cambiarEstado() {
    const id = await seleccionarPlan(this.planService);
    const actual = await this.planService.obtener(id);
    const nuevo = actual.estado === 'activo' ? 'inactivo' : 'activo';

    await this.planService.cambiarEstado(id, nuevo);
    mostrarExito(`Plan ahora está ${nuevo}.`);
  }

  #preguntas(d = {}) {
    return [
      { type: 'input', name: 'nombre', message: 'Nombre:', default: d.nombre },
      { type: 'input', name: 'descripcion', message: 'Descripción:', default: d.descripcion },
      { type: 'number', name: 'duracionMeses', message: 'Duración en meses:', default: d.duracionMeses },
      { type: 'input', name: 'metaFisica', message: 'Meta física:', default: d.metaFisica },
      {
        type: 'list',
        name: 'nivel',
        message: 'Nivel:',
        choices: ['principiante', 'intermedio', 'avanzado'],
        default: d.nivel
      },
      { type: 'number', name: 'precio', message: 'Precio:', default: d.precio }
    ];
  }
}
