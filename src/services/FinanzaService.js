import { MovimientoFactory } from '../factories/MovimientoFactory.js';
import { esFecha, textoONull } from '../utils/validators.js';

export class FinanzaService {
  constructor({ movimientoRepository, clienteRepository }) {
    this.movimientoRepository = movimientoRepository;
    this.clienteRepository = clienteRepository;
  }

  async registrarMovimiento({ tipo, ...datos }) {
    const movimiento = MovimientoFactory.crear(tipo, datos);

    if (movimiento.idCliente !== null) {
      const cliente = await this.clienteRepository.findById(movimiento.idCliente);
      if (!cliente) throw new Error('El cliente no existe.');
    }

    return this.movimientoRepository.create(movimiento);
  }

  async listar(filtros = {}) {
    return this.movimientoRepository.findAll(this.#normalizar(filtros));
  }

  async resumen(filtros = {}) {
    const rango = this.#normalizar(filtros);
    const totales = await this.movimientoRepository.totalesPorTipo(rango);
    const porCategoria = await this.movimientoRepository.totalesPorCategoria(rango);

    const ingresos = Number(totales.find((t) => t.tipo === 'ingreso')?.total ?? 0);
    const egresos = Number(totales.find((t) => t.tipo === 'egreso')?.total ?? 0);

    return { ingresos, egresos, balance: ingresos - egresos, porCategoria };
  }

  #normalizar({ desde = null, hasta = null, tipo = null } = {}) {
    const rango = { desde: textoONull(desde), hasta: textoONull(hasta), tipo: textoONull(tipo) };

    if (rango.desde && !esFecha(rango.desde)) throw new Error('Fecha "desde" no válida (use YYYY-MM-DD).');
    if (rango.hasta && !esFecha(rango.hasta)) throw new Error('Fecha "hasta" no válida (use YYYY-MM-DD).');
    if (rango.desde && rango.hasta && rango.hasta < rango.desde) throw new Error('"Hasta" no puede ser anterior a "desde".');
    if (rango.tipo && !['ingreso', 'egreso'].includes(rango.tipo)) throw new Error('Tipo no válido.');

    return rango;
  }
}
