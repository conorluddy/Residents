import { faker } from "@faker-js/faker"
import { createHash } from "../utils/crypt"
import { ROLES, ROLES_ARRAY, STATUS, STATUS_ARRAY } from "../constants/database"
import { User } from "../db/schema"
import { createId } from "@paralleldrive/cuid2"

faker.seed(123)

interface Params {
  id?: string
  createdAt?: Date | null
  deletedAt?: Date | null
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  password?: string | null
  referredBy?: string | null
  rank?: number | null
  role?: ROLES | null
  status?: STATUS | null
  username?: string | null
}

const makeAFakeUser = ({
  id,
  createdAt,
  deletedAt,
  email,
  firstName,
  lastName,
  password,
  rank,
  role,
  referredBy,
  status,
  username = "U53rn4m3",
}: Params): User => ({
  id: id ?? createId(),
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  password: password ?? faker.internet.password(),
  rank: rank ?? faker.number.float({ multipleOf: 0.2, min: 0, max: 50 }),
  role: role === null ? null : role ?? faker.helpers.arrayElement(ROLES_ARRAY),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.userName(),
  referredBy: referredBy ?? null,
  createdAt: createdAt ?? new Date(),
})

const makeAFakeUserWithHashedPassword = async ({
  id,
  createdAt,
  deletedAt,
  email,
  firstName,
  lastName,
  password,
  rank,
  role,
  referredBy,
  status,
  username = "U53rn4m3",
}: Params): Promise<User> => ({
  id: id ?? createId(),
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  password: await createHash(password ?? username ?? ""), // default password is username
  rank: rank ?? faker.number.float({ multipleOf: 0.2, min: 0, max: 50 }),
  role: role === null ? null : role ?? faker.helpers.arrayElement(ROLES_ARRAY),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.userName(),
  referredBy: referredBy ?? null,
  createdAt: createdAt ?? new Date(),
})

export { makeAFakeUser, makeAFakeUserWithHashedPassword }
