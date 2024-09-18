import { Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import { PublicUser } from "../../db/types"

interface Props {
  res: Response
  message?: string
  token?: string
  user?: PublicUser
  users?: PublicUser[]
  debug?: string // TODO: Add a DEBUG req symbol so we can return extra data
}

const handleSuccessResponse = ({ res, message = "Success.", token, user, users, debug }: Props) =>
  res.status(HTTP_SUCCESS.OK).json({ message, token, user, users })

const handleCreatedResponse = ({ res, message = "Success.", token, user, debug }: Props) =>
  res.status(HTTP_SUCCESS.CREATED).json({ message, token, user })

export { handleSuccessResponse, handleCreatedResponse }
