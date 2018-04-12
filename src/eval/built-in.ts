import { FunAST, AST, LANG, NumberAST, Env } from '../lang/LANG'
import * as F from '../util/F'
import evaluate from './eval'

export const builtInList = ['+', '*', '=', 'def', 'if']

export function evaluateBuiltIn(f: FunAST, args: AST[]): AST {
  const evalBuiltIn = F.cond2(
    [[F.eq('+'), add], [F.eq('*'), mult], [F.eq('='), eq], [F.eq('if'), _if], [F.T, missing]],
    () => f.name,
    () => args
  )

  const ast = evalBuiltIn({})

  if (ast === undefined) {
    throw new Error('Never happens due to F.T -> missing')
  }

  return ast
}

function add(args: AST[]): AST {
  if (args.some(a => a.type !== LANG.Number)) {
    throw new Error('숫자가 아닌걸 더한다아아아아')
  } else {
    return {
      type: LANG.Number,
      value: (args as NumberAST[]).map(a => a.value).reduce((l, r) => l + r, 0),
    }
  }
}

function mult(args: AST[]): AST {
  if (args.some(a => a.type !== LANG.Number)) {
    throw new Error('숫자가 아닌걸 곱한다아아아')
  } else {
    return {
      type: LANG.Number,
      value: (args as NumberAST[]).map(a => a.value).reduce((l, r) => l * r, 1),
    }
  }
}

function eq(args: AST[]): AST {
  if (args.length !== 2) {
    throw new Error('두개만 비교해라아')
  }
  const [e1, e2] = args
  if (LANG.Number === e1.type && LANG.Number === e2.type) {
    if (e1.value === e2.value) {
      return { type: LANG.Bool, value: true }
    } else {
      return { type: LANG.Bool, value: false }
    }
  } else {
    return { type: LANG.Bool, value: false }
  }
}

function _if(args: AST[]): AST {
  // if 를 함수로 구현했고 아직 late binding 이 되지 않아서 e1, e2 모두 eval 되는 문제
  const [cond, e1, e2] = args
  if (cond.type !== LANG.Bool) throw new Error('if 다음에는 bool을 써라아아')
  return cond.value === true ? e1 : e2
}

function missing(args: AST[]): AST {
  throw new Error('빌트인 함수인데 구현이 안되었다아아')
}

// convienient helper func
export function makeBuiltIn(keyword: string): FunAST {
  return {
    type: LANG.Fun,
    name: keyword,
    args: [],
    body: LANG.BuiltIn,
  }
}
