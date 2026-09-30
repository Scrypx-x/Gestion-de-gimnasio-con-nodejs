import { ContratoFactory } from '../factories/ContratoFactory.js';
import { withTransaction } from '../utils/transaction.js';

export class ContratoService {
  constructor({ pool, clienteRepository, planRepository, contratoRepository, seguimientoRepository, nutricionRepository }) {
    this.pool = pool;
    this.clienteRepository = clienteRepository;
    this.planRepository = planRepository;
    this.contratoRepository = contratoRepository;
    this.seguimientoRepository = seguimientoRepository;
    this.nutricionRepository = nutricionRepository;
  }

  /** OPERACIÓN CRÍTICA: valida y crea el contrato de forma atómica. */
  async asignarPlan(datos) {
    return withTransaction(this.pool, async (connection) => {
      const cliente = await this.clienteRepository.findById(datos.idCliente, connection);
      if (!cliente) throw new Error('El cliente no existe.');
      if (cliente.estado !== 'activo') throw new Error('El cliente está inactivo.');

      const plan = await this.planRepository.findById(datos.idPlan, connection);
      if (!plan || plan.estado !== 'activo') throw new Error('El plan no existe o está inactivo.');

      const contrato = ContratoFactory.desdePlan({
        idCliente: datos.idCliente,
        plan,
        fechaInicio: datos.fechaInicio,
        condiciones: datos.condiciones ?? null
      });

      const solapados = await this.contratoRepository.findActivosSolapados(
        contrato.idCliente, contrato.idPlan, contrato.fechaInicio, contrato.fechaFin, connection
      );
      if (solapados.length > 0) {
        throw new Error('El cliente ya tiene un contrato activo de ese plan en ese período.');
      }

      return this.contratoRepository.create(contrato, connection);
    });
  }

  /**
   * OPERACIÓN CRÍTICA: cancela el contrato, elimina su seguimiento físico
   * y cancela los planes de nutrición ligados, todo en una sola transacción.
   */
  async cancelarPlan(idContrato) {
    return withTransaction(this.pool, async (connection) => {
      const contrato = await this.contratoRepository.findById(idContrato, connection);
      if (!contrato) throw new Error('El contrato no existe.');
      if (contrato.estado === 'cancelado') throw new Error('El contrato ya estaba cancelado.');
      if (contrato.estado === 'finalizado') throw new Error('No se puede cancelar un contrato finalizado.');

      await this.contratoRepository.cancel(idContrato, connection);
      const seguimientosEliminados = await this.seguimientoRepository.deleteByContrato(idContrato, connection);
      const nutricionCancelados = await this.nutricionRepository.cancelarPorContrato(idContrato, connection);

      return { seguimientosEliminados, nutricionCancelados };
    });
  }

  async listar() {
    await this.contratoRepository.finalizarVencidos();
    return this.contratoRepository.findAllDetallado();
  }

  async listarActivosPorCliente(idCliente) {
    await this.contratoRepository.finalizarVencidos();
    return this.contratoRepository.findActivosByCliente(idCliente);
  }

  async listarPorCliente(idCliente) {
    await this.contratoRepository.finalizarVencidos();
    return this.contratoRepository.findByCliente(idCliente);
  }
}
