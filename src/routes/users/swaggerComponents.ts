/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - username
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         email_verified:
 *           type: string
 *           enum: [banned, deleted, pending, rejected, suspended, unverified, verified]
 *           description: The user's email verification status
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was created
 *         role:
 *           type: string
 *           enum: [owner, admin, moderator, default]
 *           description: The user's role
 *       example:
 *         id: 1
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         email_verified: unverified
 *         username: johndoe
 *         password: securepassword123
 *         createdAt: 2024-01-01T00:00:00Z
 *         role: default
 *     NewUser:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         username: johndoe
 *         password: securepassword123
 *     UpdateUser:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         email_verified:
 *           type: string
 *           enum: [banned, deleted, pending, rejected, suspended, unverified, verified]
 *           description: The user's email verification status
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *         role:
 *           type: string
 *           enum: [owner, admin, moderator, default]
 *           description: The user's role
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         email_verified: verified
 *         username: johndoe
 *         password: newsecurepassword123
 *         role: admin
 *   tags:
 *     - name: Users
 *       description: The users managing API
 */
