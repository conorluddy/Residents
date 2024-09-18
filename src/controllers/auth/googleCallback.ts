import { NextFunction, Request, Response } from "express"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { OAuth2Client } from "google-auth-library"
import { EmailError, NotFoundError, UnauthorizedError } from "../../errors"
import { handleSuccessResponse } from "../../middleware/util/successHandler"
import SERVICES from "../../services"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * googleCallback
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  if (!payload) throw new UnauthorizedError("Invalid Google Callback token")

  const userEmail = payload.email
  if (!userEmail) throw new EmailError("No email found in Google payload")

  const user = await SERVICES.getUserByEmail(userEmail)

  if (!user) throw new NotFoundError("User not found")

  const token = generateJwtFromUser(user)

  return handleSuccessResponse({ res, token })
}
