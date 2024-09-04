import { isEmail, isStrongPassword, normalizeEmail } from "validator"
import db from "../../db"
import { NewUser, tableUserMeta, tableUsers, User } from "../../db/schema"
import { PASSWORD_STRENGTH_CONFIG } from "../../constants/password"
import { createHash } from "../../utils/crypt"
import { Meta } from "../../db/types"
import { EmailError, PasswordStrengthError, ValidationError } from "../../errors"

/**
 * createUser - Service to create a new user.
 * @param {NewUser} user - The new user object.
 * @returns {Promise<User["id"] | null>} - The new user object.
 */
const createUser = async (userProps: NewUser): Promise<User["id"] | null> => {
  const { username, firstName, lastName, email, password, role } = userProps

  if (!username || !firstName || !lastName || !email || !password || !role) {
    throw new ValidationError("Missing required fields.")
  }

  if (!isStrongPassword(password, PASSWORD_STRENGTH_CONFIG)) {
    throw new PasswordStrengthError("Password not strong enough, try harder.")
  }

  if (!isEmail(email)) {
    throw new EmailError("Email needs to be a valid email.")
  }

  const normalisedEmail = normalizeEmail(email, { all_lowercase: true })

  if (!normalisedEmail) {
    throw new EmailError(`Problem with email normalization for ${email}`)
  }

  const hashedPassword = await createHash(password)

  const newUser: NewUser = {
    firstName,
    lastName,
    username: username.toLowerCase(),
    email: normalisedEmail,
    password: hashedPassword,
    //
    // role: ROLES.DEFAULT, // TODO: Need only allow roles below current users role
    role: role,
  }

  const [user] = await db.insert(tableUsers).values(newUser).onConflictDoNothing().returning()

  return user.id
}

export { createUser }
