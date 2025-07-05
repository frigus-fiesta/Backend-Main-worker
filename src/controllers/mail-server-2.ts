// Mail-Server is powered by Resend 
// Can handle 100 emails per day and 3000 emails per month 

import { Context } from 'hono'
import { Resend } from 'resend'

// Replace with your Resend API Key (store in env for production)
// const RESEND_API_KEY = 're_hq79DdKz_JDTajoqXJZkV5MugV15BsavC'
const RESEND_API_KEY = 're_YtNCLuRf_9ZwAuMKoLYMHfwDmmiwH5WZe'

// Initialize Resend client
const resend = new Resend(RESEND_API_KEY)

export const mail_server_2 = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { mail_name, subject, html, recipients } = body

    if (!mail_name || !subject || !html || !recipients || !Array.isArray(recipients)) {
      return c.json(
        {
          success: false,
          error: 'Missing required fields: mail_name, subject, html, recipients[]'
        },
        { status: 400 }
      )
    }

    // Construct sender with verified domain
    const FROM = `${mail_name} <hello@electroplix.com>`

    // Use Resend SDK to send email
    const data = await resend.emails.send({
      from: FROM,
      to: recipients, // Resend accepts array of email strings directly
      subject,
      html
    })

    return c.json({ success: true, result: data }, { status: 200 })
  } catch (error: any) {
    console.error('Mail server error:', error)
    return c.json({ success: false, error: error.toString() }, { status: 500 })
  }
}