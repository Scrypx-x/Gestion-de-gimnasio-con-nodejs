import { textoONull } from '../utils/validators.js';

export class Plan {
  constructor({ nombre, descripcion = null, duracionMeses, metaFisica = null, nivel, precio, estado = 'activo' }) {
    this.nombre = String(nombre ?? '').trim();
    this.descripcion = textoONull(descripcion);
    this.duracionMeses = Number(duracionMeses);
    this.metaFisica = textoONull(metaFisica);
    this.nivel = nivel;
    this.precio = Number(precio);
    this.estado = estado;
    this.validate();
  }

  validate() {
    if (!this.nombre || this.nombre.length > 100) throw new Error('Nombre del plan requerido y máximo 100 caracteres.');
    if (this.descripcion && this.descripcion.length > 255) throw new Error('La descripción admite máximo 255 caracteres.');
    if (this.metaFisica && this.metaFisica.length > 255) throw new Error('La meta física admite máximo 255 caracteres.');
    if (!Number.isInteger(this.duracionMeses) || this.duracionMeses <= 0) throw new Error('La duración debe ser un entero mayor que 0.');
    if (!['principiante', 'intermedio', 'avanzado'].includes(this.nivel)) throw new Error('Nivel no válido.');
    if (!Number.isFinite(this.precio) || this.precio < 0) throw new Error('Precio no válido.');
    if (!['activo', 'inactivo'].includes(this.estado)) throw new Error('Estado no válido.');
  }
}
