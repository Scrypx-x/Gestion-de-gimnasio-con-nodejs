import { esEntero, idONull } from '../utils/validators.js';

export class Pago {
  constructor({ idCliente, idContrato = null, monto, metodoPago, estado = 'completado' }) {
    this.idCliente = Number(idCliente);
    this.idContrato = idONull(idContrato);
    this.monto = Number(monto);
    this.metodoPago = metodoPago;
    this.estado = estado;
    this.validate();
  }

  validate() {
    if (!esEntero(this.idCliente)) throw new Error('Cliente no válido.');
    if (this.idContrato !== null && !esEntero(this.idContrato)) throw new Error('Contrato no válido.');
    if (!Number.isFinite(this.monto) || this.monto <= 0) throw new Error('El monto debe ser mayor que 0.');
    if (!['efectivo', 'tarjeta', 'transferencia'].includes(this.metodoPago)) throw new Error('Método de pago no válido.');
    if (!['completado', 'cancelado'].includes(this.estado)) throw new Error('Estado de pago no válido.');
  }
}
