import inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand.js';
import { mostrarExito, mostrarTabla } from '../utils/console.js';
import { seleccionarCliente } from './helpers.js';

export class ClienteCommand extends BaseCommand {
  constructor(clienteService) {
    super();
    this.clienteService = clienteService;
  }

  get titulo() {
    return 'Clientes';
  }

  acciones() {
    return {
      'Listar': () => this.listar(),
      'Crear': () => this.crear(),
      'Editar': () => this.editar(),
      'Activar / desactivar': () => this.cambiarEstado()
    };
  }

  async listar() {
    mostrarTabla(await this.clienteService.listar(), 'No hay clientes registrados.');
  }

  async crear() {
    const datos = await inquirer.prompt(this.#preguntas());
    const id = await this.clienteService.crear(datos);
    mostrarExito(`Cliente creado con ID ${id}.`);
  }

  async editar() {
    const id = await seleccionarCliente(this.clienteService, 'Cliente a editar:');
    const actual = await this.clienteService.obtener(id);

    const datos = await inquirer.prompt(this.#preguntas({
      nombre: actual.nombre,
      apellido: actual.apellido,
      telefono: actual.telefono,
      email: actual.email,
      fechaNacimiento: actual.fecha_nacimiento ?? ''
    }));

    await this.clienteService.actualizar(id, datos);
    mostrarExito('Cliente actualizado.');
  }

  async cambiarEstado() {
    const id = await seleccionarCliente(this.clienteService, 'Cliente:');
    const actual = await this.clienteService.obtener(id);
    const nuevo = actual.estado === 'activo' ? 'inactivo' : 'activo';

    await this.clienteService.cambiarEstado(id, nuevo);
    mostrarExito(`Cliente ahora está ${nuevo}.`);
  }

  #preguntas(d = {}) {
    return [
      { type: 'input', name: 'nombre', message: 'Nombre:', default: d.nombre },
      { type: 'input', name: 'apellido', message: 'Apellido:', default: d.apellido },
      { type: 'input', name: 'telefono', message: 'Teléfono:', default: d.telefono },
      { type: 'input', name: 'email', message: 'Email:', default: d.email },
      { type: 'input', name: 'fechaNacimiento', message: 'Fecha de nacimiento (YYYY-MM-DD, opcional):', default: d.fechaNacimiento }
    ];
  }
}
