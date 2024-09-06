import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { BadRequestError } from "../../errors"
import SERVICES from "../../services"
import { REQUEST_USER } from "../../types/requestSymbols"

/**
 * logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req[REQUEST_USER]?.id
  if (!userId) throw new BadRequestError("User ID is missing.")

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

  await SERVICES.deleteRefreshTokensByUserId({ userId })

  return res.status(HTTP_SUCCESS.OK).json({ message: "Logged out from API. Clear your client tokens." })
}
