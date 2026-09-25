import database from '../config/database.js';

export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll() {
    const pool = await database.connect();
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async create(columns, values, connection = null) {
    const pool = await database.connect();
    const query = `INSERT INTO \({this.tableName} (\){columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
    const executor = connection || pool;
    const [result] = await executor.query(query, values);
    return { id: result.insertId };
  }
}