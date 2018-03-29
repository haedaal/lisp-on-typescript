import { oneOf } from './F'

export type Env = { [key: string]: AST }

export enum LANG {
  Bool = 'Bool',
  Number = 'Number',
  Var = 'Var',
  Fun = 'Fun',
  Closure = 'Closure',
  Call = 'Call',
  Nil = 'Nil',
  BuiltIn = 'BuiltIn',
  // String = 'String',
  // Pair = 'Pair',
  // If = 'If',
}

export function isValue(ast: AST): ast is ValueAST {
  return oneOf(LANG.Bool, LANG.Number, LANG.Closure, LANG.Nil, LANG.BuiltIn)(ast.type)
}

export type ValueAST = BoolAST | NumberAST | ClosureAST | NilAST | BuiltInAST

export type AST = BoolAST | NumberAST | VarAST | NilAST | ClosureAST | FunAST | CallAST | BuiltInAST
// | PairAST
// | IfAST

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

export interface BuiltInAST extends IAST {
  type: LANG.BuiltIn
}

export interface FunAST extends IAST {
  type: LANG.Fun
  name: string
  args: string[]
  body: AST
}

export interface ClosureAST extends IAST {
  type: LANG.Closure
  fun: FunAST
  env: any
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

// export interface IfAST extends IAST {
//   type: LANG.If
//   cond: AST
//   e1: AST
//   e2: AST
// }
