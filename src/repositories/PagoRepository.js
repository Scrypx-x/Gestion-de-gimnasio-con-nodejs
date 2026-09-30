import { BaseRepository } from './BaseRepository.js';

export class PagoRepository extends BaseRepository {
  async create(pago, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO pagos
       (id_cliente, id_contrato, monto, metodo_pago, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [pago.idCliente, pago.idContrato, pago.monto, pago.metodoPago, pago.estado],
      connection
    );
    return result.insertId;
  }

  async findById(id, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM pagos WHERE id_pago = ?`, [id], connection
    );
    return rows[0] ?? null;
  }

  async findAll(connection = this.pool) {
    return this.execute(
      `SELECT p.id_pago, CONCAT(c.nombre, ' ', c.apellido) AS cliente, p.id_contrato,
              p.monto, p.metodo_pago, p.fecha_pago, p.estado
       FROM pagos p
       JOIN clientes c ON c.id_cliente = p.id_cliente
       ORDER BY p.fecha_pago DESC, p.id_pago DESC`,
      [], connection
    );
  }

  async findByCliente(idCliente, connection = this.pool) {
    return this.execute(
      `SELECT id_pago, id_contrato, monto, metodo_pago, fecha_pago, estado
       FROM pagos WHERE id_cliente = ?
       ORDER BY fecha_pago DESC`,
      [idCliente], connection
    );
  }

  async cancel(id, connection = this.pool) {
    return this.execute(
      `UPDATE pagos SET estado = 'cancelado' WHERE id_pago = ?`, [id], connection
    );
  }

  /** Suma de pagos completados de un contrato. */
  async totalPagadoPorContrato(idContrato, connection = this.pool) {
    const rows = await this.execute(
      `SELECT COALESCE(SUM(monto), 0) AS total
       FROM pagos WHERE id_contrato = ? AND estado = 'completado'`,
      [idContrato], connection
    );
    return Number(rows[0].total);
  }
}
