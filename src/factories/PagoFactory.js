import { Pago } from '../models/Pago.js';

export class PagoFactory {
  /** Pago completado (estado por defecto). */
  static crear(datos) {
    return new Pago({ ...datos, estado: 'completado' });
  }
}
