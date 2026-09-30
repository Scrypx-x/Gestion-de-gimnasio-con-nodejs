import { BaseRepository } from './BaseRepository.js';

export class PlanAlimentoRepository extends BaseRepository {
  async create(item, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO plan_alimentos
       (id_plan_nutricion, id_alimento, dia_semana, cantidad, comida)
       VALUES (?, ?, ?, ?, ?)`,
      [item.idPlanNutricion, item.idAlimento, item.diaSemana, item.cantidad, item.comida],
      connection
    );
    return result.insertId;
  }

  /** Detalle del plan con calorías calculadas (cantidad × calorías por porción). */
  async findByPlan(idPlanNutricion, connection = this.pool) {
    return this.execute(
      `SELECT pa.id_plan_alimento, pa.dia_semana, pa.comida, a.nombre AS alimento,
              pa.cantidad, a.unidad,
              ROUND(pa.cantidad * a.calorias_por_porcion, 2) AS calorias
       FROM plan_alimentos pa
       JOIN alimentos a ON a.id_alimento = pa.id_alimento
       WHERE pa.id_plan_nutricion = ?
       ORDER BY FIELD(pa.dia_semana,'lunes','martes','miercoles','jueves','viernes','sabado','domingo'),
                FIELD(pa.comida,'desayuno','almuerzo','refaccion','cena'),
                pa.id_plan_alimento`,
      [idPlanNutricion], connection
    );
  }

  async delete(id, connection = this.pool) {
    const result = await this.execute(
      `DELETE FROM plan_alimentos WHERE id_plan_alimento = ?`, [id], connection
    );
    return result.affectedRows;
  }
}
