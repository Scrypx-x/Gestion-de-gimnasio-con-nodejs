import inquirer from 'inquirer';
import dayjs from 'dayjs';

export const hoy = () => dayjs().format('YYYY-MM-DD');

/** Lista de clientes para elegir; devuelve el id del elegido. */
export async function seleccionarCliente(clienteService, mensaje = 'Cliente:') {
  const clientes = await clienteService.listar();
  if (clientes.length === 0) throw new Error('No hay clientes registrados.');

  const { id } = await inquirer.prompt([{
    type: 'list',
    name: 'id',
    message: mensaje,
    choices: clientes.map((c) => ({
      name: `#${c.id_cliente} - ${c.apellido}, ${c.nombre} (${c.estado})`,
      value: c.id_cliente
    }))
  }]);
  return id;
}

export async function seleccionarPlan(planService, { soloActivos = false, mensaje = 'Plan:' } = {}) {
  const planes = soloActivos ? await planService.listarActivos() : await planService.listar();
  if (planes.length === 0) throw new Error('No hay planes disponibles.');

  const { id } = await inquirer.prompt([{
    type: 'list',
    name: 'id',
    message: mensaje,
    choices: planes.map((p) => ({
      name: `#${p.id_plan} - ${p.nombre} (${p.duracion_meses} meses, Q${p.precio})`,
      value: p.id_plan
    }))
  }]);
  return id;
}

/** Contratos activos del cliente; con `opcional` agrega la opción "Ninguno" (null). */
export async function seleccionarContratoActivo(contratoService, idCliente, { opcional = false, mensaje = 'Contrato:' } = {}) {
  const contratos = await contratoService.listarActivosPorCliente(idCliente);

  if (contratos.length === 0) {
    if (opcional) return null;
    throw new Error('El cliente no tiene contratos activos.');
  }

  const choices = contratos.map((c) => ({
    name: `#${c.id_contrato} - ${c.plan} (${c.fecha_inicio} a ${c.fecha_fin})`,
    value: c.id_contrato
  }));
  if (opcional) choices.push({ name: 'Ninguno', value: null });

  const { id } = await inquirer.prompt([{ type: 'list', name: 'id', message: mensaje, choices }]);
  return id;
}

export async function confirmar(mensaje) {
  const { ok } = await inquirer.prompt([{ type: 'confirm', name: 'ok', message: mensaje, default: false }]);
  return ok;
}
