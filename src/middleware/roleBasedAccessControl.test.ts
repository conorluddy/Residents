import { NextFunction, Request, Response } from "express"
import { ROLES } from "../constants/database"
import { HTTP_CLIENT_ERROR } from "../constants/http"
import { User } from "../db/types"
import { makeAFakeUser } from "../test-utils/mockUsers"
import { JWTUserPayload } from "../utils/generateJwt"
import { RBAC } from "./roleBasedAccessControl"

let mockUser: Partial<User>

jest.mock("../utils/logger")

jest.mock("../db", () => ({
  // Move this to own mocks file
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({}),
    }),
  }),
}))

describe("Middleware:RBAC:checkPermission", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockAdminUser: Partial<User>
  let mockDefaultUser: Partial<User>
  let mockLockedUser: Partial<User>
  let mockDeletedAdminUser: Partial<User>
  let mockDeletedDefaultUser: Partial<User>

  beforeAll(async () => {
    mockAdminUser = await makeAFakeUser({ role: ROLES.ADMIN })
    mockDefaultUser = await makeAFakeUser({ role: ROLES.DEFAULT })
    mockLockedUser = await makeAFakeUser({ role: ROLES.LOCKED })
    mockDeletedAdminUser = await makeAFakeUser({ role: ROLES.ADMIN, deletedAt: new Date() })
    mockDeletedDefaultUser = await makeAFakeUser({ role: ROLES.DEFAULT, deletedAt: new Date() })
    // mockOwnerUser = await makeAFakeUser({ role: ROLES.OWNER })
    // mockModeratorUser = await makeAFakeUser({ role: ROLES.MODERATOR })
  })

  beforeEach(() => {
    mockRequest = {
      user: { role: ROLES.ADMIN, id: "AdminTestUser1" } as JWTUserPayload,
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("should call next function if the user has the required permission", () => {
    mockRequest.user = mockAdminUser
    RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
  })

  it("should return 403 if the user lacks the required permission", () => {
    mockRequest.user = mockDefaultUser
    RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  describe("Users with ADMIN role", () => {
    it("can GetOwnUser", () => {
      mockRequest.user = mockAdminUser
      RBAC.canGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can CreateUsers", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can GetUsers", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateUsers", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateOwnUser", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can DeleteUser", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanDeleteUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateAnyUserStatus", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanUpdateAnyUserStatus(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateOwnProfile", () => {
      mockRequest.user = mockAdminUser
      RBAC.checkCanUpdateOwnProfile(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
  })

  describe("Users with DEFAULT role", () => {
    it("can GET OWN/SELF user", () => {
      mockRequest.user = mockDefaultUser
      RBAC.canGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UPDATE OWN/SELF user", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UPDATE OWN/SELF profile (probably same as user update tbh)", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanUpdateOwnProfile(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't UPDATE users", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE other users status", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanUpdateAnyUserStatus(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't DELETE users", () => {
      mockRequest.user = mockDefaultUser
      RBAC.checkCanDeleteUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("Users with LOCKED role", () => {
    it("can GET OWN/SELF user", () => {
      mockRequest.user = mockLockedUser
      RBAC.canGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't UPDATE users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't DELETE users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanDeleteUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("Users with LOCKED role", () => {
    it("can GET OWN/SELF user", () => {
      mockRequest.user = mockLockedUser
      RBAC.canGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't UPDATE users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't DELETE users", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanDeleteUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("DELETED Users", () => {
    it("can't GET OWN/SELF user", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.canGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE users", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't DELETE users", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.checkCanDeleteUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("DELETED ADMIN Users", () => {
    it("can't GET OWN/SELF user", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.canGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE users", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't DELETE users", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.checkCanDeleteUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })
})

describe("Middleware:RBAC:checkRoleSuperiority", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockAdminUser: Partial<User>
  let mockDefaultUser: Partial<User>
  let mockLockedUser: Partial<User>
  let mockDeletedAdminUser: Partial<User>
  let mockDeletedDefaultUser: Partial<User>
  let mockOwnerUser: Partial<User>
  let mockModeratorUser: Partial<User>
  let mockUserNoRole: Partial<User>

  beforeAll(async () => {
    mockAdminUser = await makeAFakeUser({ role: ROLES.ADMIN })
    mockDefaultUser = await makeAFakeUser({ role: ROLES.DEFAULT })
    mockLockedUser = await makeAFakeUser({ role: ROLES.LOCKED })
    mockDeletedAdminUser = await makeAFakeUser({ role: ROLES.ADMIN, deletedAt: new Date() })
    mockDeletedDefaultUser = await makeAFakeUser({ role: ROLES.DEFAULT, deletedAt: new Date() })
    mockOwnerUser = await makeAFakeUser({ role: ROLES.OWNER })
    mockModeratorUser = await makeAFakeUser({ role: ROLES.MODERATOR })

    mockUserNoRole = await makeAFakeUser({ role: ROLES.DEFAULT })
    delete mockUserNoRole.role
  })

  beforeEach(() => {
    mockRequest = {
      user: { role: ROLES.ADMIN, id: "TestUser" } as JWTUserPayload,
      params: { id: "TestUserTarget", role: ROLES.DEFAULT },
    }
    mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn().mockImplementation(() => mockResponse),
    }
    nextFunction = jest.fn()
  })

  it("Missing Role: If user role is missing, forbid action", async () => {
    mockRequest.user = mockUserNoRole
    await RBAC.checkRoleSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User has no role" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Missing Role: If subject user role is missing, forbid action", async () => {
    mockRequest.user = mockDefaultUser
    await RBAC.checkRoleSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.NOT_FOUND)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Target user not found" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
