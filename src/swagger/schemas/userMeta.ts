/**
 * @swagger
 * components:
 *   schemas:
 *     Meta:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - metaItem
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user meta item
 *         userId:
 *           type: string
 *           description: The ID of the user this meta data belongs to
 *         metaItem:
 *           type: string
 *           description: This is a placeholder - in reality you will define metaItems with useful properties
 *       example:
 *         id: ID1
 *         userId: USERID
 *         metaItem: Some useful User data
 *   tags:
 *     - name: Users
 *       description: The users managing API
 */
