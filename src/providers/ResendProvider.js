import { Resend } from 'resend'
import { env } from '~/config/environment'

const RESEND_API_KEY = env.RESEND_API_KEY
const ADMIN_SENDER_EMAIL = env.ADMIN_SENDER_EMAIL
const resend = new Resend(RESEND_API_KEY)

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: ADMIN_SENDER_EMAIL,
      to,
      subject,
      html

    })
    return data
  } catch (error) {
    console.log('ResendProvider.sendEmail error:', error)

    throw error
  }
}

export const ResendProvider = {
  sendEmail
}

