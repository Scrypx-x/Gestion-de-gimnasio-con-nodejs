import { BaseRepository } from './BaseRepository.js';

export class ContratoRepository extends BaseRepository {
  async create(contrato, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO contratos
       (id_cliente, id_plan, condiciones, fecha_inicio, fecha_fin, precio, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [contrato.idCliente, contrato.idPlan, contrato.condiciones,
       contrato.fechaInicio, contrato.fechaFin, contrato.precio, contrato.estado],
      connection
    );
    return result.insertId;
  }

  async findById(id, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM contratos WHERE id_contrato = ?`, [id], connection
    );
    return rows[0] ?? null;
  }

  /** Listado con nombre de cliente y plan, útil para la terminal. */
  async findAllDetallado(connection = this.pool) {
    return this.execute(
      `SELECT c.id_contrato, CONCAT(cl.nombre, ' ', cl.apellido) AS cliente,
              p.nombre AS plan, c.fecha_inicio, c.fecha_fin, c.precio, c.estado
       FROM contratos c
       JOIN clientes cl ON cl.id_cliente = c.id_cliente
       JOIN planes p ON p.id_plan = c.id_plan
       ORDER BY c.fecha_inicio DESC, c.id_contrato DESC`,
      [], connection
    );
  }

  async findByCliente(idCliente, connection = this.pool) {
    return this.execute(
      `SELECT c.id_contrato, p.nombre AS plan, c.fecha_inicio, c.fecha_fin, c.precio, c.estado
       FROM contratos c
       JOIN planes p ON p.id_plan = c.id_plan
       WHERE c.id_cliente = ?
       ORDER BY c.fecha_inicio DESC`,
      [idCliente], connection
    );
  }

  async findActivosByCliente(idCliente, connection = this.pool) {
    return this.execute(
      `SELECT c.id_contrato, p.nombre AS plan, c.fecha_inicio, c.fecha_fin
       FROM contratos c
       JOIN planes p ON p.id_plan = c.id_plan
       WHERE c.id_cliente = ? AND c.estado = 'activo'
       ORDER BY c.fecha_inicio DESC`,
      [idCliente], connection
    );
  }

  /** Contratos activos del mismo cliente y plan cuyo rango se cruza con el nuevo. */
  async findActivosSolapados(idCliente, idPlan, fechaInicio, fechaFin, connection = this.pool) {
    return this.execute(
      `SELECT id_contrato FROM contratos
       WHERE id_cliente = ? AND id_plan = ? AND estado = 'activo'
         AND fecha_inicio <= ? AND fecha_fin >= ?`,
      [idCliente, idPlan, fechaFin, fechaInicio], connection
    );
  }

  async cancel(id, connection = this.pool) {
    return this.execute(
      `UPDATE contratos SET estado = 'cancelado' WHERE id_contrato = ?`,
      [id], connection
    );
  }

  /** Marca como finalizados los contratos activos ya vencidos. */
  async finalizarVencidos(connection = this.pool) {
    const result = await this.execute(
      `UPDATE contratos SET estado = 'finalizado'
       WHERE estado = 'activo' AND fecha_fin < CURRENT_DATE`,
      [], connection
    );
    return result.affectedRows;
  }
}
