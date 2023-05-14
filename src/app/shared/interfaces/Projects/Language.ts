// предлагаю такую концепцию - здесь будут все языки, которые могут быть, а уже там мы будем чекать, если ли они через null

export type Language = {
  Java?: number
  HTML?: number
  Shell?: number
  JavaScript?: number
  Kotlin?: number
  Csharp: number // WARNING: не уверен, что именно так пишется
  Ruby: number
}

// мб лучше так

export type Languages = 'Java' | 'HTML' | 'Shell' | 'JavaScript' | 'Kotlin' | 'Csharp' | 'Ruby'

export type Language1 = Record<Languages, number>


let a: Partial<Language1> = {
  Java: 4
}

type l = {
  a: Partial<Language1>,
}

let b: l = {
  a: {
    'Java': 4
  }
}
