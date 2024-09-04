import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS, HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { OAuth2Client } from "google-auth-library"
import { EmailError, NotFoundError } from "../../errors"
import SERVICES from "../../services"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * googleCallback
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  // Verify the Google ID token
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()
  if (!payload) {
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ error: "Invalid token" })
  }

  const userId = payload.sub

  if (!payload.email) throw new EmailError("No email found in Google payload")

  const user = await SERVICES.getUserByEmail(payload.email)

  if (!user) throw new NotFoundError("User not found")

  const token = generateJwtFromUser(user)

  return res.status(HTTP_SUCCESS.OK).json({ token })
}
