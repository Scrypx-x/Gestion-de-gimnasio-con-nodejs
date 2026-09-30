import { BaseRepository } from './BaseRepository.js';

export class SeguimientoRepository extends BaseRepository {
  async create(s, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO seguimiento
       (id_cliente, id_contrato, fecha, peso, grasa_corporal, cintura, pecho, brazo, pierna, foto, comentarios)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.idCliente, s.idContrato, s.fecha, s.peso, s.grasaCorporal, s.cintura,
       s.pecho, s.brazo, s.pierna, s.foto, s.comentarios],
      connection
    );
    return result.insertId;
  }

  async findByCliente(idCliente, connection = this.pool) {
    return this.execute(
      `SELECT id_seguimiento, id_contrato, fecha, peso, grasa_corporal, cintura,
              pecho, brazo, pierna, foto, comentarios
       FROM seguimiento
       WHERE id_cliente = ?
       ORDER BY fecha ASC, id_seguimiento ASC`,
      [idCliente], connection
    );
  }

  async deleteByContrato(idContrato, connection = this.pool) {
    const result = await this.execute(
      `DELETE FROM seguimiento WHERE id_contrato = ?`, [idContrato], connection
    );
    return result.affectedRows;
  }
}
