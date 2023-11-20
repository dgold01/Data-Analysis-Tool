import { type TimeInterval } from './getTimeIntervals'
import getSparseRefFromIndexes from './getSparseRefFromIndexes'

export function evaluateRateOfChange (columnIndex: number, dummyData: Record<string, string | number>, intialTime: string, finalTime: string, intervalOptions: TimeInterval[]): number | undefined {
  const initialTimeObject = intervalOptions.find(obj => obj.timeString === intialTime)
  const finalTimeObject = intervalOptions.find(obj => obj.timeString === finalTime)

  if (initialTimeObject && finalTimeObject) {
    const initalValue = dummyData[getSparseRefFromIndexes(initialTimeObject.index, columnIndex)] as number
    const finalValue = dummyData[getSparseRefFromIndexes(finalTimeObject.index, columnIndex)] as number
    const rateOfChange = ((finalValue - initalValue) / ((finalTimeObject.timeMilliseconds / 1000) - initialTimeObject.timeMilliseconds / 1000))
    return rateOfChange
  }
}
