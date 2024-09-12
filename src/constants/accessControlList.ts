import { ROLES } from "./database"

export enum PERMISSIONS {
  // User management
  CAN_CREATE_USERS = "can_create_users",
  CAN_CREATE_SAME_ROLE_USERS = "can_create_same_role_users",
  CAN_CREATE_LOWER_ROLE_USERS = "can_create_lower_role_users",

  // User retrieval
  CAN_GET_OWN_USER = "can_get_own_user",
  CAN_GET_ALL_USERS = "can_get_all_users",
  CAN_GET_SAME_ROLE_USERS = "can_get_same_role_users",
  CAN_GET_LOWER_ROLE_USERS = "can_get_lower_role_users",

  // User updates
  CAN_UPDATE_ANY_USER_PROFILE = "can_update_any_user_profile",
  CAN_UPDATE_ANY_USER_ROLE = "can_update_any_user_role",
  CAN_UPDATE_ANY_USER_STATUS = "can_update_any_user_status",
  CAN_UPDATE_OWN_USER = "can_update_own_user",
  CAN_UPDATE_SAME_ROLE_USERS = "can_update_same_role_users",
  CAN_UPDATE_LOWER_ROLE_USERS = "can_update_lower_role_users",

  // User deletion
  CAN_DELETE_ANY_USER = "can_delete_any_user",
  CAN_DELETE_SAME_ROLE_USERS = "can_delete_same_role_users",
  CAN_DELETE_LOWER_ROLE_USERS = "can_delete_lower_role_users",

  // System operations
  CAN_CLEAR_EXPIRED_TOKENS = "can_clear_expired_tokens",
  CAN_VIEW_AUDIT_LOGS = "can_view_audit_logs",
  CAN_MANAGE_ROLES = "can_manage_roles",

  // Minimal permissions
  CAN_ACCESS_OWN_DATA = "can_access_own_data", // probably same as getownuser
}

export const ACL: { [key in ROLES]: PERMISSIONS[] } = {
  [ROLES.OWNER]: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.CAN_CLEAR_EXPIRED_TOKENS,
    PERMISSIONS.CAN_CREATE_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_CREATE_USERS,
    PERMISSIONS.CAN_DELETE_ANY_USER,
    PERMISSIONS.CAN_DELETE_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_GET_ALL_USERS,
    PERMISSIONS.CAN_GET_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_GET_OWN_USER,
    PERMISSIONS.CAN_UPDATE_ANY_USER_PROFILE,
    PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS,
    PERMISSIONS.CAN_UPDATE_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_UPDATE_OWN_USER,
    PERMISSIONS.CAN_VIEW_AUDIT_LOGS,
    PERMISSIONS.CAN_ACCESS_OWN_DATA,
  ],

  [ROLES.MODERATOR]: [
    PERMISSIONS.CAN_CREATE_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_GET_ALL_USERS,
    PERMISSIONS.CAN_GET_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_GET_OWN_USER,
    PERMISSIONS.CAN_UPDATE_ANY_USER_STATUS,
    PERMISSIONS.CAN_UPDATE_LOWER_ROLE_USERS,
    PERMISSIONS.CAN_UPDATE_OWN_USER,
    PERMISSIONS.CAN_ACCESS_OWN_DATA,
  ],

  [ROLES.DEFAULT]: [
    PERMISSIONS.CAN_GET_OWN_USER,
    PERMISSIONS.CAN_UPDATE_OWN_USER,
    PERMISSIONS.CAN_GET_SAME_ROLE_USERS,
    PERMISSIONS.CAN_ACCESS_OWN_DATA,
  ],

  [ROLES.LOCKED]: [PERMISSIONS.CAN_ACCESS_OWN_DATA],
}
