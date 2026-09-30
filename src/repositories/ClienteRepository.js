import { BaseRepository } from './BaseRepository.js';

export class ClienteRepository extends BaseRepository {
  async create(cliente, connection = this.pool) {
    const sql = `INSERT INTO clientes
      (nombre, apellido, telefono, email, fecha_nacimiento, estado)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await this.execute(sql, [
      cliente.nombre, cliente.apellido, cliente.telefono, cliente.email,
      cliente.fechaNacimiento, cliente.estado
    ], connection);
    return result.insertId;
  }

  async findAll(connection = this.pool) {
    return this.execute(
      `SELECT * FROM clientes ORDER BY apellido, nombre`,
      [], connection
    );
  }

  async findById(id, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM clientes WHERE id_cliente = ?`,
      [id], connection
    );
    return rows[0] ?? null;
  }

  async findByEmail(email, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM clientes WHERE email = ?`,
      [email], connection
    );
    return rows[0] ?? null;
  }

  async update(id, cliente, connection = this.pool) {
    return this.execute(
      `UPDATE clientes
       SET nombre = ?, apellido = ?, telefono = ?, email = ?, fecha_nacimiento = ?
       WHERE id_cliente = ?`,
      [cliente.nombre, cliente.apellido, cliente.telefono, cliente.email,
       cliente.fechaNacimiento, id],
      connection
    );
  }

  async updateEstado(id, estado, connection = this.pool) {
    return this.execute(
      `UPDATE clientes SET estado = ? WHERE id_cliente = ?`,
      [estado, id], connection
    );
  }
}
