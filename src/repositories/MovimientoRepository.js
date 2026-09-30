import { BaseRepository } from './BaseRepository.js';

export class MovimientoRepository extends BaseRepository {
  async create(movimiento, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO movimientos_financieros
       (id_cliente, tipo, categoria, descripcion, monto, fecha)
       VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE))`,
      [movimiento.idCliente, movimiento.tipo, movimiento.categoria,
       movimiento.descripcion, movimiento.monto, movimiento.fecha],
      connection
    );
    return result.insertId;
  }

  /** Filtros opcionales: desde, hasta, tipo. Las fechas ya deben venir validadas. */
  async findAll({ desde = null, hasta = null, tipo = null } = {}, connection = this.pool) {
    return this.execute(
      `SELECT m.id_movimiento, m.fecha, m.tipo, m.categoria, m.descripcion, m.monto,
              CONCAT(c.nombre, ' ', c.apellido) AS cliente
       FROM movimientos_financieros m
       LEFT JOIN clientes c ON c.id_cliente = m.id_cliente
       WHERE (? IS NULL OR m.fecha >= ?)
         AND (? IS NULL OR m.fecha <= ?)
         AND (? IS NULL OR m.tipo = ?)
       ORDER BY m.fecha DESC, m.id_movimiento DESC`,
      [desde, desde, hasta, hasta, tipo, tipo], connection
    );
  }

  async totalesPorTipo({ desde = null, hasta = null } = {}, connection = this.pool) {
    return this.execute(
      `SELECT tipo, COALESCE(SUM(monto), 0) AS total
       FROM movimientos_financieros
       WHERE (? IS NULL OR fecha >= ?) AND (? IS NULL OR fecha <= ?)
       GROUP BY tipo`,
      [desde, desde, hasta, hasta], connection
    );
  }

  async totalesPorCategoria({ desde = null, hasta = null } = {}, connection = this.pool) {
    return this.execute(
      `SELECT tipo, categoria, COALESCE(SUM(monto), 0) AS total
       FROM movimientos_financieros
       WHERE (? IS NULL OR fecha >= ?) AND (? IS NULL OR fecha <= ?)
       GROUP BY tipo, categoria
       ORDER BY tipo, total DESC`,
      [desde, desde, hasta, hasta], connection
    );
  }
}
