import { Alimento } from '../models/Alimento.js';
import { PlanNutricion } from '../models/PlanNutricion.js';
import { PlanAlimento } from '../models/PlanAlimento.js';

export class NutricionService {
  constructor({ nutricionRepository, alimentoRepository, planAlimentoRepository, clienteRepository, contratoRepository }) {
    this.nutricionRepository = nutricionRepository;
    this.alimentoRepository = alimentoRepository;
    this.planAlimentoRepository = planAlimentoRepository;
    this.clienteRepository = clienteRepository;
    this.contratoRepository = contratoRepository;
  }

  // ---------- Catálogo de alimentos ----------
  async crearAlimento(datos) {
    return this.alimentoRepository.create(new Alimento(datos));
  }

  async listarAlimentos() {
    return this.alimentoRepository.findAll();
  }

  // ---------- Planes de nutrición ----------
  async crearPlan(datos) {
    const plan = new PlanNutricion(datos);

    const cliente = await this.clienteRepository.findById(plan.idCliente);
    if (!cliente) throw new Error('El cliente no existe.');

    if (plan.idContrato !== null) {
      const contrato = await this.contratoRepository.findById(plan.idContrato);
      if (!contrato) throw new Error('El contrato no existe.');
      if (contrato.id_cliente !== plan.idCliente) throw new Error('El contrato no pertenece a ese cliente.');
    }

    return this.nutricionRepository.create(plan);
  }

  async listarPlanesPorCliente(idCliente) {
    return this.nutricionRepository.findByCliente(idCliente);
  }

  async cambiarEstado(idPlanNutricion, estado) {
    if (!['activo', 'finalizado', 'cancelado'].includes(estado)) throw new Error('Estado no válido.');
    await this.#obtenerPlan(idPlanNutricion);
    await this.nutricionRepository.updateEstado(idPlanNutricion, estado);
  }

  // ---------- Alimentos dentro del plan ----------
  async agregarAlimentoAlPlan(datos) {
    const item = new PlanAlimento(datos);

    const plan = await this.#obtenerPlan(item.idPlanNutricion);
    if (plan.estado !== 'activo') throw new Error('Solo se pueden editar planes de nutrición activos.');

    const alimento = await this.alimentoRepository.findById(item.idAlimento);
    if (!alimento) throw new Error('El alimento no existe.');

    return this.planAlimentoRepository.create(item);
  }

  async quitarAlimentoDelPlan(idPlanAlimento) {
    const eliminados = await this.planAlimentoRepository.delete(idPlanAlimento);
    if (eliminados === 0) throw new Error('El registro no existe.');
  }

  /** Detalle del plan con calorías por día y total semanal. */
  async verPlan(idPlanNutricion) {
    const plan = await this.#obtenerPlan(idPlanNutricion);
    const items = await this.planAlimentoRepository.findByPlan(idPlanNutricion);

    const caloriasPorDia = {};
    for (const item of items) {
      caloriasPorDia[item.dia_semana] = (caloriasPorDia[item.dia_semana] ?? 0) + Number(item.calorias);
    }

    const totalSemanal = Object.values(caloriasPorDia).reduce((a, b) => a + b, 0);

    return {
      plan,
      items,
      caloriasPorDia: Object.entries(caloriasPorDia).map(([dia, calorias]) => ({
        dia, calorias: Number(calorias.toFixed(2))
      })),
      totalSemanal: Number(totalSemanal.toFixed(2))
    };
  }

  async #obtenerPlan(id) {
    const plan = await this.nutricionRepository.findById(id);
    if (!plan) throw new Error('El plan de nutrición no existe.');
    return plan;
  }
}
