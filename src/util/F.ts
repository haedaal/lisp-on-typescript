export function cond<T1, T2>(cases: [(v: T1) => boolean, (v: T1) => T2][]) {
  return (v: T1) => {
    for (let c of cases) {
      if (c[0](v)) {
        return c[1](v)
      }
    }
  }
}

export function cond2<IN, OUT, T1, T2>(
  cases: [(v: T1) => boolean, (v: T2) => OUT][],
  feedCond: (v: IN) => T1,
  feedBody: (v: IN) => T2
) {
  return (v: IN) => {
    for (let c of cases) {
      if (c[0](feedCond(v))) {
        return c[1](feedBody(v))
      }
    }
  }
}

export function oneOf<T>(...vs: T[]) {
  return (v2: T) => vs.some(v => v === v2)
}

export function T() {
  return true
}

export function eq<T>(v1: T) {
  return function(v2: T) {
    return v1 === v2
  }
}

export function id<T>(v: T) {
  return v
}

export function toObj<T1, T2>(arr: T1[], keyF: (v: T1) => string, valueF: (v: T1) => T2) {
  const obj = {} as { [key: string]: T2 }
  arr.forEach(v => (obj[keyF(v)] = valueF(v)))
  return obj
}

export function diff<T>(arr1: T[], arr2: T[]): T[] {
  const map = new Map<T, boolean>(arr2.map(e => [e, true] as [T, boolean]))

  return arr1.filter(e => !map.has(e))
}
