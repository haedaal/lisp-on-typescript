import { AST, Env, LANG, FunAST, NumberAST, VarAST } from './LANG_SPEC'

export function evaluate(ast: AST, env: Env): AST {
  switch (ast.type) {
    case LANG.Var: {
      if (env[ast.name]) {
        return env[ast.name]
      } else {
        return { type: LANG.Nil }
      }
    }
    case LANG.Bool:
    case LANG.Number: {
      return ast
    }
    case LANG.Call: {
      const f = evaluate(ast.fun, env)
      if (f.type !== LANG.Fun) {
        throw new Error(`함수가 아닌걸 부른다아아아`)
      }

      // special case. eval 하기 전의 ast를 봐야함
      if (f.name === 'def') {
        if (ast.args.length !== 2) {
          throw new Error('def 는 인자가 두개만 와야된다아아아')
        }
        const [target, expr] = ast.args
        return evaluateDef(target, expr, env)
      }

      const args = ast.args.map(arg => evaluate(arg, env))

      if (f.body.type === LANG.BuiltIn) {
        return evaluateBuiltIn(f, args)
      } else {
        if (f.args.length !== args.length) {
          throw new Error('인자 갯수가 맞지 않는다아!!')
        }
        const localEnv = { ...env }
        f.args.forEach((arg, index) => {
          localEnv[arg] = args[index]
        })
        return evaluate(f.body, localEnv)
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
      env[fun.name] = newFun
      return newFun
    }
    default: {
      throw new Error('아직까지 이런케이스는 생각을 안해봐서 실행을 못한다아')
    }
  }
}

function evaluateBuiltIn(f: FunAST, args: AST[]): AST {
  switch (f.name) {
    case '+': {
      if (args.some(a => a.type !== LANG.Number)) {
        throw new Error('숫자가 아닌걸 더한다아아아아')
      } else {
        return {
          type: LANG.Number,
          value: (args as NumberAST[]).map(a => a.value).reduce((l, r) => l + r, 0),
        }
      }
    }
    case '*': {
      if (args.some(a => a.type !== LANG.Number)) {
        throw new Error('숫자가 아닌걸 곱한다아아아')
      } else {
        return {
          type: LANG.Number,
          value: (args as NumberAST[]).map(a => a.value).reduce((l, r) => l * r, 1),
        }
      }
    }
    case '=': {
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
    case 'if': {
      // already evaluated, inefficient ofcourse
      const [cond, e1, e2] = args
      if (cond.type === LANG.Bool) {
        if (cond.value === true) {
          return e1
        } else {
          return e2
        }
      } else {
        throw new Error('if 다음에는 bool을 써라아아')
      }
    }
    default: {
      throw new Error('빌트인 함수인데 구현이 안되었다아아')
    }
  }
}
