import { max, min, mean, sum, size } from 'mathjs'

export default function aggreagtionHandler (aggregationType: string, columnIndex: number, dummyData: Record<string, string | number>): number | string {
  const columnData: number[] = []
  for (let i = 0; i < 8; i++) {
    const sparsePosition = `${columnIndex}-${i}`
    columnData[i] = dummyData[sparsePosition] as number
  }

  switch (aggregationType) {
    case 'max':
      return max(columnData)

    case 'min':
      return min(columnData)

    case 'average':
      return mean(columnData)

    case 'sum':
      return sum(columnData)

    case 'count':
      // return size(columnData)

    default:
      return 'Unsupported aggregation type'
  }
}
