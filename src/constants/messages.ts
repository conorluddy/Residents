// TODO: Better grouping and organisation

const MESSAGES = {
  // Authentication
  TOKEN_REQUIRED: 'A token is required.',
  VALID_TOKEN_REQUIRED: 'A valid token is required.',
  ACCESS_DENIED: 'Access denied.',
  ACCOUNT_VALIDATED: 'Account validated.',
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  UNAUTHORIZED: 'Unauthorized access.',

  // Errors
  BAD_REQUEST: 'Bad request.',
  NOT_ACCEPTABLE: 'Request not acceptable.',
  NOT_FOUND: 'Resource not found.',
  CONFLICT_ERROR: 'Conflict error.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  DATABASE_ERROR: 'Database error.',
  EMAIL_ERROR: 'Email processing error.',
  EMAIL_NORMALISATION_ERROR: 'Email normalisation error.',
  FEATURE_NOT_IMPLEMENTED: 'Feature not implemented.',
  TOO_MANY_REQUESTS: 'Too many requests.',
  TOO_MANY_REQUESTS_TRY_AGAIN_IN_10: 'Too many requests, please try again after 10 minutes.',
  INVALID_PAGINATION_PARAMS: 'Invalid pagination params provided.',

  // User Management
  USER_CREATED: 'User created successfully.',
  USER_REGISTERED: 'User registered.',
  USER_RETRIEVED: 'User retrieved successfully.',
  USER_UPDATED: 'Successfully updated user.',
  USER_DELETED: 'User was deleted.',
  USER_NOT_FOUND: 'User not found.',
  USER_META_UPDATED: 'Successfully updated user meta.',
  INVALID_USER_DATA: 'Invalid user data.',
  MISSING_USER_DATA: 'User data is missing.',
  MISSING_USER_ID: 'User ID is missing.',
  USER_ID_MISMATCH: 'User ID mismatch.',
  CANT_SELF_DELETE: 'Users can not self-delete.',
  ERROR_CREATING_USERNAME: 'Error generating username.',

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
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  WEAK_PASSWORD: 'Password not strong enough, try harder.',
  INVALID_EMAIL: 'Email is not valid.',
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
  API_DOCUMENTATION: 'API documentation.',
  NO_UPDATE_DATA: 'No update data provided.',
  INCORRECT_PASSWORD: 'Incorrect password.',
  USERNAME_OR_EMAIL_REQUIRED: 'Username or email is required.',
  USERNAME_REQUIRED: 'Username is required.',
  PASSWORD_NEEDED: 'You need a password.',
  YOU_CAN_ONLY_REQUEST_ONCE_EVERY_10_MINUTES: 'You can only request this once every 10 minutes.',
  AT_LEAST_ONE_PROPERTY_REQUIRED: 'At least one property must be provided for update.',
  CANNOT_CREATE_OWNER_USER_WHEN_USERS_EXIST: 'Cannot create owner/root user when the database already has users.',
  CLICK_RESET_PASSWORD_LINK: 'Click here to reset your password: {url}',
  CLICK_RESET_PASSWORD: 'Click here to reset your password.',
  REFRESH_TOKEN_CREATION_FAILED: 'Could not create refresh token.',
  CREATING_USERS: 'Creating users...',
  ENUM_HAS_NO_VALUES: 'Enum has no values.',
  ERROR_CREATING_NEW_USER: 'Error creating new user.',
  ERROR_CREATING_REFRESH_TOKEN: 'Error creating refresh token.',
  ERROR_LOGGING_IN: 'Error logging in.',
  FAILED_CREATING_FEDERATED_CREDENTIALS: 'Failed to create new federated credentials.',
  USER_NOT_FOUND_FEDERATED_CREDENTIALS: 'User not found matching federated credentials.',
  FAILED_CREATING_USER: 'Failed to create user.',
  INVALID_DATA_PROVIDED: 'Invalid data provided.',
  INVALID_GOOGLE_CALLBACK_TOKEN: 'Invalid Google Callback token.',
  INVALID_TARGET_USER_ROLE: 'Invalid target user role.',
  INVALID_TOKEN_TYPE: 'Invalid token type.',
  INVALID_TIME_FORMAT: 'Invalid time format.',
  JWT_INVALID_USER_DATA: 'JWT contains invalid user data.',
  JWT_SECRET_NOT_FOUND: 'JWT secret not found.',
  JWT_TOKEN_NOT_PROVIDED: 'JWT token is not provided in the request headers.',
  JWT_SECRET_NOT_DEFINED: 'JWT token secret is not defined in your environment variables.',
  MAGIC_LOGIN_LINK_MESSAGE: 'Magic login link.',
  MISSING_GOOGLE_OAUTH_ENV_VARS: 'Missing Google OAuth environment variables.',
  MISSING_REQUIRED_FIELDS: 'Missing required fields.',
  MISSING_REQUIRED_ENV_VARS: 'Missing some required environment variables.',
  MISSING_TOKEN_IN_DISCARD_TOKEN_MIDDLEWARE: 'Missing token in discardToken middleware.',
  NO_EMAIL_IN_GOOGLE_PAYLOAD: 'No email found in Google payload.',
  INVALID_EMAIL_IN_GOOGLE_PAYLOAD: 'Invalid email found in Google payload.',
  NO_ID_PROVIDED: 'No ID provided.',
  NO_METADATA_PROVIDED_FOR_UPDATE: 'No meta data provided to update.',
  NO_PASSWORD_HASH_FOUND: 'No password hash found for that username or email.',
  NO_TOKEN_ID_PROVIDED: 'No token ID provided.',
  USER_NOT_FOUND_FOR_TOKEN: 'No user found for that token.',
  PASSWORD_ERROR: 'Password Error.',
  PASSWORD_WAS_RESET: 'Password was reset.',
  PASSWORD_UPDATE_ERROR: 'Error updating password.',
  REFRESH_TOKEN_COUNTERPART_REQUIRED: 'Refresh token counterpart is required.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  RESET_PASSWORD_PROMPT: 'Reset your password.',
  ROLE_REQUIRED: 'Role must be provided.',
  SIGTERM_RECEIVED_CLOSING_SERVER: 'SIGTERM signal received: closing HTTP server.',
  SERVER_SHUTDOWN: 'Server shut down.',
  SOMETHING_WENT_WRONG: 'Something went kaput...',
  STATUS_REQUIRED: 'Status must be provided.',
  TARGET_USER_DATA_MISSING: 'Target user data is missing.',
  SEEDING_SCRIPT_FIRST_USER_EXISTS:
    'This seeding script is only for setting the first user in an empty database, but the database already has users.',
  TOKEN_ERROR: 'Token Error.',
  TOKEN_REQUIRES_USER_ID: 'Token requires a UserID, none provided.',
  TOKEN_TYPE_REQUIRED: 'Token type is required, none provided.',
  TOKEN_TYPE_INVALID: 'Token type is invalid.',
  TOKEN_USER_INVALID: 'Token user not valid.',
  EXPIRED_TOKENS_DELETED: 'Expired tokens deleted.',
  ERROR_DISCARDING_TOKEN: 'Error discarding token.',
  USER_VALIDATED: 'User validated.',
  USER_DELETE_PERMISSION_DENIED: 'User does not have permission to delete this user.',
  USER_UPDATE_PERMISSION_DENIED: 'User does not have permission to update this user.',
  USER_GET_PERMISSION_DENIED: 'User does not have permission to get this user.',
  USER_HAS_NO_ROLE: 'User has no role.',
  USER_MISSING_REQUIRED_FIELDS: 'User is missing required fields.',
  VALIDATION_TOKEN_INVALID: 'Validation token invalid.',
  MAGIC_LOGIN_EMAIL_SENT: 'Magic login email sent.',
  // Passport
  MISSING_PASSPORT_PROFILE_ID: 'Missing passport profile ID.',
  MISSING_PASSPORT_PROVIDER: 'Missing passport provider.',
  MISSING_PASSPORT_USER_ID: 'Missing passport user ID.',
  FEDERATED_CREDENTIALS_NOT_FOUND: 'Federated credentials not found.',
  FEDERATED_CREDENTIALS_NOT_CREATED: 'Federated credentials not created.',
}

export default MESSAGES
export { MESSAGES }

/**  TODO
Problem with email normalization for
Click here to validate your account
Magic login email sent to
Error Code
Error Message
Error updating password for user: ${token.userId}, the DB update result should be the same as request ID: ${updatedUserId}
Field:'
Help:'
HTTP server closed
Running: http://localhost:${serverPort}
Swagger API docs are available at http://localhost:${serverPort}/api-docs
User ${deletedUserId} deleted
User ${updatedUserId} updated successfully
*/
