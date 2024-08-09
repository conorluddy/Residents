import { count } from "drizzle-orm"
import db from ".."
import { ROLES, STATUS } from "../../constants/database"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"
import { tableUsers } from "../schema"
import { NewUser } from "../types"

/**
 * Seed the first user in the database
 * This is the owner of the application
 *
 * @param {string} password - The password to use for the first user
 */
const seedUserZero = async (password: string = "resident") => {
  try {
    const userCountResult = await db.select({ count: count() }).from(tableUsers)

    if (userCountResult && userCountResult[0]?.count > 0) {
      logger.error(
        "This seeding script is only for setting the first user in an empty database, but the database already has users."
      )
      throw new Error("Database already has users.")
    }

    const userZero: NewUser = {
      username: "resident",
      password: await createHash(password),
      firstName: "Resident",
      lastName: "Zero",
      email: "",
      role: ROLES.OWNER,
      status: STATUS.VERIFIED,
      deletedAt: null,
    }

    await db.insert(tableUsers).values(userZero).returning().execute()

    logger.info(`First user seeded with Owner role.`)
  } catch (error) {
    console.log("error", error)
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
