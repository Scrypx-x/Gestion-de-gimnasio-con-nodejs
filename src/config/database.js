import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nbx_fitness_db',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    Database.instance = this;
  }

  async connect() {
    try {
      const connection = await this.pool.getConnection();
      console.log('Database connected successfully using MySQL driver.');
      connection.release();
      return this.pool;
    } catch (error) {
      console.error('Error connecting to MySQL database:', error.message);
      throw error;
    }
  }

  async getClient() {
    return this.pool;
  }
}

export default new Database();