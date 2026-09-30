import { BaseRepository } from './BaseRepository.js';

export class AlimentoRepository extends BaseRepository {
  async create(alimento, connection = this.pool) {
    const result = await this.execute(
      `INSERT INTO alimentos (nombre, calorias_por_porcion, unidad) VALUES (?, ?, ?)`,
      [alimento.nombre, alimento.caloriasPorPorcion, alimento.unidad],
      connection
    );
    return result.insertId;
  }

  async findAll(connection = this.pool) {
    return this.execute(`SELECT * FROM alimentos ORDER BY nombre`, [], connection);
  }

  async findById(id, connection = this.pool) {
    const rows = await this.execute(
      `SELECT * FROM alimentos WHERE id_alimento = ?`, [id], connection
    );
    return rows[0] ?? null;
  }
}
