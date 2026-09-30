import { BaseRepository } from './BaseRepository.js';

export class PlanRepository extends BaseRepository {
  async create(plan, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO planes
       (nombre, descripcion, duracion_meses, meta_fisica, nivel, precio, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [plan.nombre, plan.descripcion, plan.duracionMeses, plan.metaFisica,
       plan.nivel, plan.precio, plan.estado],
      connection
    );
    return result.insertId;
  }

  async findAll(connection = this.pool) {
    return this.execute(`SELECT * FROM planes ORDER BY nombre`, [], connection);
  }

  async findActivos(connection = this.pool) {
    return this.execute(
      `SELECT * FROM planes WHERE estado = 'activo' ORDER BY nombre`, [], connection
    );
  }

  async findById(id, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM planes WHERE id_plan = ?`, [id], connection
    );
    return rows[0] ?? null;
  }

  async update(id, plan, connection = this.pool) {
    return this.execute(
      `UPDATE planes
       SET nombre = ?, descripcion = ?, duracion_meses = ?, meta_fisica = ?, nivel = ?, precio = ?
       WHERE id_plan = ?`,
      [plan.nombre, plan.descripcion, plan.duracionMeses, plan.metaFisica,
       plan.nivel, plan.precio, id],
      connection
    );
  }

  async updateEstado(id, estado, connection = this.pool) {
    return this.execute(
      `UPDATE planes SET estado = ? WHERE id_plan = ?`, [estado, id], connection
    );
  }
}
