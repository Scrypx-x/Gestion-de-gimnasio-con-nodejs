import { esEntero } from '../utils/validators.js';

export const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
export const COMIDAS = ['desayuno', 'almuerzo', 'cena', 'refaccion'];

export class PlanAlimento {
  constructor({ idPlanNutricion, idAlimento, diaSemana, cantidad, comida }) {
    this.idPlanNutricion = Number(idPlanNutricion);
    this.idAlimento = Number(idAlimento);
    this.diaSemana = diaSemana;
    this.cantidad = Number(cantidad);
    this.comida = comida;
    this.validate();
  }

  validate() {
    if (!esEntero(this.idPlanNutricion) || !esEntero(this.idAlimento)) throw new Error('IDs no válidos.');
    if (!Number.isFinite(this.cantidad) || this.cantidad <= 0) throw new Error('La cantidad debe ser mayor que 0.');
    if (!DIAS_SEMANA.includes(this.diaSemana)) throw new Error('Día de semana no válido.');
    if (!COMIDAS.includes(this.comida)) throw new Error('Comida no válida.');
  }
}
