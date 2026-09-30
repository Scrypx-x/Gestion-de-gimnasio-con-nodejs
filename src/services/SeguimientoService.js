import { Seguimiento } from '../models/Seguimiento.js';

export class SeguimientoService {
  constructor({ seguimientoRepository, clienteRepository, contratoRepository }) {
    this.seguimientoRepository = seguimientoRepository;
    this.clienteRepository = clienteRepository;
    this.contratoRepository = contratoRepository;
  }

  async registrar(datos) {
    const seguimiento = new Seguimiento(datos);

    const cliente = await this.clienteRepository.findById(seguimiento.idCliente);
    if (!cliente) throw new Error('El cliente no existe.');

    if (seguimiento.idContrato !== null) {
      const contrato = await this.contratoRepository.findById(seguimiento.idContrato);
      if (!contrato) throw new Error('El contrato no existe.');
      if (contrato.id_cliente !== seguimiento.idCliente) throw new Error('El contrato no pertenece a ese cliente.');
      if (contrato.estado === 'cancelado') throw new Error('No se puede registrar seguimiento en un contrato cancelado.');
    }

    return this.seguimientoRepository.create(seguimiento);
  }

  async listarPorCliente(idCliente) {
    return this.seguimientoRepository.findByCliente(idCliente);
  }

  /** Diferencia entre el primer y el último registro con datos de cada medida. */
  async evolucion(idCliente) {
    const registros = await this.seguimientoRepository.findByCliente(idCliente);
    if (registros.length < 2) return null;

    const medidas = ['peso', 'grasa_corporal', 'cintura', 'pecho', 'brazo', 'pierna'];
    const resultado = [];

    for (const medida of medidas) {
      const conDato = registros.filter((r) => r[medida] !== null && r[medida] !== undefined);
      if (conDato.length < 2) continue;

      const inicial = Number(conDato[0][medida]);
      const actual = Number(conDato[conDato.length - 1][medida]);
      resultado.push({
        medida,
        inicial,
        actual,
        cambio: Number((actual - inicial).toFixed(2))
      });
    }

    return resultado;
  }
}
