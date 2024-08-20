import { Request, Response } from "express"
import { isEmail } from "validator"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { User } from "../../db/schema"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import SERVICES from "../../services"
import { validateHash } from "../../utils/crypt"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { logger } from "../../utils/logger"

/**
 * login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = (req.body ?? {}) as Pick<User, "username" | "email" | "password">

    if (!username && !email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Username or email is required" })
    }

    if (!password) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password is required" })
    }

    if (!username && email && !isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Invalid email address" })
    }

    const user = await SERVICES.getUserByEmail(email)

    if (!user) {
      // Should we throw here and then clear auth in the catch and res from there??
      // Should probably clear any existing auth here
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Nope." })
    }

    const passwordHash = await SERVICES.getUserPasswordHash(user.id)

    if (!passwordHash) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Nope." })
    }

    if (!(await validateHash(password, passwordHash))) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Nope." })
    }

    const refreshToken = await SERVICES.createToken({
      userId: user.id,
      type: TOKEN_TYPE.REFRESH,
      expiry: TIMESPAN.WEEK,
    })

    if (!refreshToken) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Nope." })
    }

    const accessToken = generateJwtFromUser(user)
    const xsrfToken = generateXsrfToken()

    // Set the tokens in a HTTP-only secure cookies
    res.cookie("refreshToken", refreshToken.id, {
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
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error logging in." })
  }
}
