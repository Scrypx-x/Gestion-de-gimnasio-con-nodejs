import { PagoFactory } from '../factories/PagoFactory.js';
import { MovimientoFactory } from '../factories/MovimientoFactory.js';
import { withTransaction } from '../utils/transaction.js';

export class PagoService {
  constructor({ pool, pagoRepository, movimientoRepository, clienteRepository, contratoRepository }) {
    this.pool = pool;
    this.pagoRepository = pagoRepository;
    this.movimientoRepository = movimientoRepository;
    this.clienteRepository = clienteRepository;
    this.contratoRepository = contratoRepository;
  }

  /** OPERACIÓN CRÍTICA: pago + movimiento financiero deben quedar juntos. */
  async registrarPago(datos) {
    const pago = PagoFactory.crear(datos);

    return withTransaction(this.pool, async (connection) => {
      const cliente = await this.clienteRepository.findById(pago.idCliente, connection);
      if (!cliente) throw new Error('El cliente no existe.');

      if (pago.idContrato !== null) {
        const contrato = await this.contratoRepository.findById(pago.idContrato, connection);
        if (!contrato) throw new Error('El contrato no existe.');
        if (contrato.id_cliente !== pago.idCliente) throw new Error('El contrato no pertenece a ese cliente.');
        if (contrato.estado === 'cancelado') throw new Error('No se pueden registrar pagos en un contrato cancelado.');
      }

      const idPago = await this.pagoRepository.create(pago, connection);
      const movimiento = MovimientoFactory.crearIngresoPorPago(pago, idPago);
      await this.movimientoRepository.create(movimiento, connection);

      return idPago;
    });
  }

  /** OPERACIÓN CRÍTICA: cancelar el pago y registrar el egreso que lo revierte. */
  async cancelarPago(idPago) {
    return withTransaction(this.pool, async (connection) => {
      const pago = await this.pagoRepository.findById(idPago, connection);
      if (!pago) throw new Error('El pago no existe.');
      if (pago.estado === 'cancelado') throw new Error('El pago ya estaba cancelado.');

      await this.pagoRepository.cancel(idPago, connection);
      await this.movimientoRepository.create(MovimientoFactory.crearEgresoPorReversion(pago), connection);
    });
  }

  async listar() {
    return this.pagoRepository.findAll();
  }

  async listarPorCliente(idCliente) {
    return this.pagoRepository.findByCliente(idCliente);
  }

  /** Precio del contrato, total pagado y saldo pendiente. */
  async estadoDeCuenta(idContrato) {
    const contrato = await this.contratoRepository.findById(idContrato);
    if (!contrato) throw new Error('El contrato no existe.');

    const pagado = await this.pagoRepository.totalPagadoPorContrato(idContrato);
    return {
      contrato: contrato.id_contrato,
      precio: contrato.precio,
      pagado,
      saldo: Math.max(Number(contrato.precio) - pagado, 0)
    };
  }
}
