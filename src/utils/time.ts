/**
 * Convert a time string (e.g., "15m", "1w") to milliseconds.
 *
 * Supports the following units:
 * - s: seconds
 * - m: minutes
 * - h: hours
 * - d: days
 * - w: weeks
 *
 * @param {string} timeString - The time duration as a string.
 * @returns {number} - The duration in milliseconds.
 * @throws {Error} - Throws an error if the format is invalid.
 */

import MESSAGES from '../constants/messages'
import { ValidationError } from '../errors'

const timeToMs = (timeString: string): number => {
  // Maybe use this instead - https://github.com/vercel/ms

  const timeUnitConversions: Record<TimeUnit, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  }

  const match = timeString.match(/^(\d+)([smhdwy])$/) as RegExpMatchArray | null

  if (!match) {
    throw new ValidationError(`${MESSAGES.INVALID_TIME_FORMAT} ${timeString}`)
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  return value * timeUnitConversions[unit as TimeUnit]
}

type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'y'

export { timeToMs }
