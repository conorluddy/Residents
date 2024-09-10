import { NextFunction, Request, Response } from "express"
import { ACL, PERMISSIONS } from "../../constants/accessControlList"
import { ROLES, ROLES_ARRAY, STATUS } from "../../constants/database"
import { REQUEST_TARGET_USER, REQUEST_TARGET_USER_ID, REQUEST_USER } from "../../types/requestSymbols"
import SERVICES from "../../services"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../errors"

/**
 * Check if the user has the required permission to access the resource
 * @param permission PERMISSIONS
 * @param matchId boolean - If true then the user id must match the resource id (can only edit self etc)
 */
const checkPermission = (permission: PERMISSIONS) => (req: Request, res: Response, next: NextFunction) => {
  const user = req[REQUEST_USER]

  if (!user) throw new BadRequestError("User data is missing.")
  if (!!user.deletedAt) throw new ForbiddenError("User was deleted.")
  if (!user.role) throw new ForbiddenError("User has no role.")
  if (ROLES.LOCKED === user.role) throw new ForbiddenError("User account is locked.")
  if (STATUS.BANNED === user.status) throw new ForbiddenError("User account is banned.")
  if (STATUS.DELETED === user.status) throw new ForbiddenError("User account was deleted.")
  if (STATUS.SUSPENDED === user.status) throw new ForbiddenError("User account is suspended.")
  if (STATUS.UNVERIFIED === user.status) throw new ForbiddenError("User account is not verified.")
  if (user.role && !ACL[user.role].includes(permission)) throw new ForbiddenError("User cant perform this action.")

  next()
}

/**
 * Check if the user has role superiority over the target user
 */
async function getTargetUserAndEnsureSuperiority(req: Request, res: Response, next: NextFunction) {
  const user = req[REQUEST_USER]
  const targetUserId = req.params.id

  if (!user) throw new BadRequestError("Missing User data.")
  if (!!user.deletedAt) throw new UnauthorizedError("User account is deleted.")
  if (!user.role) throw new ForbiddenError("User has no role.")

  const userIsAdminOrOwner = [ROLES.ADMIN, ROLES.OWNER].includes(user.role)

  if (user.role === ROLES.LOCKED) throw new ForbiddenError("User account is locked.")
  if (STATUS.BANNED === user.status) throw new ForbiddenError("User account is banned.")
  if (STATUS.SUSPENDED === user.status) throw new ForbiddenError("User account is suspended.")
  if (STATUS.UNVERIFIED === user.status) throw new ForbiddenError("User account is not verified.")
  if (STATUS.REJECTED === user.status) throw new ForbiddenError("User account is rejected.") // Not sure we need/use this

  const userRoleIndex = ROLES_ARRAY.findIndex((role) => role === user.role)

  if (userRoleIndex === -1) throw new ForbiddenError("Invalid user role.")

  // Don't get target user until we know the user has the required permissions //

  const targetUser = await SERVICES.getUserById(targetUserId)

  if (!targetUser) throw new NotFoundError("Target user not found.")
  if (!targetUser.role) throw new ForbiddenError("Target user role not found.")
  if (targetUser?.role === ROLES.LOCKED && !userIsAdminOrOwner)
    throw new UnauthorizedError("Target user account is locked and can only be unlocked by an admin.")

  const targetRoleIndex = ROLES_ARRAY.findIndex((role) => role === targetUser?.role)

  if (targetRoleIndex === -1) throw new ForbiddenError("Invalid target user role.")
  if (targetRoleIndex <= userRoleIndex) throw new UnauthorizedError("Role superiority is required for this operation.")

  // All good, set the target user on the request object //

  req[REQUEST_TARGET_USER] = targetUser
  req[REQUEST_TARGET_USER_ID] = targetUser.id
  next()
}

const RBAC = {
  //
  getTargetUserAndEnsureSuperiority,
  //
  checkCanGetOwnUser: checkPermission(PERMISSIONS.CAN_GET_OWN_USER),
  checkCanCreateUsers: checkPermission(PERMISSIONS.CAN_CREATE_USERS),
  checkCanGetUsers: checkPermission(PERMISSIONS.CAN_GET_ALL_USERS),
  checkCanUpdateUsers: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER),
  checkCanUpdateOwnUser: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  checkCanDeleteUsers: checkPermission(PERMISSIONS.CAN_DELETE_ANY_USER),
  checkCanUpdateAnyUserStatus: checkPermission(PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS),
  checkCanUpdateOwnProfile: checkPermission(PERMISSIONS.CAN_UPDATE_OWN_USER),
  checkCanClearExpiredTokens: checkPermission(PERMISSIONS.CAN_CLEAR_EXPIRED_TOKENS),
}

export default RBAC
