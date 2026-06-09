export type TimePeriod =
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Night'

export interface GameTime {
  day: number
  period: TimePeriod
}

export const INITIAL_GAME_TIME: GameTime = {
  day: 1,
  period: 'Morning',
}
