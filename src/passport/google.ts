import dotenv from 'dotenv'
import passport, { Profile } from 'passport'
import Google from 'passport-google-oauth20'
import { NewUser } from '../db/types'
import SERVICES from '../services'
import { logger } from '../utils/logger'
import MESSAGES from '../constants/messages'
import { LoginError } from '../errors'
import { isEmail } from 'validator'
import { ROLES } from '../constants/database'
import { generatePassword } from '../utils/crypt'
import { generateUniqueUsername } from '../utils/user'

dotenv.config()

const GoogleStrategy = Google.Strategy
const PROVIDER: Profile['provider'] = 'google'
const SCOPE = ['profile', 'email']

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
        scope: SCOPE,
        state: false,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const federatedUserIdIfExists = await SERVICES.getFederatedCredentials({
          provider: PROVIDER,
          profileId: profile.id,
        })

        if (federatedUserIdIfExists) {
          const user = await SERVICES.getUserById(federatedUserIdIfExists)

          if (!user) {
            throw new LoginError(`${MESSAGES.USER_NOT_FOUND_FEDERATED_CREDENTIALS}: ${federatedUserIdIfExists}`)
          }

          // Existing User found - return User
          return done(null, user)
        } else {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase()

            if (!email) {
              throw new Error(MESSAGES.NO_EMAIL_IN_GOOGLE_PAYLOAD)
            }
            if (!isEmail(email)) {
              throw new Error(MESSAGES.INVALID_EMAIL_IN_GOOGLE_PAYLOAD)
            }

            const user: NewUser = {
              email,
              role: ROLES.DEFAULT,
              firstName: profile.name?.familyName ?? email.split('@')[0],
              lastName: profile.name?.givenName,
              username: await generateUniqueUsername(profile.displayName),
              password: generatePassword(16),
            }

            const newUserId = await SERVICES.createUser(user)

            if (!newUserId) {
              throw new Error(MESSAGES.FAILED_CREATING_USER)
            }

            const newFeds = await SERVICES.createFederatedCredentials({
              userId: newUserId,
              provider: PROVIDER,
              profileId: profile.id,
            })

            if (!newFeds) {
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
