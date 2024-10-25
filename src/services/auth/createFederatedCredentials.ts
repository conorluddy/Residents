import { Profile } from 'passport'
import MESSAGES from '../../constants/messages'
import db from '../../db'
import { tableFederatedCredentials } from '../../db/schema'
import { LoginError } from '../../errors'

interface CreateFederatedCredentialsProps {
  userId: string
  provider: Profile['provider']
  profileId: string
}

/**
 *
 */
const createFederatedCredentials = async ({
  userId,
  provider,
  profileId,
}: CreateFederatedCredentialsProps): Promise<string> => {
  if (!userId) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_USER_ID)
  }
  if (!provider) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_PROVIDER)
  }
  if (!profileId) {
    throw new LoginError(MESSAGES.MISSING_PASSPORT_PROFILE_ID)
  }

  const [federateddCredentials] = await db
    .insert(tableFederatedCredentials)
    .values({
      userId,
      provider,
      subject: profileId,
    })
    .onConflictDoNothing({
      target: tableFederatedCredentials.userId,
    })
    .returning()

  if (!federateddCredentials) {
    throw new LoginError(MESSAGES.FEDERATED_CREDENTIALS_NOT_CREATED)
  }

  return federateddCredentials.userId
}

export { createFederatedCredentials, CreateFederatedCredentialsProps }
