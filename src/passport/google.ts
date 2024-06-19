import passport from "passport"
import Google from "passport-google-oauth20"
import dotenv from "dotenv"
import { logger } from "../utils/logger"
import db from "../db"
import {
  NewUser,
  tableFederatedCredentials,
  tableUsers,
} from "../db/schema/Users"
import { and, eq } from "drizzle-orm"

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
          const user = await db
            .select()
            .from(tableUsers)
            .where(eq(tableUsers.id, fedCreds[0].user_id))

          if (!user[0]) throw new Error("User not found")

          return done(null, user)
        } else {
          try {
            const user: NewUser = {
              firstName: profile.name?.familyName,
              lastName: profile.name?.givenName,
              email: profile.emails?.[0].value ?? "",
              username: profile.displayName,
            }

            const newUser = await db
              .insert(tableUsers)
              .values(user)
              .onConflictDoNothing({ target: tableUsers.id })
              .returning()

            if (!newUser) throw new Error("Failed to create user")

            const { id } = newUser[0]

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

            return done(null, newUser)
          } catch (error) {
            logger.error("Failed to create user")
          }
        }
      }
    )
  )
}

export default passport
