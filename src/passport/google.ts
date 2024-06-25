import passport from "passport"
import Google from "passport-google-oauth20"
import dotenv from "dotenv"
import { logger } from "../utils/logger"
import db from "../db"
import { tableFederatedCredentials, tableUsers } from "../db/schema/Users"
import { and, eq } from "drizzle-orm"
import { JWTUserPayload } from "../utils/jwt"
import { NewUser } from "../db/types"

dotenv.config()
const GoogleStrategy = Google.Strategy
const PROVIDER = "google"

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  logger.error("Missing Google OAuth environment variables")
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
        state: false,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const fedCreds = await db
          .select({ user_id: tableFederatedCredentials.user_id })
          .from(tableFederatedCredentials)
          .where(
            and(
              eq(tableFederatedCredentials.provider, PROVIDER),
              eq(tableFederatedCredentials.subject, profile.id)
            )
          )

        const exists = fedCreds.length > 0

        if (exists) {
          const users: JWTUserPayload[] = await db
            .select({
              firstName: tableUsers.firstName,
              lastName: tableUsers.lastName,
              email: tableUsers.email,
              username: tableUsers.username,
              role: tableUsers.role,
            })
            .from(tableUsers)
            .where(eq(tableUsers.id, fedCreds[0].user_id))

          if (!users[0]) throw new Error("User not found")

          return done(null, users[0])
        } else {
          try {
            const user: NewUser = {
              firstName: profile.name?.familyName,
              lastName: profile.name?.givenName,
              email: profile.emails?.[0].value ?? "",
              username: profile.displayName,
            }

            const newUsers = await db
              .insert(tableUsers)
              .values(user)
              .onConflictDoNothing({ target: tableUsers.id })
              .returning()

            if (!newUsers) throw new Error("Failed to create user")

            const { id } = newUsers[0]

            const fedCreds = {
              user_id: id,
              provider: PROVIDER,
              subject: profile.id,
            }

            const newFedCred = await db
              .insert(tableFederatedCredentials)
              .values(fedCreds)
              .onConflictDoNothing({
                target: tableFederatedCredentials.user_id,
              })
              .returning()

            if (!newFedCred)
              throw new Error("Failed to create new federated credentials")

            return done(null, {
              firstName: newUsers[0].firstName,
              lastName: newUsers[0].lastName,
              email: newUsers[0].email,
              username: newUsers[0].username,
              role: newUsers[0].role,
            })
          } catch (error) {
            logger.error("Failed to create user")
          }
        }
      }
    )
  )
}

export { passport as googlePassport }
