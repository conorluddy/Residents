import { ROLES, STATUS } from "../../constants/database"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"
import { NewUser } from "../types"
import SERVICES from "../../services"

/**
 * Seed the first user in the database
 * This is the owner of the application
 *
 * @param {string} password - The password to use for the first user
 */
const seedUserZero = async (password: string = "resident") => {
  try {
    const usersAlreadyExist = (await SERVICES.getUserCount()) > 0

    if (usersAlreadyExist) {
      logger.warn(
        "This seeding script is only for setting the first user in an empty database, but the database already has users."
      )
      throw new Error("Cannot create owner/root user when the database already has users.")
    }

    const userZero: NewUser = {
      username: "resident",
      password: await createHash(password),
      firstName: "Resident",
      lastName: "Zero",
      email: "resident@resident.resident",
      role: ROLES.OWNER,
      status: STATUS.VERIFIED,
      deletedAt: null,
    }

    await SERVICES.createUser(userZero)

    logger.info(`First user seeded with Owner role.`)
  } catch (error) {
    logger.error(error)
  } finally {
    if (process.env.NODE_ENV !== "test") process.exit()
  }
}

// Gets the amount of users to seed from the command line
const args = process.argv.slice(2)
const password = args.length > 0 ? args[0] : "resident"

seedUserZero(password)

export { seedUserZero }
export default seedUserZero
