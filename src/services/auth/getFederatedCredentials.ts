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

const getFederatedCredentials = async ({ provider, profileId }: Props): Promise<string> => {
  if (!provider) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_PROVIDER)
  }
  if (!profileId) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_PROFILE_ID)
  }

  const [federateddCredentials] = await db
    .select({ userId: tableFederatedCredentials.userId })
    .from(tableFederatedCredentials)
    .where(and(eq(tableFederatedCredentials.provider, provider), eq(tableFederatedCredentials.subject, profileId)))

  return federateddCredentials.userId
}

export { getFederatedCredentials }
