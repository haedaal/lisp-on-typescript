import * as readline from 'readline'
import chalk from 'chalk'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.prompt()

rl.on('line', line => {
  console.log(chalk.blue(line))
  rl.prompt()
})

rl.on('close', () => {
  console.log(`\n\n${chalk.green('Bye!')}\n\n`)
})
