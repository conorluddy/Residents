import { faker } from "@faker-js/faker"
import { createHash } from "../utils/crypt"
import { ROLES_ARRAY, STATUS_ARRAY } from "../constants/database"
import { User } from "../db/schema"

const makeAFakeUser = async ({
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
  password: password ?? (await createHash(username)),
  rank: rank ?? faker.number.float({ multipleOf: 0.2, min: 0, max: 50 }),
  role: role ?? faker.helpers.arrayElement(ROLES_ARRAY),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.userName(),
})

export { makeAFakeUser }
