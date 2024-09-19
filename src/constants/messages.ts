const MESSAGES = {
  // Authentication
  TOKEN_REQUIRED: 'A token is required.',
  VALID_TOKEN_REQUIRED: 'A valid token is required.',
  ACCESS_DENIED: 'Access denied.',
  ACCOUNT_VALIDATED: 'Account validated.',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  UNAUTHORIZED: 'Unauthorized access.',

  // Errors
  BAD_REQUEST: 'Bad request.',
  NOT_FOUND: 'Resource not found.',
  CONFLICT_ERROR: 'Conflict error.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  DATABASE_ERROR: 'Database error.',
  EMAIL_ERROR: 'Email processing error.',
  FEATURE_NOT_IMPLEMENTED: 'Feature not implemented.',
  TOO_MANY_REQUESTS_TRY_AGAIN_IN_10: 'Too many requests, please try again after 10 minutes.',

  // User Management
  USER_CREATED: 'User created successfully',
  USER_REGISTERED: 'User registered.',
  USER_RETRIEVED: 'User retrieved successfully',
  USER_UPDATED: 'Successfully updated user',
  USER_DELETED: 'User was deleted.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_USER_DATA: 'Invalid user data.',
  MISSING_USER_DATA: 'User data is missing.',
  MISSING_USER_ID: 'User ID is missing.',
  USER_ID_MISMATCH: 'User ID mismatch.',
  CANT_SELF_DELETE: 'Users can not self-delete.',

  // Permissions
  INSUFFICIENT_PERMISSIONS: 'User can not perform this action.',
  ROLE_SUPERIORITY_REQUIRED: 'Role superiority is required for this operation.',

  // Account Status
  ACCOUNT_BANNED: 'User account is banned.',
  ACCOUNT_LOCKED: 'User account is locked.',
  ACCOUNT_SUSPENDED: 'User account is suspended.',
  ACCOUNT_DELETED: 'User account was deleted.',
  ACCOUNT_NOT_VERIFIED: 'User account is not verified.',
  ACCOUNT_REJECTED: 'User account is rejected.',

  // Validation
  INVALID_EMAIL: 'Email is not valid.',
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required',
  WEAK_PASSWORD: 'Password not strong enough, try harder.',
  INVALID_ROLE: 'Invalid user role.',
  INVALID_STATUS: 'Invalid status provided.',
  VALIDATION_FAILED: 'Validation failed.',

  // Tokens
  TOKEN_EXPIRED: 'Token has expired.',
  TOKEN_USED: 'Token has already been used.',
  TOKEN_INVALID: 'Token is invalid or expired.',
  TOKEN_NOT_FOUND: 'Token not found.',
  TOKEN_MISSING: 'Token missing.',

  // Email Messages
  CHECK_EMAIL_MAGIC_LINK: 'Check your email for your magic login link.',
  CHECK_EMAIL_RESET_LINK: 'Check your email for your reset password link.',
  PASSWORD_RESET_SUCCESS: 'Password successfully updated.',

  // CSRF
  XSRF_TOKEN_INVALID: 'XSRF token is invalid.',
  XSRF_TOKEN_REQUIRED: 'XSRF token is required.',

  // Misc
  FIRST_USER_SEEDED: 'First user seeded with Owner role.',
  API_DOCUMENTATION: 'API documentation',
  NO_UPDATE_DATA: 'No update data provided.',
  INCORRECT_PASSWORD: 'Incorrect password.',
  USERNAME_OR_EMAIL_REQUIRED: 'Username or email is required',
  PASSWORD_NEEDED: 'You need a password.',
  RATE_LIMIT_MESSAGE: 'You can only request this once every 10 minutes.',
}

export default MESSAGES
