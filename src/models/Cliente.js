import dayjs from 'dayjs';
import { esFecha, textoONull } from '../utils/validators.js';

export class Cliente {
  constructor({ nombre, apellido, telefono, email, fechaNacimiento = null, estado = 'activo' }) {
    this.nombre = String(nombre ?? '').trim();
    this.apellido = String(apellido ?? '').trim();
    this.telefono = String(telefono ?? '').trim();
    this.email = String(email ?? '').trim().toLowerCase();
    this.fechaNacimiento = textoONull(fechaNacimiento);
    this.estado = estado;
    this.validate();
  }

  validate() {
    if (!this.nombre || this.nombre.length > 50) throw new Error('Nombre requerido y máximo 50 caracteres.');
    if (!this.apellido || this.apellido.length > 50) throw new Error('Apellido requerido y máximo 50 caracteres.');
    if (!this.telefono || this.telefono.length > 20) throw new Error('Teléfono requerido y máximo 20 caracteres.');
    if (this.email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) throw new Error('Email no válido.');
    if (this.fechaNacimiento !== null) {
      if (!esFecha(this.fechaNacimiento)) throw new Error('Fecha de nacimiento no válida (use YYYY-MM-DD).');
      if (dayjs(this.fechaNacimiento).isAfter(dayjs())) throw new Error('La fecha de nacimiento no puede ser futura.');
    }
    if (!['activo', 'inactivo'].includes(this.estado)) throw new Error('Estado de cliente no válido.');
  }
}
