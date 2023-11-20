export interface TimeInterval {
  index: number
  timeString: string
  timeMilliseconds: number
}

export function getTimeIntervals (dummyData: Record<string, string | number>): TimeInterval[] {
  const timeStampsString: string[] = []

  for (let i = 0; i < 8; i++) {
    const sparsePosition = `0-${i}`
    timeStampsString[i] = dummyData[sparsePosition] as string
  }

  const timeStamps: Date[] = Object.values(timeStampsString).map(dateStr => new Date(dateStr))
  const initialTime = timeStamps[0]
  const timeIntervals: TimeInterval[] = []

  for (let i = 0; i < timeStamps.length; i++) {
    const endTime: Date = timeStamps[i]
    const timeDifference: number = endTime.getTime() - initialTime.getTime()
    const hours: number = Math.floor(timeDifference / (1000 * 60 * 60))
    const minutes: number = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds: number = Math.floor((timeDifference % (1000 * 60)) / 1000)
    const timeString = `${hours}h:${minutes}m:${seconds}s`
    const timeMilliseconds = timeDifference
    timeIntervals.push({ index: i, timeString, timeMilliseconds })
  }

  return timeIntervals
}
