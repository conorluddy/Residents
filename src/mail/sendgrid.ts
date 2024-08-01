import dotenv from "dotenv"
import sgMail, { ClientResponse } from "@sendgrid/mail"
import { logger } from "../utils/logger"
dotenv.config()

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
if (process.env.NODE_ENV === "production") {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "API key needed in your .env file")
}

interface MailProps {
  to: string
  subject: string
  body: string
}

export const sendMail = async ({ to, subject, body }: MailProps): Promise<[ClientResponse, {}] | undefined> => {
  if (!process.env.SENDGRID_API_KEY) throw new Error("Set the SENDGRID_API_KEY in your .env file")
  if (!process.env.SENDGRID_VERIFIED_EMAIL) throw new Error("Set SENDGRID_VERIFIED_EMAIL in your .env file")

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_EMAIL,
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
    } else {
      logger.error("An unknown error occurred", error)
    }
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
