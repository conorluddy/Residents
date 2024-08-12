import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { User } from "../../db/schema"
import { logger } from "../../utils/logger"
import { loginUser } from "../../services/users/login"

/**
 * login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = (req.body ?? {}) as Pick<User, "username" | "email" | "password">

    const { accessToken, refreshToken, xsrfToken } = await loginUser(username, email, password)

    // Set the tokens in HTTP-only secure cookies

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
