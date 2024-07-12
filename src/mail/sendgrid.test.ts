import sgMail from "@sendgrid/mail"
import { sendMail } from "./sendgrid"

jest.mock("dotenv")
jest.mock("@sendgrid/mail")
jest.mock("../utils/logger")

describe("sendMail", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should send an email successfully", async () => {
    process.env.SENDGRID_API_KEY = "test_api_key"
    process.env.SENDGRID_VERIFIED_EMAIL = "verified@example.com"

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

  it("should throw an error if SENDGRID_API_KEY is not set", async () => {
    delete process.env.SENDGRID_API_KEY
    process.env.SENDGRID_VERIFIED_EMAIL = "verified@example.com"

    await expect(
      sendMail({
        to: "recipient@example.com",
        subject: "Test Subject",
        body: "Test Body",
      })
    ).rejects.toThrow("Set the SENDGRID_API_KEY in your .env file")

    expect(sgMail.send).not.toHaveBeenCalled()
  })

  it("should throw an error if SENDGRID_VERIFIED_EMAIL is not set", async () => {
    process.env.SENDGRID_API_KEY = "test_api_key"
    delete process.env.SENDGRID_VERIFIED_EMAIL

    await expect(
      sendMail({
        to: "recipient@example.com",
        subject: "Test Subject",
        body: "Test Body",
      })
    ).rejects.toThrow("Set SENDGRID_VERIFIED_EMAIL in your .env file")

    expect(sgMail.send).not.toHaveBeenCalled()
  })
})
