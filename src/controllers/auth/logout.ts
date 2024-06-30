import { Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"

/**
 * logout
 */
export const logout = async ({ body }: Request, res: Response) => {
  try {
    // One does not simply log-out with JWTs.
    // Need to implement refresh tokens and shoft-lived access tokens
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).send("Not implemented yet")
  } catch (error) {
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error logging in")
  }
}
