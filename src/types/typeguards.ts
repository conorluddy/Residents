import { SafeUser } from "../db/types"

function isSafeUser(user: any): user is SafeUser {
  return (
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string" &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string" &&
    (typeof user.firstName === "string" || user.firstName === undefined) &&
    (typeof user.lastName === "string" || user.lastName === undefined) &&
    (typeof user.status === "string" || user.status === undefined) &&
    (user.createdAt instanceof Date || typeof user.createdAt === "string") &&
    (user.deletedAt instanceof Date || user.deletedAt === undefined || typeof user.deletedAt === "string")
  )
}

const TYPEGUARD = { isSafeUser }

export default TYPEGUARD
