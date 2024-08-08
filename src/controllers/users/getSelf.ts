import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS, HTTP_SERVER_ERROR } from "../../constants/http"
import { tableUsers } from "../../db/schema"
import { JWTUserPayload } from "../../utils/generateJwt"
import { logger } from "../../utils/logger"
import db from "../../db"

/**
 * getSelf - gets own user record
 */
export const getSelf = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as JWTUserPayload)?.id
    if (!userId)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "User ID is missing in the request." })

    const [user] = await db.select().from(tableUsers).where(eq(tableUsers.id, userId))
    if (!user) return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User not found." })

    // Don't return PW
    const { password, ...shareableUser } = user

    return res.status(HTTP_SUCCESS.OK).json(shareableUser)
  } catch (error) {
    logger.error(error)
    return res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error while getting user." })
  }
}

export default getSelf
