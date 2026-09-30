import { BaseRepository } from './BaseRepository.js';

/** Repository de la tabla planes_nutricion. */
export class NutricionRepository extends BaseRepository {
  async create(plan, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO planes_nutricion
       (id_cliente, id_contrato, nombre, objetivo, fecha_inicio, fecha_fin, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [plan.idCliente, plan.idContrato, plan.nombre, plan.objetivo,
       plan.fechaInicio, plan.fechaFin, plan.estado],
      connection
    );
    return result.insertId;
  }

  async findById(id, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM planes_nutricion WHERE id_plan_nutricion = ?`, [id], connection
    );
    return rows[0] ?? null;
  }

  async findByCliente(idCliente, connection = this.pool) {
    return this.execute(
      `SELECT id_plan_nutricion, id_contrato, nombre, objetivo, fecha_inicio, fecha_fin, estado
       FROM planes_nutricion WHERE id_cliente = ?
       ORDER BY fecha_inicio DESC`,
      [idCliente], connection
    );
  }

  async updateEstado(id, estado, connection = this.pool) {
    return this.execute(
      `UPDATE planes_nutricion SET estado = ? WHERE id_plan_nutricion = ?`,
      [estado, id], connection
    );
  }

  /** Cancela los planes activos asociados a un contrato (se usa al cancelar el contrato). */
  async cancelarPorContrato(idContrato, connection = this.pool) {
    const result = await this.execute(
      `UPDATE planes_nutricion SET estado = 'cancelado'
       WHERE id_contrato = ? AND estado = 'activo'`,
      [idContrato], connection
    );
    return result.affectedRows;
  }
}
