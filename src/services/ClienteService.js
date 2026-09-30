import { Cliente } from '../models/Cliente.js';

export class ClienteService {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async crear(datos) {
    const cliente = new Cliente(datos);

    const existente = await this.clienteRepository.findByEmail(cliente.email);
    if (existente) throw new Error('Ya existe un cliente con ese email.');

    return this.clienteRepository.create(cliente);
  }

  async listar() {
    return this.clienteRepository.findAll();
  }

  async obtener(id) {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) throw new Error('El cliente no existe.');
    return cliente;
  }

  async actualizar(id, datos) {
    const actual = await this.obtener(id);
    const cliente = new Cliente({ ...datos, estado: actual.estado });

    const otro = await this.clienteRepository.findByEmail(cliente.email);
    if (otro && otro.id_cliente !== Number(id)) throw new Error('Ya existe otro cliente con ese email.');

    await this.clienteRepository.update(id, cliente);
  }

  async cambiarEstado(id, estado) {
    if (!['activo', 'inactivo'].includes(estado)) throw new Error('Estado de cliente no válido.');
    await this.obtener(id);
    await this.clienteRepository.updateEstado(id, estado);
  }
}
