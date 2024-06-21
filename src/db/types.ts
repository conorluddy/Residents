import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { tableFederatedCredentials as tfc, tableUsers } from "./schema"

export type User = InferSelectModel<typeof tableUsers>
export type NewUser = InferInsertModel<typeof tableUsers>
export type FederatedCredentials = InferSelectModel<typeof tfc>
export type NewFederatedCredentials = InferInsertModel<typeof tfc>
