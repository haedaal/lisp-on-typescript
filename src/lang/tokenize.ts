import * as F from '../util/F'
// no string in this lang for easier initial implementation
export default function tokenize(line: string): any[] {
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

// (def (even x) (if (= x 0) true (if (= x 1) false (even (+ x -2)))))