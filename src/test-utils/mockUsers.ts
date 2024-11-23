import { faker } from '@faker-js/faker'
import { createHash } from '../utils/crypt'
import { ROLES, ROLES_ARRAY, STATUS, STATUS_ARRAY } from '../constants/database'
import { User } from '../db/schema'
import { createId } from '@paralleldrive/cuid2'
import { PublicUser, SafeUser } from '../db/types'

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
  role,
  status,
  username = 'U53rn4m3',
}: Params): User => ({
  id: id ?? createId(),
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  password: password ?? faker.internet.password(),
  role: role === null ? null : (role ?? faker.helpers.arrayElement(ROLES_ARRAY)),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.username(),
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
  role,
  status,
  username = 'U53rn4m3',
}: Params): Promise<User> => ({
  id: id ?? createId(),
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  password: await createHash(password ?? username ?? ''), // default password is username
  role: role === null ? null : (role ?? faker.helpers.arrayElement(ROLES_ARRAY)),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.username(),
  createdAt: createdAt ?? new Date(),
})

const makeAFakeSafeUser = ({
  id,
  createdAt,
  deletedAt,
  email,
  firstName,
  lastName,
  role,
  status,
  username = 'U53rn4m3',
}: Params): SafeUser => ({
  id: id ?? createId(),
  deletedAt: deletedAt ?? null,
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  role: role === null ? null : (role ?? faker.helpers.arrayElement(ROLES_ARRAY)),
  status: status ?? faker.helpers.arrayElement(STATUS_ARRAY),
  username: username ?? faker.internet.username(),
  createdAt: createdAt ?? new Date(),
})

const makeAFakePublicUser = ({ id, email, firstName, lastName, role, username = 'U53rn4m3' }: Params): PublicUser => ({
  id: id ?? createId(),
  username: username ?? faker.internet.username(),
  email: email ?? faker.internet.email(),
  firstName: firstName ?? faker.person.firstName(),
  lastName: lastName ?? faker.person.lastName(),
  role: role === null ? null : (role ?? faker.helpers.arrayElement(ROLES_ARRAY)),
})
export { makeAFakeUser, makeAFakeUserWithHashedPassword, makeAFakeSafeUser, makeAFakePublicUser }
