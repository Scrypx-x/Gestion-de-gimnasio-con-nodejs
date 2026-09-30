import { MovimientoFinanciero } from '../models/MovimientoFinanciero.js';

/**
 * Factory de movimientos financieros.
 * Centraliza cómo se construye cada tipo de movimiento para que los services
 * no repitan strings como 'ingreso' / 'mensualidad'.
 */
export class MovimientoFactory {
  static crearIngreso(datos) {
    return new MovimientoFinanciero({ ...datos, tipo: 'ingreso' });
  }

  static crearEgreso(datos) {
    return new MovimientoFinanciero({ ...datos, tipo: 'egreso' });
  }

  /** Crea el movimiento según el tipo indicado ('ingreso' | 'egreso'). */
  static crear(tipo, datos) {
    if (tipo === 'ingreso') return MovimientoFactory.crearIngreso(datos);
    if (tipo === 'egreso') return MovimientoFactory.crearEgreso(datos);
    throw new Error('Tipo de movimiento no válido.');
  }

  /** Ingreso generado automáticamente al registrar un pago. */
  static crearIngresoPorPago(pago, idPago) {
    return MovimientoFactory.crearIngreso({
      idCliente: pago.idCliente,
      categoria: 'mensualidad',
      descripcion: `Ingreso por pago #${idPago}${pago.idContrato ? ` (contrato #${pago.idContrato})` : ''}`,
      monto: pago.monto
    });
  }

  /** Egreso que revierte el ingreso de un pago cancelado. */
  static crearEgresoPorReversion(pagoRow) {
    return MovimientoFactory.crearEgreso({
      idCliente: pagoRow.id_cliente,
      categoria: 'mensualidad',
      descripcion: `Reversión del pago #${pagoRow.id_pago}`,
      monto: pagoRow.monto
    });
  }
}
