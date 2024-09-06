import SERVICES from "../../services"
import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { BadRequestError } from "../../errors"
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from "../../constants/keys"

/**
 * logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  // Clear the cookies regardless of whether we have any existing ones

  res.cookie(REFRESH_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  })

  res.cookie(XSRF_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  })

  res.cookie(RESIDENT_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  })

  console.log("cookies", req.cookies)

  // Delete the refresh tokens from the database
  const userId = req.cookies?.[RESIDENT_TOKEN]
  if (!userId) throw new BadRequestError("User ID is missing.")
  await SERVICES.deleteRefreshTokensByUserId({ userId })

  return res.status(HTTP_SUCCESS.OK).json({ message: "Logged out successfully." })
}
