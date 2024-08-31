import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { REQUEST_USER } from "../../types/requestSymbols"
import { generateJwtFromUser } from "../../utils/generateJwt"

/**
 * googleCallback
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  if (!req[REQUEST_USER]) throw new Error("User not found")
  // TODO: Revalidate before returning token
  // This isn't secure, you can just fire a made up user at it in the request and get a token.
  // Probably need to check request for google related stuff and validate that the user is who they say they are.
  const token = generateJwtFromUser(req[REQUEST_USER])
  return res.status(HTTP_SUCCESS.OK).json({ token })
}
