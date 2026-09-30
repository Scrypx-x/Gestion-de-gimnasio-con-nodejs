import { esEntero, esFecha, textoONull } from '../utils/validators.js';

export class Contrato {
  constructor({ idCliente, idPlan, condiciones = null, fechaInicio, fechaFin, precio, estado = 'activo' }) {
    this.idCliente = Number(idCliente);
    this.idPlan = Number(idPlan);
    this.condiciones = textoONull(condiciones);
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.precio = Number(precio);
    this.estado = estado;
    this.validate();
  }

  validate() {
    if (!esEntero(this.idCliente)) throw new Error('Cliente no válido.');
    if (!esEntero(this.idPlan)) throw new Error('Plan no válido.');
    if (!esFecha(this.fechaInicio) || !esFecha(this.fechaFin)) throw new Error('Las fechas deben tener formato YYYY-MM-DD.');
    if (this.fechaFin < this.fechaInicio) throw new Error('La fecha final no puede ser anterior a la inicial.');
    if (!Number.isFinite(this.precio) || this.precio < 0) throw new Error('Precio no válido.');
    if (!['activo', 'cancelado', 'finalizado'].includes(this.estado)) throw new Error('Estado de contrato no válido.');
  }
}
