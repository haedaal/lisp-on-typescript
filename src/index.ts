import * as readline from 'readline'
import chalk from 'chalk'

import { AST, LANG, FunAST, Env, NumberAST, VarAST } from './lang/LANG'
import tokenize from './lang/tokenize'
import makeAST from './lang/makeAST'

import evaluate from './eval/eval'
import { builtInList, makeBuiltIn } from './eval/built-in'

import * as F from './util/F'
import { prettyAST } from './util/pretty'

const G: Env = {
  ...F.toObj(builtInList, F.id, makeBuiltIn),
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.prompt()

rl.on('line', line => {
  const tokens = tokenize(line)
  console.log(chalk.magenta('TOKENS:\n' + tokens.join(', ')))
  const [ast, cursor] = makeAST(tokens)
  console.log(chalk.yellow('AST:\n' + JSON.stringify(ast, null, 2)))

  try {
    const res = evaluate(ast, G)
    // console.log(chalk.blue(JSON.stringify(res, null, 2)))
    console.log(chalk.green('VALUE:\n' + prettyAST(res)))
  } catch (e) {
    console.error(e)
    // console.log(chalk.red(e))
  }
  rl.prompt()
})

rl.on('close', () => {
  // console.log(`\n\n${chalk.green('Bye!')}\n\n`)
})
