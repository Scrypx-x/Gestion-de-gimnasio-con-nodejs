import { Plan } from '../models/Plan.js';

export class PlanService {
  constructor(planRepository) {
    this.planRepository = planRepository;
  }

  async crear(datos) {
    const plan = new Plan(datos);
    return this.planRepository.create(plan);
  }

  async listar() {
    return this.planRepository.findAll();
  }

  async listarActivos() {
    return this.planRepository.findActivos();
  }

  async obtener(id) {
    const plan = await this.planRepository.findById(id);
    if (!plan) throw new Error('El plan no existe.');
    return plan;
  }

  async actualizar(id, datos) {
    const actual = await this.obtener(id);
    const plan = new Plan({ ...datos, estado: actual.estado });
    await this.planRepository.update(id, plan);
  }

  async cambiarEstado(id, estado) {
    if (!['activo', 'inactivo'].includes(estado)) throw new Error('Estado de plan no válido.');
    await this.obtener(id);
    await this.planRepository.updateEstado(id, estado);
  }
}
