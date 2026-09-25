import database from '../config/database.js';

export class GymService {
  async processPaymentAndContract(clientData, contractData, paymentData) {
    const pool = await database.connect();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [clientResult] = await connection.query(
        'INSERT INTO clients (name, email, phone, created_at) VALUES (?, ?, ?, ?)',
        [clientData.name, clientData.email, clientData.phone, new Date()]
      );
      const clientId = clientResult.insertId;

      const [contractResult] = await connection.query(
        'INSERT INTO contracts (client_id, plan_id, conditions, duration_months, price, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          clientId,
          contractData.planId,
          contractData.conditions || 'Standard Terms',
          contractData.durationMonths,
          contractData.price,
          contractData.startDate,
          contractData.endDate,
          'active'
        ]
      );
      const contractId = contractResult.insertId;

      await connection.query(
        'INSERT INTO transactions (type, amount, description, date) VALUES (?, ?, ?, ?)',
        ['INCOME', paymentData.amount, `Payment for contract ID ${contractId}`, new Date()]
      );

      await connection.commit();
      return { success: true, message: 'MySQL transaction completed successfully with full consistency.' };

    } catch (error) {
      await connection.rollback();
      throw new Error(`Transaction failed, rolled back changes: ${error.message}`);
    } finally {
      connection.release();
    }
  }
}