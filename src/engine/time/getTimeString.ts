import type { GameTime } from '@/types'

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function parseStartDate(startDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = startDate.split('-').map(Number)

  if (!year || !month || !day) {
    throw new Error(`Invalid start date: ${startDate}`)
  }

  return { year, month, day }
}

function calendarDateForDay(startDate: string, simulationDay: number): Date {
  const { year, month, day } = parseStartDate(startDate)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + simulationDay - 1)
  return date
}

/** Format simulation day as a human-readable calendar date. */
export function getTimeString(time: GameTime, startDate: string): string {
  const date = calendarDateForDay(startDate, time.day)
  const weekday = WEEKDAYS[date.getDay()]
  const month = MONTHS[date.getMonth()]

  return `${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
}
