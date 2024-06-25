import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { NewUser, tableUsers } from "../../db/schema"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"
import db from "../../db"
import dotenv from "dotenv"
dotenv.config()

/**
 * createUser
 */
export const createUser = async ({ body }: Request, res: Response) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password: plainPassword,
    } = body
    const password = await createHash(plainPassword)
    const user: NewUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    }
    await db.insert(tableUsers).values(user).returning()

    sendMail(`Hi ${firstName}`) // Temporary testing SG

    res.status(HTTP_SUCCESS.CREATED).send("User registered")
  } catch (error) {
    logger.error(error)
    res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .send("Error registering user")
  }
}

// Temporary testing SG
const sendMail = (test: string) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require("@sendgrid/mail")
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: "",
    from: process.env.SENDGRID_VERIFIED_EMAIL,
    subject: test,
    text: test,
    html: "<strong>test</strong>",
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent")
    })
    .catch((error: any) => {
      console.error(JSON.stringify(error, null, 2))
    })
}
