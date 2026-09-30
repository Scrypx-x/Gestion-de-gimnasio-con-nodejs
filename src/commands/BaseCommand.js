import inquirer from 'inquirer';
import { mostrarTitulo, mostrarError } from '../utils/console.js';

/**
 * Base de todos los comandos de terminal.
 * Cada subclase define `titulo` y `acciones()` (mapa etiqueta -> función).
 * ejecutar() muestra el menú en bucle hasta elegir "Volver".
 */
export class BaseCommand {
  get titulo() {
    throw new Error('Cada comando debe definir su título.');
  }

  acciones() {
    throw new Error('Cada comando debe definir sus acciones.');
  }

  async ejecutar() {
    const acciones = this.acciones();

    while (true) {
      mostrarTitulo(this.titulo);

      const { accion } = await inquirer.prompt([{
        type: 'list',
        name: 'accion',
        message: '¿Qué deseas hacer?',
        choices: [...Object.keys(acciones), 'Volver']
      }]);

      if (accion === 'Volver') return;

      try {
        await acciones[accion]();
      } catch (error) {
        mostrarError(error.message);
      }
    }
  }
}
