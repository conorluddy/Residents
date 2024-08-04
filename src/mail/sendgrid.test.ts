import sgMail from "@sendgrid/mail"
import { sendMail } from "./sendgrid"
import { SENDGRID_API_KEY, SENDGRID_VERIFIED_EMAIL } from "../config"

jest.mock("dotenv")
jest.mock("@sendgrid/mail")
jest.mock("../utils/logger")

describe("sendMail", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should send an email successfully", async () => {
    const result = await sendMail({
      to: "recipient@example.com",
      subject: "Test Subject",
      body: "Test Body",
    })

    // expect(result).toEqual(mockResponse)
    expect(sgMail.send).toHaveBeenCalledWith({
      to: "recipient@example.com",
      from: "verified@example.com",
      subject: "Test Subject",
      text: "Test Body",
    })
  })
})
