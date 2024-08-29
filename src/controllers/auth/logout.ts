import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import SERVICES from "../../services"
import { REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { BadRequestError } from "../../errors"

/**
 * logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req[REQUEST_USER]?.id

    if (!userId) {
      logger.error("User ID not found", { userId })
      throw new BadRequestError("User ID not found.")
    }

    // TODO: Clear the refreshToken and xsrfToken cookies

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(),
    })

    res.cookie("xsrfToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(),
    })

    await SERVICES.deleteRefreshToken({ userId })

    return res.status(HTTP_SUCCESS.OK).json({ message: "Logged out - Come back soon!" })
  } catch (error) {
    logger.error("Error logging out", { error })
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error logging out" })
  }
}
