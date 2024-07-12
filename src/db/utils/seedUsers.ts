import db from ".."
import { ROLES_ARRAY, STATUS_ARRAY } from "../../constants/database"
import { createHash } from "../../utils/crypt"
import { tableUsers } from "../schema"
import { NewUser } from "../types"
import { faker } from "@faker-js/faker"

/**
 * Faker function to create a random users
 * Their password will be the same as their username
 * You can run `npm run seed X` to seed X amount of users
 *
 * @returns {Promise<User>}
 */
async function createRandomUsers(amount: number): Promise<NewUser[]> {
  const users: NewUser[] = []
  console.log("Creating users...")
  for (let i = 0; i < amount; i++) {
    const username = faker.internet.userName()
    const password = await createHash(username)
    users.push({
      username,
      password,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      rank: faker.number.float({ multipleOf: 0.2, min: 0, max: 50 }),
      role: faker.helpers.arrayElement(ROLES_ARRAY),
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
      console.log(`${user.firstName} ${user.lastName} [${user.role} / ${user.status}]`)
      const newUser = await db.insert(tableUsers).values(user).returning().execute()
    }
    console.log(`${amount} user(s) seeded`)
  } catch (error) {
    console.log(error)
  } finally {
    if (process.env.NODE_ENV !== "test") process.exit()
  }
}

// Gets the amount of users to seed from the command line
const args = process.argv.slice(2)
const amount = args.length > 0 ? parseInt(args[0], 10) : 10

seedUsers(amount)

export { createRandomUsers, seedUsers }
