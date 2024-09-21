import dotenv from 'dotenv'
import { and, eq } from 'drizzle-orm'
import passport from 'passport'
import Google from 'passport-google-oauth20'
import db from '../db'
import { tableFederatedCredentials } from '../db/schema'
import { NewUser } from '../db/types'
import SERVICES from '../services'
import { logger } from '../utils/logger'
import MESSAGES from '../constants/messages'
import { LoginError } from '../errors'

dotenv.config()

const GoogleStrategy = Google.Strategy
const PROVIDER = 'google'

// Move these to config file
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  logger.error(MESSAGES.MISSING_GOOGLE_OAUTH_ENV_VARS)
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['email', 'profile'],
        state: false,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const fedCreds = await db
          .select({ userId: tableFederatedCredentials.userId })
          .from(tableFederatedCredentials)
          .where(
            and(eq(tableFederatedCredentials.provider, PROVIDER), eq(tableFederatedCredentials.subject, profile.id))
          )

        if (fedCreds[0].userId) {
          const user = await SERVICES.getUserById(fedCreds[0].userId)
          if (!user) {
            throw new LoginError(`${MESSAGES.USER_NOT_FOUND_FEDERATED_CREDENTIALS}: ${fedCreds[0].userId}`)
          }
          return done(null, user)
        } else {
          try {
            const user: NewUser = {
              firstName: profile.name?.familyName,
              lastName: profile.name?.givenName,
              email: profile.emails?.[0].value ?? '',
              username: profile.displayName,
            }

            const newUserId = await SERVICES.createUser(user)
            if (!newUserId) {
              throw new Error(MESSAGES.FAILED_CREATING_USER)
            }

            const fedCreds = {
              userId: newUserId,
              provider: PROVIDER,
              subject: profile.id,
            }

            const newFedCred = await db
              .insert(tableFederatedCredentials)
              .values(fedCreds)
              .onConflictDoNothing({
                target: tableFederatedCredentials.userId,
              })
              .returning()

            if (!newFedCred) {
              throw new Error(MESSAGES.FAILED_CREATING_FEDERATED_CREDENTIALS)
            }

            return done(null, { id: newUserId })
          } catch (error) {
            logger.error(MESSAGES.FAILED_CREATING_USER, error)
          }
        }
      }
    )
  )
}

export { passport as googlePassport }
