import sgMail, { ClientResponse } from "@sendgrid/mail"
import { logger } from "../utils/logger"
import { SENDGRID_API_KEY, SENDGRID_VERIFIED_EMAIL } from "../config"
import { EmailError } from "../errors"

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
if (process.env.NODE_ENV !== "test") {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

interface MailProps {
  to: string
  subject: string
  body: string
}

export const sendMail = async ({ to, subject, body }: MailProps): Promise<[ClientResponse, {}] | undefined> => {
  try {
    const msg = {
      to,
      from: SENDGRID_VERIFIED_EMAIL,
      subject,
      text: body,
      // html: "<strong>Test</strong>",
    }

    return sgMail.send(msg)
  } catch (error: unknown) {
    if (isSendGridError(error)) {
      logger.error("Error Message:", error.message)
      logger.error("Error Code:", error.code)
      error.response.body.errors.forEach((err) => {
        logger.error("Field:", err.field)
        logger.error("Help:", err.help)
      })
    }
    throw new EmailError("An error occurred while sending email.")
  }
}

const isSendGridError = (error: any): error is SendGridError =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  "code" in error &&
  "response" in error &&
  "body" in error.response &&
  Array.isArray(error.response.body.errors)

interface SendGridError {
  message: string
  code: number
  response: {
    headers: {
      server: string
      date: string
      "content-type": string
      "content-length": string
      connection: string
      "access-control-allow-origin": string
      "access-control-allow-methods": string
      "access-control-allow-headers": string
      "access-control-max-age": string
      "x-no-cors-reason": string
      "strict-transport-security": string
    }
    body: {
      errors: Array<{
        message: string
        field: string
        help: string
      }>
    }
  }
}
