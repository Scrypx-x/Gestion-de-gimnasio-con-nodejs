import dayjs from 'dayjs';
import { Contrato } from '../models/Contrato.js';

/**
 * Factory de contratos: arma el contrato a partir del plan elegido.
 * Calcula la fecha final según duracion_meses y toma el precio vigente del plan.
 */
export class ContratoFactory {
  /**
   * @param {object} params
   * @param {number} params.idCliente
   * @param {object} params.plan Fila de la tabla planes (snake_case).
   * @param {string} params.fechaInicio YYYY-MM-DD
   * @param {string|null} params.condiciones
   */
  static desdePlan({ idCliente, plan, fechaInicio, condiciones = null }) {
    const fechaFin = dayjs(fechaInicio)
      .add(plan.duracion_meses, 'month')
      .subtract(1, 'day')
      .format('YYYY-MM-DD');

    return new Contrato({
      idCliente,
      idPlan: plan.id_plan,
      condiciones,
      fechaInicio,
      fechaFin,
      precio: plan.precio
    });
  }
}
