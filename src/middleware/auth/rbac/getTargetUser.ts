import { NextFunction, Request, Response } from "express"
import { ROLES, ROLES_ARRAY, STATUS } from "../../../constants/database"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../../errors"
import SERVICES from "../../../services"
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../../types/requestSymbols"

/**
 * Get the target user from the request params if the user has the required permissions
 * @param req
 * @param res
 * @param next
 */
async function getTargetUser(req: Request, res: Response, next: NextFunction) {
  const user = req[REQUEST_USER]
  const targetUserId = req.params.id

  if (!user) throw new BadRequestError("Missing User data.")
  if (!user.role) throw new ForbiddenError("User has no role.")
  if (!!user.deletedAt) throw new UnauthorizedError("User account is deleted.")

  // OPTIMISATION: Make a map for these to make it more efficient sometime
  if (!ROLES_ARRAY.includes(user.role)) throw new ForbiddenError("Invalid user role.")
  if (ROLES.LOCKED === user.role) throw new ForbiddenError("User account is locked.")
  if (STATUS.BANNED === user.status) throw new ForbiddenError("User account is banned.")
  if (STATUS.SUSPENDED === user.status) throw new ForbiddenError("User account is suspended.")
  if (STATUS.UNVERIFIED === user.status) throw new ForbiddenError("User account is not verified.")
  if (STATUS.REJECTED === user.status) throw new ForbiddenError("User account is rejected.") // Not sure we need/use this

  // Go fetch the target user
  const targetUser = await SERVICES.getUserById(targetUserId)

  if (!targetUser) throw new NotFoundError("Target user not found.")
  if (!targetUser.role) throw new ForbiddenError("Target user role not found.")
  if (!ROLES_ARRAY.includes(targetUser.role)) throw new ForbiddenError("Invalid target user role.")

  // All good, set the target user on the request object

  req[REQUEST_TARGET_USER] = targetUser
  req[REQUEST_TARGET_USER_ID] = targetUser.id
  next()
}

export default getTargetUser
