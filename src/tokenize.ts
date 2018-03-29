import * as F from './F'
// no string in this lang for easier initial implementation
export function tokenize(line: string): any[] {
  const tokens: any[] = []

  let word = ''
  for (let chr of line) {
    if (F.oneOf(')', '(', ' ')(chr)) {
      if (word) {
        tokens.push(word)
        word = ''
      }
    }

    F.cond<string, void>([
      [F.oneOf(')', '('), c => tokens.push(c)],
      [F.oneOf(' '), c => null],
      [F.T, c => (word += c)],
    ])(chr)
  }

  if (word) {
    tokens.push(word)
    word = ''
  }

  return tokens
}
