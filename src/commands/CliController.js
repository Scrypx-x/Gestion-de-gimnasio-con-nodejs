import inquirer from 'inquirer';
import chalk from 'chalk';
import { GymService } from '../services/GymService.js';

const gymService = new GymService();

export async function runCli() {
  console.log(chalk.cyan.bold('========================================='));
  console.log(chalk.cyan.bold('   NBXproyect - Fitness CLI (MySQL)      '));
  console.log(chalk.cyan.bold('========================================='));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an option:',
      choices: [
        'Register Client & Create Contract (MySQL Transaction)',
        'Exit'
      ]
    }
  ]);

  if (answer.action.includes('Register Client')) {
    console.log(chalk.yellow('\nProcessing atomic transaction in MySQL...'));
    try {
      const res = await gymService.processPaymentAndContract(
        { name: 'Alexis Ramirez', email: 'alexis@campus.com', phone: '5555-4321' },
        { planId: 'PLAN-PRO', durationMonths: 12, price: 300.0, startDate: new Date(), endDate: new Date() },
        { amount: 300.0 }
      );
      console.log(chalk.green(res.message));
    } catch (err) {
      console.log(chalk.red(`Error: ${err.message}`));
    }
  } else {
    console.log(chalk.blue('Goodbye!'));
    process.exit(0);
  }
}