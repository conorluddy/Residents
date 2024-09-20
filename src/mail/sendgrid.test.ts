import sgMail from '@sendgrid/mail'
import { sendMail } from './sendgrid'

jest.mock('dotenv')
jest.mock('@sendgrid/mail')
jest.mock('../utils/logger')

describe('sendMail', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should send an email successfully', async () => {
    await sendMail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    })
    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      from: 'verified@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    })
  })
})
