import { ROLES, STATUS } from '../../constants/database'
import { logger } from '../../utils/logger'
import { NewUser } from '../types'
import SERVICES from '../../services'
import MESSAGES from '../../constants/messages'
import config from '../../config'

// Make this an EVN

const SEEDED_OWNER_USERNAME = config.SEEDED_OWNER_USERNAME ?? 'resident'
const SEEDED_OWNER_FIRSTNAME = config.SEEDED_OWNER_FIRSTNAME ?? 'Resident'
const SEEDED_OWNER_LASTNAME = config.SEEDED_OWNER_LASTNAME ?? 'Zero'
const SEEDED_OWNER_EMAIL = config.SEEDED_OWNER_EMAIL ?? 'resident@resident.resident'
const SEEDED_OWNER_PASSWORD = config.SEEDED_OWNER_PASSWORD ?? 'R351D3NT!zero'

/**
 * Seed the first user in the database
 * This is the owner of the application
 *
 * @param {string} password - The password to use for the first user
 */
const seedUserZero = async (password: string = SEEDED_OWNER_PASSWORD): Promise<void> => {
  try {
    const usersAlreadyExist = (await SERVICES.getUserCount()) > 0

    if (usersAlreadyExist) {
      logger.warn(MESSAGES.SEEDING_SCRIPT_FIRST_USER_EXISTS)
      throw new Error(MESSAGES.CANNOT_CREATE_OWNER_USER_WHEN_USERS_EXIST)
    }

    const userZero: NewUser = {
      password: password,
      username: SEEDED_OWNER_USERNAME,
      firstName: SEEDED_OWNER_FIRSTNAME,
      lastName: SEEDED_OWNER_LASTNAME,
      email: SEEDED_OWNER_EMAIL,
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
const password = args.length > 0 ? args[0] : SEEDED_OWNER_PASSWORD

seedUserZero(password)

export { seedUserZero }
export default seedUserZero
