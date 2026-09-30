import inquirer from 'inquirer';
import chalk from 'chalk';
import { testConnection, pool } from './config/database.js';

import { ClienteRepository } from './repositories/ClienteRepository.js';
import { PlanRepository } from './repositories/PlanRepository.js';
import { ContratoRepository } from './repositories/ContratoRepository.js';
import { PagoRepository } from './repositories/PagoRepository.js';
import { MovimientoRepository } from './repositories/MovimientoRepository.js';
import { SeguimientoRepository } from './repositories/SeguimientoRepository.js';
import { NutricionRepository } from './repositories/NutricionRepository.js';
import { AlimentoRepository } from './repositories/AlimentoRepository.js';
import { PlanAlimentoRepository } from './repositories/PlanAlimentoRepository.js';

import { ClienteService } from './services/ClienteService.js';
import { PlanService } from './services/PlanService.js';
import { ContratoService } from './services/ContratoService.js';
import { PagoService } from './services/PagoService.js';
import { FinanzaService } from './services/FinanzaService.js';
import { SeguimientoService } from './services/SeguimientoService.js';
import { NutricionService } from './services/NutricionService.js';

import { ClienteCommand } from './commands/clienteCommand.js';
import { PlanCommand } from './commands/planCommand.js';
import { ContratoCommand } from './commands/contratoCommand.js';
import { PagoCommand } from './commands/pagoCommand.js';
import { SeguimientoCommand } from './commands/seguimientoCommand.js';
import { NutricionCommand } from './commands/nutricionCommand.js';
import { FinanzasCommand } from './commands/finanzasCommand.js';

// ---------- Repositories ----------
const clienteRepository = new ClienteRepository(pool);
const planRepository = new PlanRepository(pool);
const contratoRepository = new ContratoRepository(pool);
const pagoRepository = new PagoRepository(pool);
const movimientoRepository = new MovimientoRepository(pool);
const seguimientoRepository = new SeguimientoRepository(pool);
const nutricionRepository = new NutricionRepository(pool);
const alimentoRepository = new AlimentoRepository(pool);
const planAlimentoRepository = new PlanAlimentoRepository(pool);

// ---------- Services ----------
const clienteService = new ClienteService(clienteRepository);
const planService = new PlanService(planRepository);
const contratoService = new ContratoService({
  pool, clienteRepository, planRepository, contratoRepository, seguimientoRepository, nutricionRepository
});
const pagoService = new PagoService({
  pool, pagoRepository, movimientoRepository, clienteRepository, contratoRepository
});
const finanzaService = new FinanzaService({ movimientoRepository, clienteRepository });
const seguimientoService = new SeguimientoService({ seguimientoRepository, clienteRepository, contratoRepository });
const nutricionService = new NutricionService({
  nutricionRepository, alimentoRepository, planAlimentoRepository, clienteRepository, contratoRepository
});

// ---------- Commands ----------
const menu = {
  'Clientes': new ClienteCommand(clienteService),
  'Planes de entrenamiento': new PlanCommand(planService),
  'Contratos': new ContratoCommand({ contratoService, clienteService, planService }),
  'Pagos': new PagoCommand({ pagoService, clienteService, contratoService }),
  'Seguimiento físico': new SeguimientoCommand({ seguimientoService, clienteService, contratoService }),
  'Nutrición': new NutricionCommand({ nutricionService, clienteService, contratoService }),
  'Finanzas': new FinanzasCommand({ finanzaService, clienteService })
};

async function main() {
  try {
    await testConnection();
    console.log(chalk.green('✓ Conexión a MySQL correcta.'));

    while (true) {
      const { opcion } = await inquirer.prompt([{
        type: 'list',
        name: 'opcion',
        message: 'Menú principal',
        choices: [...Object.keys(menu), 'Salir']
      }]);

      if (opcion === 'Salir') break;
      await menu[opcion].ejecutar();
    }

    console.log(chalk.cyan('Programa finalizado.'));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
