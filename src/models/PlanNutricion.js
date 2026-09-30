import { esEntero, esFecha, idONull, textoONull } from '../utils/validators.js';

export class PlanNutricion {
  constructor({ idCliente, idContrato = null, nombre, objetivo = null, fechaInicio, fechaFin = null, estado = 'activo' }) {
    this.idCliente = Number(idCliente);
    this.idContrato = idONull(idContrato);
    this.nombre = String(nombre ?? '').trim();
    this.objetivo = textoONull(objetivo);
    this.fechaInicio = fechaInicio;
    this.fechaFin = textoONull(fechaFin);
    this.estado = estado;
    this.validate();
  }

  validate() {
    if (!esEntero(this.idCliente)) throw new Error('Cliente no válido.');
    if (this.idContrato !== null && !esEntero(this.idContrato)) throw new Error('Contrato no válido.');
    if (!this.nombre || this.nombre.length > 100) throw new Error('Nombre requerido y máximo 100 caracteres.');
    if (this.objetivo && this.objetivo.length > 255) throw new Error('El objetivo admite máximo 255 caracteres.');
    if (!esFecha(this.fechaInicio)) throw new Error('Fecha de inicio no válida (use YYYY-MM-DD).');
    if (this.fechaFin !== null) {
      if (!esFecha(this.fechaFin)) throw new Error('Fecha final no válida (use YYYY-MM-DD).');
      if (this.fechaFin < this.fechaInicio) throw new Error('La fecha final no puede ser anterior a la inicial.');
    }
    if (!['activo', 'finalizado', 'cancelado'].includes(this.estado)) throw new Error('Estado no válido.');
  }
}
