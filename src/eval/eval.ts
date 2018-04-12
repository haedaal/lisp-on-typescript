import {
  AST,
  Env,
  LANG,
  FunAST,
  NumberAST,
  VarAST,
  isValue,
  NonValueAST,
  ClosureAST,
} from '../lang/LANG'
import * as F from '../util/F'
import { evaluateBuiltIn } from './built-in'
import { prettyAST } from '../util/pretty'

export default function evaluate(ast: AST, env: Env): AST {
  // console.debug(`[Eval] ${prettyAST(ast)}`)
  return isValue(ast) ? ast : evaluate(_evaluate(ast, env), env)
}

function _evaluate(ast: NonValueAST, env: Env): AST {
  // console.debug(`[_Eval] ${prettyAST(ast)}`)
  switch (ast.type) {
    case LANG.Var: {
      if (env[ast.name]) {
        return env[ast.name]
      } else {
        return { type: LANG.Nil }
      }
    }
    case LANG.Fun: {
      // def는 특수 케이스로 빼는게 맞아보임. 일단 함수로 시작했으니 끝까지 가보기
      if (ast.name === 'def') {
        return {
          type: LANG.Closure,
          fun: ast,
          env,
        }
      }

      const varNames: string[] = findVars(ast)

      const closureEnv = varNames.reduce(
        (pv, name) => {
          pv[name] = env[name]
          return pv
        },
        {} as Env
      )

      const closure: ClosureAST = {
        type: LANG.Closure,
        fun: ast,
        env: closureEnv,
      }

      closure.env[ast.name] = closure

      return closure
    }
    case LANG.Call: {
      const closure = evaluate(ast.fun, env)
      if (closure.type !== LANG.Closure) {
        throw new Error(`${closure.type} 함수가 아닌걸 부른다아아아`)
      }
      const { fun } = closure

      // special case. eval 하기 전의 ast를 봐야함
      // 함수라고 하기 힘든 def의 ast를 함수와 같은 구조로 그냥 써먹으려 하다보니 좀 지저분해지는것 같은데,
      // 장단점?
      if (fun.name === 'def') {
        if (ast.args.length !== 2) {
          throw new Error('def 는 인자가 두개만 와야된다아아아')
        }
        const [target, expr] = ast.args
        return evaluateDef(target, expr, env) // local def 를 어떻게 해야할지?
      }

      const args = ast.args.map(arg => evaluate(arg, env))

      if (fun.body === LANG.BuiltIn) {
        // built-in functions
        return evaluateBuiltIn(fun, args)
      } else {
        // defined function
        if (fun.args.length !== args.length) {
          throw new Error('인자 갯수가 맞지 않는다아!!')
        }

        const funEnv = { ...closure.env }
        fun.args.forEach((arg, index) => {
          funEnv[arg] = args[index]
        })
        return evaluate(fun.body, funEnv)
      }
    }
    default: {
      return { type: LANG.Nil }
    }
  }
}

function evaluateDef(target: AST, expr: AST, env: Env) {
  switch (target.type) {
    case LANG.Bool:
    case LANG.Number: {
      throw new Error(`지금 뭐하는거냐아아아 ${target.value} 에다가 대입을 하다니이이이`)
    }
    case LANG.Var: {
      // 변수 선언
      const res = evaluate(expr, env)
      env[target.name] = res
      return res
    }
    case LANG.Call: {
      const { fun, args } = target
      if (fun.type !== LANG.Var) {
        throw new Error(
          `선언을 할꺼냐 말꺼냐 (def (함수이름 변수1 변수2) (body) 이렇게 이름을 줘라아`
        )
      }
      if (args.some(a => a.type !== LANG.Var)) {
        throw new Error(`변수에는 이름을 똑바로 써라아`)
      }
      const newFun: FunAST = {
        type: LANG.Fun,
        name: fun.name,
        args: (args as VarAST[]).map(a => a.name),
        body: expr,
      }
      env[fun.name] = evaluate(newFun, env)
      return newFun
    }
    default: {
      throw new Error('아직까지 이런케이스는 생각을 안해봐서 실행을 못한다아')
    }
  }
}

function findVars(ast: FunAST): string[] {
  const { args, body } = ast
  if (body === LANG.BuiltIn) return []
  else {
    const vars = _findVars(body)

    // don't take arguments into closure env
    return F.diff(vars, args)
  }
}

// def 에서 함수를 클로져로 eval 할때만 쓰이는 것이다
// 함수 호출의 ast에서 이 함수를 쓰는 경우의 동작은 예측할수 없음
function _findVars(ast: AST): string[] {
  if (isValue(ast)) {
    return []
  } else {
    switch (ast.type) {
      case LANG.Var: {
        return [ast.name]
      }
      case LANG.Fun: {
        return findVars(ast)
      }
      case LANG.Call: {
        return [ast.fun, ...ast.args].reduce(
          (pv, cv) => {
            return pv.concat(_findVars(cv))
          },
          [] as string[]
        )
      }
      default: {
        throw new Error('Never reach here')
      }
    }
  }
}
