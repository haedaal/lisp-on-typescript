import { LANG, AST } from './LANG_SPEC'

export function prettyAST(ast: AST, maxDepth = 2): string {
  if (maxDepth === 0) return '?'
  switch (ast.type) {
    case LANG.Bool:
    case LANG.Number: {
      return `${ast.type} ${ast.value}`
    }
    case LANG.Fun: {
      return `Function '${ast.name}'`
    }
    case LANG.Call: {
      return `CALL ${prettyAST(ast.fun, maxDepth - 1)} WITH ${ast.args
        .map(a => prettyAST(a, maxDepth - 1))
        .join(', ')}`
    }
    default: {
      return '?'
    }
  }
}
