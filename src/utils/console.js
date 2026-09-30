import chalk from 'chalk';

export function mostrarTitulo(texto) {
  console.log('\n' + chalk.bold.cyan(`=== ${texto} ===`) + '\n');
}

export function mostrarExito(texto) {
  console.log(chalk.green(`✓ ${texto}`));
}

export function mostrarError(texto) {
  console.log(chalk.red(`✗ ${texto}`));
}

export function mostrarInfo(texto) {
  console.log(chalk.yellow(`• ${texto}`));
}

/** console.table que avisa cuando no hay registros. */
export function mostrarTabla(filas, vacio = 'No hay registros.') {
  if (!filas || filas.length === 0) {
    mostrarInfo(vacio);
    return;
  }
  console.table(filas);
}
