// [pred, f] cases -> fallback case -> value -> result
export function cond<T1, T2>(cases: [(v: T1) => boolean, (v: T1) => T2][]) {
  return (v: T1) => {
    for (let c of cases) {
      if (c[0](v)) {
        return c[1](v)
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
