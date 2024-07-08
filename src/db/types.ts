import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { tableFederatedCredentials as tfc, tableUsers } from "./schema"
import { tableTokens } from "./schema/Tokens"

export type User = InferSelectModel<typeof tableUsers>
export type NewUser = InferInsertModel<typeof tableUsers>

export type FederatedCredentials = InferSelectModel<typeof tfc>
export type NewFederatedCredentials = InferInsertModel<typeof tfc>

export type Token = InferSelectModel<typeof tableTokens>
export type NewToken = InferInsertModel<typeof tableTokens>
export type TokenWithUser = Token & { user: User }
