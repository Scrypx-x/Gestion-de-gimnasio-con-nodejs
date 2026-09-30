import { esEntero, esFecha, idONull, textoONull } from '../utils/validators.js';

export const CATEGORIAS_MOVIMIENTO = ['mensualidad', 'sesion', 'servicio', 'suplementos', 'operativo', 'otro'];

export class MovimientoFinanciero {
  constructor({ idCliente = null, tipo, categoria, descripcion = null, monto, fecha = null }) {
    this.idCliente = idONull(idCliente);
    this.tipo = tipo;
    this.categoria = categoria;
    this.descripcion = textoONull(descripcion);
    this.monto = Number(monto);
    this.fecha = textoONull(fecha);
    this.validate();
  }

  validate() {
    if (this.idCliente !== null && !esEntero(this.idCliente)) throw new Error('Cliente no válido.');
    if (!['ingreso', 'egreso'].includes(this.tipo)) throw new Error('Tipo de movimiento no válido.');
    if (!CATEGORIAS_MOVIMIENTO.includes(this.categoria)) throw new Error('Categoría no válida.');
    if (this.descripcion && this.descripcion.length > 255) throw new Error('La descripción admite máximo 255 caracteres.');
    if (!Number.isFinite(this.monto) || this.monto <= 0) throw new Error('El monto debe ser mayor que 0.');
    if (this.fecha !== null && !esFecha(this.fecha)) throw new Error('Fecha no válida (use YYYY-MM-DD).');
  }
}
