import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { PublicUser } from '../../db/types'

interface Props {
  res: Response
  message?: string
  token?: string
  user?: PublicUser
  users?: PublicUser[]
  debug?: string // TODO: Add a DEBUG req symbol so we can return extra data
}

const handleSuccessResponse = ({ res, message, token, user, users }: Props): Response =>
  res.status(HTTP_SUCCESS.OK).json({
    ...(message && { message }),
    ...(token && { token }),
    ...(user && { user }),
    ...(users && { users }),
  })

const handleCreatedResponse = ({ res, message, user }: Props): Response =>
  res.status(HTTP_SUCCESS.CREATED).json({
    ...(message && { message }),
    ...(user && { user }),
  })

export { handleSuccessResponse, handleCreatedResponse }
