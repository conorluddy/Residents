import { getEnumValues } from "../utils/typescriptUtils"

/**
 * User roles will be set as an Enum in PostGres
 * as well as being used for access control in
 * the ACL and authorization middleware.
 */
export enum ROLES {
  ADMIN = "admin",
  OWNER = "owner",
  MODERATOR = "moderator",
  DEFAULT = "default",
  LOCKED = "locked",
}

export const ROLES_ARRAY = getEnumValues(ROLES)
