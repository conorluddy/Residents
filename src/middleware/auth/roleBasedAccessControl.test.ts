import { NextFunction, Request, Response } from "express"
import { ROLES, STATUS } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { PublicUser, SafeUser } from "../../db/types"
import { makeAFakeSafeUser, makeAFakeUser } from "../../test-utils/mockUsers"
import { REQUEST_USER } from "../../types/requestSymbols"
import RBAC from "./roleBasedAccessControl"
import { BadRequestError, ForbiddenError } from "../../errors"

jest.mock("../../services/index", () => ({
  getUserByID: jest
    .fn()
    .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.DEFAULT })])
    .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.DEFAULT })])
    .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.ADMIN })])
    .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.ADMIN })])
    .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.LOCKED })])
    .mockResolvedValueOnce([makeAFakeUser({ role: ROLES.LOCKED })])
    .mockResolvedValueOnce([{}]),
}))

describe("Middleware:RBAC:checkPermission", () => {
  let mockRequest: Partial<Request> & { [REQUEST_USER]: PublicUser }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockAdminUser: SafeUser
  let mockDefaultUser: SafeUser
  let mockLockedUser: SafeUser
  let mockBannedUser: SafeUser
  let mockDeletedAdminUser: SafeUser

  beforeAll(() => {
    mockAdminUser = makeAFakeSafeUser({ role: ROLES.ADMIN })
    mockDefaultUser = makeAFakeSafeUser({ role: ROLES.DEFAULT })
    mockLockedUser = makeAFakeSafeUser({ role: ROLES.LOCKED })
    mockBannedUser = makeAFakeSafeUser({ status: STATUS.BANNED })
    mockDeletedAdminUser = makeAFakeSafeUser({ role: ROLES.ADMIN, deletedAt: new Date() })
  })

  beforeEach(() => {
    mockRequest = {
      [REQUEST_USER]: makeAFakeSafeUser(mockAdminUser),
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("should return early if there's no User data provided", () => {
    mockRequest[REQUEST_USER] = null as unknown as SafeUser
    expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
      new BadRequestError("User data is missing.")
    )
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("should call next function if the user has the required permission", () => {
    mockRequest[REQUEST_USER] = mockAdminUser
    RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
  })

  it("should return 403 if the user lacks the required permission", async () => {
    mockRequest[REQUEST_USER] = mockDefaultUser
    expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
      new ForbiddenError("User cant perform this action.")
    )
    expect(nextFunction).not.toHaveBeenCalled()
  })

  describe("Users with ADMIN role", () => {
    it("can GetOwnUser", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can CreateUsers", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can GetUsers", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateUsers", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateOwnUser", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can DeleteUser", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateAnyUserStatus", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanUpdateAnyUserStatus(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UpdateOwnProfile", () => {
      mockRequest[REQUEST_USER] = mockAdminUser
      RBAC.checkCanUpdateOwnProfile(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
  })

  describe("Users with DEFAULT role", () => {
    it("can GET OWN/SELF user", () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UPDATE OWN/SELF user", () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(nextFunction).toHaveBeenCalled()
    })
    it("can UPDATE OWN/SELF profile (probably same as user update tbh)", () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      RBAC.checkCanUpdateOwnProfile(mockRequest as Request, mockResponse as Response, nextFunction)
    })
    it("can't CREATE users", async () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      expect(() => RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User cant perform this action.`)
      )
    })
    it("can't GET users", async () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User cant perform this action.`)
      )
    })

    it("can't UPDATE users", async () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      expect(() => RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User cant perform this action.`)
      )
    })
    it("can't UPDATE other users status", async () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      expect(() =>
        RBAC.checkCanUpdateAnyUserStatus(mockRequest as Request, mockResponse as Response, nextFunction)
      ).toThrow(new ForbiddenError(`User cant perform this action.`))
    })

    it("can't DELETE users", async () => {
      mockRequest[REQUEST_USER] = mockDefaultUser
      expect(() => RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User cant perform this action.`)
      )
    })
  })

  describe("Users with LOCKED role", () => {
    beforeEach(() => (mockRequest[REQUEST_USER] = mockLockedUser))
    it("can't GET OWN/SELF user", async () => {
      // TODO: Probably need to return limited data to them
      expect(() => RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is locked.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", async () => {
      expect(() => RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is locked.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users if account is banned", async () => {
      expect(() => RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is locked.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", async () => {
      expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is locked.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't UPDATE users", async () => {
      expect(() => RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is locked.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't DELETE users", async () => {
      expect(() => RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is locked.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("Users with BANNED status", () => {
    beforeEach(() => (mockRequest[REQUEST_USER] = mockBannedUser))
    it("can't GET OWN/SELF user", async () => {
      // TODO: Probably need to return limited data to them
      expect(() => RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is banned.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      expect(() => RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is banned.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      expect(() => RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is banned.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is banned.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't UPDATE users", () => {
      expect(() => RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is banned.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it("can't DELETE users", () => {
      expect(() => RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User account is banned.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("DELETED Users", () => {
    beforeEach(() => (mockRequest[REQUEST_USER] = mockDeletedAdminUser))
    it("can't GET OWN/SELF user", () => {
      expect(() => RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      expect(() => RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      expect(() => RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE users", () => {
      expect(() => RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't DELETE users", () => {
      expect(() => RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe("DELETED ADMIN Users", () => {
    beforeEach(() => (mockRequest[REQUEST_USER] = mockDeletedAdminUser))
    it("can't GET OWN/SELF user", () => {
      expect(() => RBAC.checkCanGetOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE OWN/SELF user", () => {
      expect(() => RBAC.checkCanUpdateOwnUser(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't CREATE users", () => {
      expect(() => RBAC.checkCanCreateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't GET users", () => {
      expect(() => RBAC.checkCanGetUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't UPDATE users", () => {
      expect(() => RBAC.checkCanUpdateUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
    it("can't DELETE users", () => {
      expect(() => RBAC.checkCanDeleteUsers(mockRequest as Request, mockResponse as Response, nextFunction)).toThrow(
        new ForbiddenError(`User was deleted.`)
      )
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })
})

describe("Middleware:RBAC:getTargetUserAndCheckSuperiority", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let mockAdminUser: SafeUser
  let mockDefaultUser: SafeUser
  let mockLockedUser: SafeUser
  let mockDeletedAdminUser: SafeUser
  let mockUserNoRole: SafeUser

  beforeAll(() => {
    mockAdminUser = makeAFakeUser({ role: ROLES.ADMIN, status: STATUS.VERIFIED })
    mockDefaultUser = makeAFakeUser({ role: ROLES.DEFAULT, status: STATUS.VERIFIED })
    mockLockedUser = makeAFakeUser({ role: ROLES.LOCKED })
    mockDeletedAdminUser = makeAFakeUser({ role: ROLES.ADMIN, deletedAt: new Date() })
    mockUserNoRole = makeAFakeUser({ role: ROLES.DEFAULT })
    mockUserNoRole.role = undefined as unknown as ROLES
  })

  beforeEach(() => {
    mockRequest = {
      user: { role: ROLES.ADMIN, id: "TestUser" },
      params: { id: "TestUserTargetID", role: ROLES.DEFAULT },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it("Happy path: User has more seniority than target, next() is called", async () => {
    mockRequest[REQUEST_USER] = mockAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("should return early if the Role isnt legit", async () => {
    mockRequest[REQUEST_USER] = { ...mockAdminUser, role: "FAKE_ROLE" as ROLES }
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Roles not found." })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("should return early if there's no User data provided", async () => {
    mockRequest[REQUEST_USER] = undefined
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Missing User data." })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("User has same role as target, forbid action", async () => {
    mockRequest[REQUEST_USER] = mockAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Role superiority is required for this operation" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("User has lower role than target, forbid action", async () => {
    mockRequest[REQUEST_USER] = mockDefaultUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Role superiority is required for this operation" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("User role is LOCKED, forbid action", async () => {
    mockRequest[REQUEST_USER] = mockLockedUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User account is locked" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Target User role is LOCKED, can not be mutated by less than Admin", async () => {
    mockRequest[REQUEST_USER] = mockDefaultUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Target user account is locked" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("Target User role is LOCKED, can still be mutated by Admin+", async () => {
    mockRequest[REQUEST_USER] = mockAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(nextFunction).toHaveBeenCalled()
  })

  it("Admin account in deleted state should be forbidden from acting", async () => {
    mockRequest[REQUEST_USER] = mockDeletedAdminUser
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User account is deleted" })
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it("If user role is missing, forbid action", async () => {
    mockRequest[REQUEST_USER] = mockUserNoRole
    await RBAC.getTargetUserAndCheckSuperiority(mockRequest as Request, mockResponse as Response, nextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_CLIENT_ERROR.UNAUTHORIZED)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User has no role" })
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
