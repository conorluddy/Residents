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
  NOT_FOUND: 'Resource not found.',
  CONFLICT_ERROR: 'Conflict error.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  DATABASE_ERROR: 'Database error.',
  EMAIL_ERROR: 'Email processing error.',
  FEATURE_NOT_IMPLEMENTED: 'Feature not implemented.',
  TOO_MANY_REQUESTS_TRY_AGAIN_IN_10: 'Too many requests, please try again after 10 minutes.',

  // User Management
  USER_CREATED: 'User created successfully.',
  USER_REGISTERED: 'User registered.',
  USER_RETRIEVED: 'User retrieved successfully.',
  USER_UPDATED: 'Successfully updated user.',
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
  PASSWORD_NEEDED: 'You need a password.',
  YOU_CAN_ONLY_REQUEST_ONCE_EVERY_10_MINUTES: 'You can only request this once every 10 minutes.',

  // New Keys Added
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
  FAILED_CREATING_USER: 'Failed to create user.',
  INVALID_DATA_PROVIDED: 'Invalid data provided.',
  INVALID_GOOGLE_CALLBACK_TOKEN: 'Invalid Google Callback token.',
  INVALID_TARGET_USER_ROLE: 'Invalid target user role.',
  INVALID_TOKEN_TYPE: 'Invalid token type.',
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
  NO_ID_PROVIDED: 'No ID provided.',
  NO_METADATA_PROVIDED_FOR_UPDATE: 'No meta data provided to update.',
  NO_PASSWORD_HASH_FOUND: 'No password hash found for that username or email.',
  NO_TOKEN_ID_PROVIDED: 'No token ID provided.',
  USER_NOT_FOUND_FOR_TOKEN: 'No user found for that token.',
  PASSWORD_ERROR: 'Password Error.',
  REFRESH_TOKEN_COUNTERPART_REQUIRED: 'Refresh token counterpart is required.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  RESET_PASSWORD_PROMPT: 'Reset your password.',
  ROLE_REQUIRED: 'Role must be provided.',
  SIGTERM_RECEIVED_CLOSING_SERVER: 'SIGTERM signal received: closing HTTP server.',
  SOMETHING_WENT_WRONG: 'Something went kaput...',
  STATUS_REQUIRED: 'Status must be provided.',
  TARGET_USER_DATA_MISSING: 'Target user data is missing.',
  SEEDING_SCRIPT_FIRST_USER_EXISTS:
    'This seeding script is only for setting the first user in an empty database, but the database already has users.',
  TOKEN_ERROR: 'Token Error.',
  TOKEN_REQUIRES_USER_ID: 'Token requires a UserID, none provided.',
  TOKEN_TYPE_REQUIRED: 'Token type is required, none provided.',
  TOKEN_USER_INVALID: 'Token user not valid.',
  USER_DELETE_PERMISSION_DENIED: 'User does not have permission to delete this user.',
  USER_GET_PERMISSION_DENIED: 'User does not have permission to get this user.',
  USER_HAS_NO_ROLE: 'User has no role.',
  USER_MISSING_REQUIRED_FIELDS: 'User is missing required fields.',
  VALIDATION_TOKEN_INVALID: 'Validation token invalid.',
}

export default MESSAGES

/**
An error occurred while sending email. >> MESSAGES.EMAIL_ERROR
At least one property must be provided for update. >> MESSAGES.AT_LEAST_ONE_PROPERTY_REQUIRED
Bad Request. >> MESSAGES.BAD_REQUEST
Cannot create owner/root user when the database already has users. >> MESSAGES.CANNOT_CREATE_OWNER_USER_WHEN_USERS_EXIST
Click here to reset your password: http://localhost:3000/auth/reset-password/${tokenId} >> MESSAGES.CLICK_RESET_PASSWORD_LINK
Click here to reset your password. >> MESSAGES.CLICK_RESET_PASSWORD
Conflict Error. >> MESSAGES.CONFLICT_ERROR
Couldnt create refresh token. >> MESSAGES.REFRESH_TOKEN_CREATION_FAILED
Creating users... >> MESSAGES.CREATING_USERS
Database Error. >> MESSAGES.DATABASE_ERROR
Email needs to be a valid email. >> MESSAGES.INVALID_EMAIL
Enum has no values. >> MESSAGES.ENUM_HAS_NO_VALUES
Error creating new user. >> MESSAGES.ERROR_CREATING_NEW_USER
Error creating refresh token. >> MESSAGES.ERROR_CREATING_REFRESH_TOKEN
Error logging in. >> MESSAGES.ERROR_LOGGING_IN
Failed to create new federated credentials >> MESSAGES.FAILED_CREATING_FEDERATED_CREDENTIALS
Failed to create user >> MESSAGES.FAILED_CREATING_USER
Forbidden. >> MESSAGES.ACCESS_DENIED
Internal Server Error. >> MESSAGES.INTERNAL_SERVER_ERROR
Invalid data provided. >> MESSAGES.INVALID_DATA_PROVIDED
Invalid email address. >> MESSAGES.INVALID_EMAIL
Invalid Google Callback token. >> MESSAGES.INVALID_GOOGLE_CALLBACK_TOKEN
Invalid or expired token. >> MESSAGES.TOKEN_INVALID
Invalid role provided. >> MESSAGES.INVALID_ROLE
Invalid target user role. >> MESSAGES.INVALID_TARGET_USER_ROLE
Invalid token type. >> MESSAGES.INVALID_TOKEN_TYPE
JWT contains invalid user data. >> MESSAGES.JWT_INVALID_USER_DATA
JWT secret not found. >> MESSAGES.JWT_SECRET_NOT_FOUND
JWT token is not provided in the request headers. >> MESSAGES.JWT_TOKEN_NOT_PROVIDED
JWT token secret is not defined in your environment variables. >> MESSAGES.JWT_SECRET_NOT_DEFINED
Magic login link. >> MESSAGES.MAGIC_LOGIN_LINK_MESSAGE
Missing Google OAuth environment variables. >> MESSAGES.MISSING_GOOGLE_OAUTH_ENV_VARS
Missing required fields. >> MESSAGES.MISSING_REQUIRED_FIELDS
Missing some required environment variables. >> MESSAGES.MISSING_REQUIRED_ENV_VARS
Missing token in discardToken middleware. >> MESSAGES.MISSING_TOKEN_IN_DISCARD_TOKEN_MIDDLEWARE
No email found in Google payload. >> MESSAGES.NO_EMAIL_IN_GOOGLE_PAYLOAD
No email provided. >> MESSAGES.EMAIL_REQUIRED
No ID provided. >> MESSAGES.NO_ID_PROVIDED
No meta data provided to update. >> MESSAGES.NO_METADATA_PROVIDED_FOR_UPDATE
No password hash found for that username or email. >> MESSAGES.NO_PASSWORD_HASH_FOUND
No token ID provided. >> MESSAGES.NO_TOKEN_ID_PROVIDED
No user found for that token. >> MESSAGES.USER_NOT_FOUND_FOR_TOKEN
No user found for that username or email. >> MESSAGES.USER_NOT_FOUND
No user ID provided. >> MESSAGES.MISSING_USER_ID
No username provided. >> MESSAGES.USERNAME_OR_EMAIL_REQUIRED
Not Acceptable. >> MESSAGES.BAD_REQUEST
Not Found. >> MESSAGES.NOT_FOUND
Not Implemented. >> MESSAGES.FEATURE_NOT_IMPLEMENTED
Password Error. >> MESSAGES.PASSWORD_ERROR
Password strength insufficient. >> MESSAGES.WEAK_PASSWORD
Refresh token counterpart is required. >> MESSAGES.REFRESH_TOKEN_COUNTERPART_REQUIRED
Refresh token is required. >> MESSAGES.REFRESH_TOKEN_REQUIRED
Request not acceptable. >> MESSAGES.BAD_REQUEST
Requested email for updating is invalid. >> MESSAGES.INVALID_EMAIL
Reset your password. >> MESSAGES.RESET_PASSWORD_PROMPT
Role must be provided. >> MESSAGES.ROLE_REQUIRED
SIGTERM signal received: closing HTTP server. >> MESSAGES.SIGTERM_RECEIVED_CLOSING_SERVER
Something went kaput... >> MESSAGES.SOMETHING_WENT_WRONG
Status must be provided. >> MESSAGES.STATUS_REQUIRED
Target user data is missing. >> MESSAGES.TARGET_USER_DATA_MISSING
Target user not found. >> MESSAGES.USER_NOT_FOUND
Target user role not found. >> MESSAGES.INVALID_TARGET_USER_ROLE
This seeding script is only for setting the first user in an empty database, but the database already has users. >> MESSAGES.SEEDING_SCRIPT_FIRST_USER_EXISTS
Token Error. >> MESSAGES.TOKEN_ERROR
Token requires a UserID, none provided. >> MESSAGES.TOKEN_REQUIRES_USER_ID
Token type is required, none provided. >> MESSAGES.TOKEN_TYPE_REQUIRED
Token user not valid. >> MESSAGES.TOKEN_USER_INVALID
Too Many Requests. >> MESSAGES.TOO_MANY_REQUESTS_TRY_AGAIN_IN_10
Too many requests, please chill for a bit. >> MESSAGES.TOO_MANY_REQUESTS_TRY_AGAIN_IN_10
Too many requests, slow down! >> MESSAGES.TOO_MANY_REQUESTS_TRY_AGAIN_IN_10
Unauthorized. >> MESSAGES.UNAUTHORIZED
User account is deleted. >> MESSAGES.ACCOUNT_DELETED
User cant perform this action. >> MESSAGES.INSUFFICIENT_PERMISSIONS
User data missing. >> MESSAGES.MISSING_USER_DATA
User does not have permission to delete this user. >> MESSAGES.USER_DELETE_PERMISSION_DENIED
User does not have permission to get this user. >> MESSAGES.USER_GET_PERMISSION_DENIED
User has no role. >> MESSAGES.USER_HAS_NO_ROLE
User is missing required fields >> MESSAGES.USER_MISSING_REQUIRED_FIELDS
Validation Error >> MESSAGES.VALIDATION_FAILED
Validation token invalid. >> MESSAGES.VALIDATION_TOKEN_INVALID
Validation token missing. >> MESSAGES.TOKEN_MISSING
**/
