import { NextFunction, Request, Response } from "express"
import { isEmail } from "validator"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { User } from "../../db/schema"
import { BadRequestError, ForbiddenError, PasswordError } from "../../errors"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import SERVICES from "../../services"
import { validateHash } from "../../utils/crypt"
import { generateJwtFromUser } from "../../utils/generateJwt"

/**
 * login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = (req.body ?? {}) as Pick<User, "username" | "email" | "password">

  if (!username && !email) throw new BadRequestError("Username or email is required")

  if (!password) throw new BadRequestError("Password is required")

  if (email && !isEmail(email)) throw new BadRequestError("Invalid email address")

  const getUserByUsernameOrEmail = username ? SERVICES.getUserByUsername : SERVICES.getUserByEmail
  const user = await getUserByUsernameOrEmail(username ?? email)

  if (!user) throw new ForbiddenError("No user found for that username or email.") // Should probably clear any existing auth here

  const passwordHash = await SERVICES.getUserPasswordHash(user.id)

  if (!passwordHash) throw new PasswordError("No password hash found for that username or email.")

  if (!(await validateHash(password, passwordHash))) throw new PasswordError("Incorrect password.")

  const refreshTokenId = await SERVICES.createToken({
    userId: user.id,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!refreshTokenId) throw new ForbiddenError("Couldnt create refresh token.")

  const accessToken = generateJwtFromUser(user)
  const xsrfToken = generateXsrfToken()

  // Set the tokens in a HTTP-only secure cookies
  res.cookie("refreshToken", refreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TIMESPAN.WEEK,
  })

  res.cookie("xsrfToken", xsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TIMESPAN.WEEK,
  })

  return res.status(HTTP_SUCCESS.OK).json({ accessToken })
}
