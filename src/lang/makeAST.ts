import { AST, LANG, FunAST } from './LANG'

export default function makeAST(tokens: string[], index: number = 0): [AST, number] {
  const first = tokens[index]
  switch (first) {
    case '(': {
      const [fun, c] = makeAST(tokens, index + 1)
      const args = []
      let cursor = c + 1
      while (tokens[cursor] !== ')') {
        const [t, evalCursor] = makeAST(tokens, cursor)
        args.push(t)
        cursor = evalCursor + 1
      }
      return [{ type: LANG.Call, fun, args }, cursor]
    }
    case 'true': {
      return [{ type: LANG.Bool, value: true }, index]
    }
    case 'false': {
      return [{ type: LANG.Bool, value: false }, index]
    }
    default: {
      if (Number.isNaN(+first)) {
        return [{ type: LANG.Var, name: first }, index]
      } else {
        return [{ type: LANG.Number, value: +first }, index]
      }
    }
  }
}
