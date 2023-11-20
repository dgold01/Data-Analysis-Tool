import { parse, evaluate } from 'mathjs'

export function parseAndEvaluateFormula (formula: string, columnMap: Record<string, number>, columnNamesInFormula: string[], dummyData: Record<string, string | number>, i: number): number | string {
  const rowData: Record<string, string | number> = {}

  for (const column of columnNamesInFormula) {
    const sparsePosition = `${columnMap[column]}-${i}`
    rowData[column.replace(/\s/g, '')] = dummyData[sparsePosition]
  }

  const scope = rowData

  try {
    const parsedFormula = parse(formula.replace(/\s/g, '')).toString()
    const result = evaluate(parsedFormula, scope)

    return result
  } catch (error) {
    return 'Error evaluating the formula'
  }
}
