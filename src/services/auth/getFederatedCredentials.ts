import { and, eq } from 'drizzle-orm'
import { Profile } from 'passport'
import MESSAGES from '../../constants/messages'
import db from '../../db'
import { tableFederatedCredentials } from '../../db/schema'
import { LoginError } from '../../errors'

interface Props {
  provider: Profile['provider']
  profileId: string
}

/**
 *
 */
const getFederatedCredentials = async ({ provider, profileId }: Props): Promise<string | null> => {
  if (!provider) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_PROVIDER)
  }
  if (!profileId) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_PROFILE_ID)
  }

  const [federatedCredentials] = await db
    .select({ userId: tableFederatedCredentials.userId })
    .from(tableFederatedCredentials)
    .where(and(eq(tableFederatedCredentials.provider, provider), eq(tableFederatedCredentials.subject, profileId)))

  // Missing credentials isn't an error,
  // it just means we need to create a user,
  // so don't throw an error here

  return federatedCredentials?.userId ?? null
}

export { getFederatedCredentials }
