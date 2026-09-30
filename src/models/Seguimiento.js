import { esEntero, esFecha, idONull, numeroONull, textoONull } from '../utils/validators.js';

const MEDIDAS = ['peso', 'grasaCorporal', 'cintura', 'pecho', 'brazo', 'pierna'];

export class Seguimiento {
  constructor({
    idCliente, idContrato = null, fecha,
    peso = null, grasaCorporal = null, cintura = null, pecho = null, brazo = null, pierna = null,
    foto = null, comentarios = null
  }) {
    this.idCliente = Number(idCliente);
    this.idContrato = idONull(idContrato);
    this.fecha = fecha;
    this.peso = numeroONull(peso);
    this.grasaCorporal = numeroONull(grasaCorporal);
    this.cintura = numeroONull(cintura);
    this.pecho = numeroONull(pecho);
    this.brazo = numeroONull(brazo);
    this.pierna = numeroONull(pierna);
    this.foto = textoONull(foto);
    this.comentarios = textoONull(comentarios);
    this.validate();
  }

  validate() {
    if (!esEntero(this.idCliente)) throw new Error('Cliente no válido.');
    if (this.idContrato !== null && !esEntero(this.idContrato)) throw new Error('Contrato no válido.');
    if (!esFecha(this.fecha)) throw new Error('La fecha es requerida (use YYYY-MM-DD).');

    for (const medida of MEDIDAS) {
      const valor = this[medida];
      if (valor === null) continue;
      if (!Number.isFinite(valor)) throw new Error(`El valor de ${medida} no es numérico.`);
      if (valor > 999.99) throw new Error(`El valor de ${medida} excede el máximo permitido (999.99).`);
    }

    if (this.peso !== null && this.peso <= 0) throw new Error('El peso debe ser mayor que 0.');
    if (this.grasaCorporal !== null && (this.grasaCorporal < 0 || this.grasaCorporal > 100)) {
      throw new Error('Grasa corporal debe estar entre 0 y 100.');
    }
    for (const medida of ['cintura', 'pecho', 'brazo', 'pierna']) {
      if (this[medida] !== null && this[medida] <= 0) throw new Error(`La medida de ${medida} debe ser mayor que 0.`);
    }
    if (this.foto && this.foto.length > 255) throw new Error('La ruta de la foto admite máximo 255 caracteres.');

    const sinDatos = MEDIDAS.every((m) => this[m] === null) && !this.foto && !this.comentarios;
    if (sinDatos) throw new Error('El seguimiento debe incluir al menos una medida, foto o comentario.');
  }
}
