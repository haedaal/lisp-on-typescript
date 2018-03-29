import * as readline from 'readline'
import chalk from 'chalk'
import * as F from './F'
import { AST, LANG, FunAST, Env, NumberAST, VarAST } from './LANG_SPEC'
import { prettyAST } from './pretty'
import { evaluate } from './eval'
import { tokenize } from './tokenize'
import { makeAST } from './ast'

const G: Env = {
  '+': { type: LANG.Fun, name: '+', args: [], body: { type: LANG.BuiltIn } }, // builtin fun, so doesn't need impl
  '*': { type: LANG.Fun, name: '*', args: [], body: { type: LANG.BuiltIn } }, // builtin fun, so doesn't need impl
  '=': { type: LANG.Fun, name: '=', args: [], body: { type: LANG.BuiltIn } }, // builtin fun, so doesn't need impl
  def: { type: LANG.Fun, name: 'def', args: [], body: { type: LANG.BuiltIn } }, // builtin fun, so doesn't need impl
  if: { type: LANG.Fun, name: 'if', args: [], body: { type: LANG.BuiltIn } }, // builtin fun, so doesn't need impl
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.prompt()

rl.on('line', line => {
  const tokens = tokenize(line)
  console.log(chalk.magenta(tokens.toString()))
  const [ast, cursor] = makeAST(tokens)
  console.log(chalk.yellow(JSON.stringify(ast, null, 2)))

  try {
    const res = evaluate(ast, G)
    console.log(chalk.blue(JSON.stringify(res, null, 2)))
    console.log(chalk.green(prettyAST(res)))
  } catch (e) {
    console.log(chalk.red(e))
  }
  rl.prompt()
})

rl.on('close', () => {
  // console.log(`\n\n${chalk.green('Bye!')}\n\n`)
})
