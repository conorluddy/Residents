import { NextFunction, Request, Response } from "express"
import { ROLES } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { User } from "../../db/types"
import { makeAFakeSafeUser, makeAFakeUser } from "../../test-utils/mockUsers"
import RBAC from "./roleBasedAccessControl"
import { logger } from "../../utils/logger"

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  // Move this to own mocks file
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest
        .fn()
        .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.DEFAULT })])
        .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.DEFAULT })])
        .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.ADMIN })])
        .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.ADMIN })])
        .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.LOCKED })])
        .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.LOCKED })])
        .mockResolvedValueOnce([{}]),
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

  beforeAll(() => {
    mockAdminUser = makeAFakeSafeUser({ role: ROLES.ADMIN })
    mockDefaultUser = makeAFakeSafeUser({ role: ROLES.DEFAULT })
    mockLockedUser = makeAFakeSafeUser({ role: ROLES.LOCKED })
    mockDeletedAdminUser = makeAFakeSafeUser({ role: ROLES.ADMIN, deletedAt: new Date() })
    mockDeletedDefaultUser = makeAFakeSafeUser({ role: ROLES.DEFAULT, deletedAt: new Date() })
  })

  beforeEach(() => {
    mockRequest = {
      user: mockAdminUser,
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("should return early if there's no User data provided", () => {
    mockRequest.user = undefined
    RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
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
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("Users with LOCKED role", () => {
    it("can GET OWN/SELF user", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("Users with LOCKED role", () => {
    it("can GET OWN/SELF user", () => {
      mockRequest.user = mockLockedUser
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("DELETED Users", () => {
    it("can't GET OWN/SELF user", () => {
      mockRequest.user = mockDeletedDefaultUser
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("DELETED ADMIN Users", () => {
    it("can't GET OWN/SELF user", () => {
      mockRequest.user = mockDeletedAdminUser
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
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
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" })
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })
})

describe("Middleware:RBAC:getTargetUserAndCheckSuperiority", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockAdminUser: Partial<User>
  let mockDefaultUser: Partial<User>
  let mockLockedUser: Partial<User>
  let mockDeletedAdminUser: Partial<User>
  let mockUserNoRole: Partial<User>
  // let mockDeletedDefaultUser: Partial<User>
  // let mockOwnerUser: Partial<User>
  // let mockModeratorUser: Partial<User>

  beforeAll(() => {
    mockAdminUser = makeAFakeUser({ role: ROLES.ADMIN })
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT })
    mockLockedUser = makeAFakeUser({ role: ROLES.LOCKED })
    mockDeletedAdminUser = makeAFakeUser({ role: ROLES.ADMIN, deletedAt: new Date() })
    // mockDeletedDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT, deletedAt: new Date() })
    // mockOwnerUser = makeAFakeUser({ role: ROLES.OWNER })
    // mockModeratorUser = makeAFakeUser({ role: ROLES.MODERATOR })

    mockUserNoRole = makeAFakeUser({ role: ROLES.DEFAULT })
    delete mockUserNoRole.role
  })

  beforeEach(() => {
    mockRequest = {
      user: { role: ROLES.ADMIN, id: "TestUser" },
      params: { id: "TestUserTarget", role: ROLES.DEFAULT },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("Happy path: User has more seniority than target, next() is called", async () => {
    mockRequest.user = mockAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("should return early if the Role isnt legit", async () => {
    mockRequest.user = { ...mockAdminUser, role: "FAKE_ROLE" }
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Roles not found." })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("should return early if there's no User data provided", async () => {
    mockRequest.user = undefined
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Missing User data." })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("User has same role as target, forbid action", async () => {
    mockRequest.user = mockAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Role superiority is required for this operation" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("User has lower role than target, forbid action", async () => {
    mockRequest.user = mockDefaultUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Role superiority is required for this operation" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("User role is LOCKED, forbid action", async () => {
    mockRequest.user = mockLockedUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User account is locked" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Target User role is LOCKED, can not be mutated by less than Admin", async () => {
    mockRequest.user = mockDefaultUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Target user account is locked" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Target User role is LOCKED, can still be mutated by Admin+", async () => {
    mockRequest.user = mockAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("Admin account in deleted state should be forbidden from acting", async () => {
    mockRequest.user = mockDeletedAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User account is deleted" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("If user role is missing, forbid action", async () => {
    mockRequest.user = mockUserNoRole
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User has no role" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
