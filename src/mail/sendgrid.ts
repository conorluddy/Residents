import sgMail, { ClientResponse } from '@sendgrid/mail'
import { logger } from '../utils/logger'
import { SENDGRID_API_KEY, SENDGRID_VERIFIED_EMAIL } from '../config'
import { EmailError } from '../errors'
import MESSAGES from '../constants/messages'
import TYPEGUARD from '../types/typeguards'

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
if (process.env.NODE_ENV !== 'test' && SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

interface MailProps {
  to: string
  subject: string
  body: string
}

export const sendMail = async ({ to, subject, body }: MailProps): Promise<[ClientResponse, object] | undefined> => {
  try {
    if (!SENDGRID_VERIFIED_EMAIL) {
      throw new EmailError(MESSAGES.MISSING_REQUIRED_ENV_VARS)
    }

    const msg = {
      to,
      from: SENDGRID_VERIFIED_EMAIL,
      subject,
      text: body,
      // html: "<strong>Test</strong>",
    }

    return await sgMail.send(msg)
  } catch (error: unknown) {
    if (TYPEGUARD.isSendGridError(error)) {
      logger.error('Error Message:', error.message)
      logger.error('Error Code:', error.code)
      error.response.body.errors.forEach((err) => {
        logger.error('Field:', err.field)
        logger.error('Help:', err.help)
      })
    }
    throw new EmailError(MESSAGES.EMAIL_ERROR)
  }
}
