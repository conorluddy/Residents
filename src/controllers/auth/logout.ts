import { Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"

/**
 * logout
 */
export const logout = async ({ body }: Request, res: Response) => {
  try {
    res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).send("Not implemented yet")
  } catch (error) {
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error logging in")
  }
}
