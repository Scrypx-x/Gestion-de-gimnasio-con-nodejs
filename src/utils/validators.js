import dayjs from 'dayjs';

/** Valida fecha estricta con formato YYYY-MM-DD. */
export function esFecha(valor) {
  return typeof valor === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(valor)
    && dayjs(valor).isValid()
    && dayjs(valor).format('YYYY-MM-DD') === valor;
}

/** '' / undefined / null => null; cualquier otro texto => texto sin espacios laterales. */
export function textoONull(valor) {
  if (valor === null || valor === undefined) return null;
  const texto = String(valor).trim();
  return texto === '' ? null : texto;
}

/** '' / undefined / null => null; número válido => number; otro caso => NaN (para que el modelo lo rechace). */
export function numeroONull(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : NaN;
}

export function esEntero(valor) {
  return Number.isInteger(valor) && valor > 0;
}

/** Convierte a entero positivo o null cuando viene vacío. */
export function idONull(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  return Number(valor);
}
