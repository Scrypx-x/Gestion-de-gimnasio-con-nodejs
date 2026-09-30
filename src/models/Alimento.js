export class Alimento {
  constructor({ nombre, caloriasPorPorcion, unidad }) {
    this.nombre = String(nombre ?? '').trim();
    this.caloriasPorPorcion = Number(caloriasPorPorcion);
    this.unidad = String(unidad ?? '').trim();
    this.validate();
  }

  validate() {
    if (!this.nombre || this.nombre.length > 100) throw new Error('Nombre del alimento requerido y máximo 100 caracteres.');
    if (!Number.isFinite(this.caloriasPorPorcion) || this.caloriasPorPorcion < 0) throw new Error('Calorías no válidas.');
    if (!this.unidad || this.unidad.length > 30) throw new Error('Unidad requerida y máximo 30 caracteres.');
  }
}
