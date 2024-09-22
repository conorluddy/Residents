/**
 * Helper function to safely get a string from a query parameter
 * @param queryParam - The query parameter to get the string from
 * @param defaultValue - The default value to return if the query parameter is not a string
 * @returns The string value of the query parameter or the default value
 */
export const getStringFromQuery = (queryParam: unknown, defaultValue: string): string =>
  typeof queryParam === 'string' ? queryParam : defaultValue

/**
 * Helper function to safely get number from a query parameter
 * @param queryParam - The query parameter to get the number from
 * @param defaultValue - The default value to return if the query parameter is not a number
 * @returns The number value of the query parameter or the default value
 */
export const getQueryNumber = (queryParam: unknown, defaultValue: number): number => {
  if (typeof queryParam !== 'string') {
    return defaultValue
  }

  const parsedQs = parseInt(queryParam, 10)

  if (isNaN(parsedQs)) {
    return defaultValue
  }

  return parsedQs
}
