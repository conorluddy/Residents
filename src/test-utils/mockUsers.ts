import { faker } from "@faker-js/faker"
import { createHash } from "../utils/crypt"
import { ROLES_ARRAY, STATUS_ARRAY } from "../constants/database"
import { User } from "../db/schema"

faker.seed(123)

const makeAFakeUser = ({
  deletedAt,
  email,
  firstName,
  lastName,
  password,
  rank,
  role,
  status,
  username = "U53rn4m3",
}: Partial<User>) => ({
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  password: password ?? faker.internet.password(),
  rank: rank ?? faker.number.float({ multipleOf: 0.2, min: 0, max: 50 }),
  role: role === null ? null : role ?? faker.helpers.arrayElement(ROLES_ARRAY),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.userName(),
})

const makeAFakeUserWithHashedPassword = async ({
  deletedAt,
  email,
  firstName,
  lastName,
  password,
  rank,
  role,
  status,
  username = "U53rn4m3",
}: Partial<User>) => ({
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  password: await createHash(password ?? username), // default password is username
  rank: rank ?? faker.number.float({ multipleOf: 0.2, min: 0, max: 50 }),
  role: role ?? faker.helpers.arrayElement(ROLES_ARRAY),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.userName(),
})

export { makeAFakeUser, makeAFakeUserWithHashedPassword }
