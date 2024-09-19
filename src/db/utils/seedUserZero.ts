import { ROLES, STATUS } from '../../constants/database'
import { logger } from '../../utils/logger'
import { NewUser } from '../types'
import SERVICES from '../../services'

// Make this an EVN
export const DEFAULT_SEED_PASSWORD = 'R351D3NT!zero'

/**
 * Seed the first user in the database
 * This is the owner of the application
 *
 * @param {string} password - The password to use for the first user
 */
const seedUserZero = async (password: string = DEFAULT_SEED_PASSWORD) => {
  try {
    const usersAlreadyExist = (await SERVICES.getUserCount()) > 0

    if (usersAlreadyExist) {
      logger.warn(
        'This seeding script is only for setting the first user in an empty database, but the database already has users.'
      )
      throw new Error('Cannot create owner/root user when the database already has users.')
    }

    const userZero: NewUser = {
      username: 'resident',
      firstName: 'Resident',
      lastName: 'Zero',
      email: 'resident@resident.resident',
      password,
      role: ROLES.OWNER,
      status: STATUS.VERIFIED,
    }

    await SERVICES.createUser(userZero)

    logger.info(MESSAGES.FIRST_USER_SEEDED)
  } catch (error) {
    logger.error(error)
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      process.exit()
    }
  }
}

// Gets the amount of users to seed from the command line
const args = process.argv.slice(2)
const password = args.length > 0 ? args[0] : DEFAULT_SEED_PASSWORD

seedUserZero(password)

export { seedUserZero }
export default seedUserZero
