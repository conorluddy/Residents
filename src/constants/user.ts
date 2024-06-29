import { getEnumValues } from "../utils/typescriptUtils"

/**
 * User roles will be set as an Enum in PostGres
 * as well as being used for access control in
 * the ACL and authorization middleware.
 *
 * Note the order here is important for role superiority.
 * Lower index roles are superior to higher index roles.
 * Roles can generally only mutate users with roles lower
 * than their own.
 */
export enum ROLES {
  ADMIN = "admin",
  OWNER = "owner",
  MODERATOR = "moderator",
  DEFAULT = "default",
  LOCKED = "locked",
}
export const ROLES_ARRAY = getEnumValues(ROLES)

export enum STATUS {
  BANNED = "banned",
  DELETED = "deleted",
  PENDING = "pending",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
  UNVERIFIED = "unverified",
  VERIFIED = "verified",
}
export const STATUS_ARRAY = getEnumValues(STATUS)
