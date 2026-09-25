import { runCli } from './commands/CliController.js';

runCli().catch(err => {
  console.error('Fatal application error:', err);
});