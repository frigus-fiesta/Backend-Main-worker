// Th
// is Mail-Server is powered by Mailtrap 
// Can handle 200 emails per day and 1000 emails per month 

import { Context } from 'hono';

// Mailtrap API Token (store securely in environment variable in production)
const MAILTRAP_TOKEN = '207bdd1929062b5d1f58440bd89477ea';

// Optional: Template UUID from Mailtrap (for future use)
const TEMPLATE_UUID = '3a72f511-468f-4bab-9f82-dcdceecbe4f7';


// Main mail function
export const mail_server_1 = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { mail_name,subject, html, recipients } = body

    if (!mail_name || !subject || !html || !recipients || !Array.isArray(recipients)) {
      return c.json(
        {
          success: false,
          error: 'Missing required fields: subject, html, recipients[]'
        },
        { status: 400 }
      )
    }

    const SENDER = {
    email: 'hello@electroplix.com',
    name: mail_name
    }
    const response = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILTRAP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: SENDER,
        to: recipients.map((email: string) => ({ email })),
        subject,
        html
      })
    })

    const result = await response.json()

    if (!response.ok) {
      return c.json({ success: false, error: result })
    }

    return c.json({ success: true, result }, { status: 200 })
  } catch (err: any) {
    return c.json({ success: false, error: err.toString() }, { status: 500 })
  }
}
