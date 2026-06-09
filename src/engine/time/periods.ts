import { INITIAL_GAME_TIME } from '@/types/time'
import type { GameTime, TimePeriod } from '@/types'

export { INITIAL_GAME_TIME }

export const TIME_PERIODS: readonly TimePeriod[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
] as const

export function nextGameTime(time: GameTime): GameTime {
  const periodIndex = TIME_PERIODS.indexOf(time.period)

  if (periodIndex === TIME_PERIODS.length - 1) {
    return { day: time.day + 1, period: 'Morning' }
  }

  return { day: time.day, period: TIME_PERIODS[periodIndex + 1] }
}
