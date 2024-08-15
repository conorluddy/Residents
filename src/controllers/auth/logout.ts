import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { tableTokens, User } from "../../db/schema"
import { logger } from "../../utils/logger"
import db from "../../db"
import { and, eq } from "drizzle-orm"
import { TOKEN_TYPE } from "../../constants/database"
import { REQUEST_USER } from "../../types/requestSymbols"

/**
 * logout
 */
export const logout = async (req: Request, res: Response) => {
  // authenticateToken middleware should have added the user to the request

  try {
    // need to type the req better
    const userId = req[REQUEST_USER]?.id

    if (!userId) {
      logger.error("User ID not found", { userId })
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "User ID not found" })
    }

    // Clear the refreshToken and xsrfToken cookies

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

    await db.delete(tableTokens).where(
      and(
        //
        eq(tableTokens.userId, userId),
        eq(tableTokens.type, TOKEN_TYPE.REFRESH)
      )
    )

    return res.status(HTTP_SUCCESS.OK).json({ message: "Logged out - Come back soon!" })
  } catch (error) {
    logger.error("Error logging out", { error })
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error logging out" })
  }
}
