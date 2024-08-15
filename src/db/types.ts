import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { tableFederatedCredentials as tfc, tableUsers, tableUserMeta } from "./schema"
import { tableTokens } from "./schema/Tokens"

export type User = InferSelectModel<typeof tableUsers>
export type NewUser = InferInsertModel<typeof tableUsers>
// Internal use without password
export type SafeUser = Omit<User, "password">
// External use with only public information
export type PublicUser = Pick<User, "firstName" | "lastName" | "email" | "username" | "role" | "id">

export type Meta = InferSelectModel<typeof tableUserMeta>
export type NewMeta = InferInsertModel<typeof tableUserMeta>

export type FederatedCredentials = InferSelectModel<typeof tfc>
export type NewFederatedCredentials = InferInsertModel<typeof tfc>

export type Token = InferSelectModel<typeof tableTokens>
export type NewToken = InferInsertModel<typeof tableTokens>
export type TokenWithUser = Token & { user: User }
export type TokenWithSafeUser = Token & { user: SafeUser }
