export class BaseRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async execute(sql, params = [], connection = this.pool) {
    const [result] = await connection.execute(sql, params);
    return result;
  }
}
