import { oneOf } from '../util/F'

export type Env = { [key: string]: AST }

export enum LANG {
  Bool = 'Bool',
  Number = 'Number',
  Var = 'Var',
  Fun = 'Fun',
  Closure = 'Closure',
  Call = 'Call',
  Nil = 'Nil',
  // String = 'String',
  // Pair = 'Pair',
  // If = 'If',
  BuiltIn = 'BuiltIn',
}

export const builtIn = Symbol('built-in')

export function isValue(ast: AST): ast is ValueAST {
  return oneOf(LANG.Bool, LANG.Number, LANG.Closure, LANG.Nil)(ast.type)
}

export type ValueAST = BoolAST | NumberAST | ClosureAST | NilAST
// | PairAST
export type NonValueAST = VarAST | FunAST | CallAST

export type AST = ValueAST | NonValueAST

export interface IAST {
  type: LANG
}

export interface BoolAST extends IAST {
  type: LANG.Bool
  value: boolean
}

export interface NumberAST extends IAST {
  type: LANG.Number
  value: number
}

export interface VarAST extends IAST {
  type: LANG.Var
  name: string
}

export interface NilAST extends IAST {
  type: LANG.Nil
}

export interface FunAST extends IAST {
  type: LANG.Fun
  name: string
  args: string[]
  body: AST | LANG.BuiltIn
}

export interface ClosureAST extends IAST {
  type: LANG.Closure
  fun: FunAST
  env: Env
}

export interface CallAST extends IAST {
  type: LANG.Call
  fun: AST
  args: AST[]
}

// export interface StringAST extends IAST {
//   type: LANG.String
//   value: string
// }

// export interface PairAST extends IAST {
//   type: LANG.Pair
//   fst: AST
//   snd: AST
// }
