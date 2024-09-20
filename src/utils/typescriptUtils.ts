import MESSAGES from '../constants/messages'

/**
 * Get the values of an enum as a Tuple
 * @param enumObj
 * @returns
 */
export const getEnumValues = <T extends string>(enumObj: { [key: string]: T }): readonly [T, ...T[]] => {
  const values = Object.values(enumObj) as T[]
  if (values.length === 0) {
    throw new Error(MESSAGES.ENUM_HAS_NO_VALUES)
  }
  return [values[0], ...values.slice(1)] as [T, ...T[]]
}
