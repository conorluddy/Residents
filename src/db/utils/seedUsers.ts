import { faker } from '@faker-js/faker'
import { ROLES, STATUS_ARRAY } from '../../constants/database'
import SERVICES from '../../services'
import { createHash } from '../../utils/crypt'
import { logger } from '../../utils/logger'
import { NewUser } from '../types'

/**
 * Faker function to create a random users
 * Their password will be the same as their username
 * You can run `npm run seed X` to seed X amount of users
 *
 * @returns {Promise<User>}
 */
async function createRandomUsers(amount: number): Promise<NewUser[]> {
  const users: NewUser[] = []
  logger.info('Creating users...')

  for (let i = 0; i < amount; i++) {
    const username = faker.internet.userName()
    const password = await createHash(username)
    users.push({
      username: username.toLowerCase(),
      password,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      role: faker.helpers.arrayElement([ROLES.ADMIN, ROLES.DEFAULT, ROLES.LOCKED, ROLES.MODERATOR]), // Omit OWNER
      status: faker.helpers.arrayElement(STATUS_ARRAY),
      deletedAt: faker.helpers.arrayElement([faker.date.past(), null, null, null]),
    })
  }
  return users
}

const seedUsers = async (amount: number) => {
  try {
    const users = await createRandomUsers(amount)
    for (const user of users) {
      logger.info(`${user.firstName} ${user.lastName} [${user.role} / ${user.status}]`)
      await SERVICES.createUser(user)
    }
    logger.info(`${amount} user(s) seeded`)
  } catch (error) {
    logger.error(error)
  } finally {
    if (process.env.NODE_ENV !== 'test') {process.exit()}
  }
}

// Gets the amount of users to seed from the command line
const args = process.argv.slice(2)
const amount = args.length > 0 ? parseInt(args[0], 10) : 10

seedUsers(amount)

export { createRandomUsers, seedUsers }
