import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.client = new MongoClient(process.env.MONGODB_URI);
    this.db = null;
    Database.instance = this;
  }

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME);
      console.log('Database connected successfully using official MongoDB driver.');
    }
    return this.db;
  }

  async getClient() {
    return this.client;
  }
}

export default new Database();