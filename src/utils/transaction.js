/**
 * Ejecuta `trabajo(connection)` dentro de una transacción.
 * Hace commit si termina bien y rollback si lanza un error.
 */
export async function withTransaction(pool, trabajo) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const resultado = await trabajo(connection);
    await connection.commit();
    return resultado;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
