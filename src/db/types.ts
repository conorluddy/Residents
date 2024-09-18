import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { tableFederatedCredentials as tfc, tableUsers, tableUserMeta } from './schema'
import { tableTokens } from './schema/Tokens'
import { ROLES } from '../constants/database'

// Users

export type User = InferSelectModel<typeof tableUsers>
export type NewUser = InferInsertModel<typeof tableUsers>
export type SafeUser = Omit<User, 'password'> // Internal use without password
export type PublicUser = Pick<User, 'firstName' | 'lastName' | 'email' | 'username' | 'role' | 'id'> // External use with only public information
export type UserUpdate = Pick<User, 'firstName' | 'lastName' | 'email' | 'username' | 'password'>

// Types by role
export type DefaultUser = SafeUser & { role: ROLES.DEFAULT }
export type ModeratorUser = SafeUser & { role: ROLES.MODERATOR }
export type AdminUser = SafeUser & { role: ROLES.ADMIN }
export type OwnerUser = SafeUser & { role: ROLES.OWNER }
export type LockedUser = SafeUser & { status: ROLES.LOCKED }
export type DeletedUser = SafeUser & { deletedAt: Date }
export type UserWithMeta = SafeUser & { meta: Meta }

// Meta

export type Meta = InferSelectModel<typeof tableUserMeta>
export type NewMeta = InferInsertModel<typeof tableUserMeta>

// Federated Credentials
export type FederatedCredentials = InferSelectModel<typeof tfc>
export type NewFederatedCredentials = InferInsertModel<typeof tfc>

// Tokens

export type Token = InferSelectModel<typeof tableTokens>
export type NewToken = InferInsertModel<typeof tableTokens>
export type TokenWithUser = Token & { user: User }
