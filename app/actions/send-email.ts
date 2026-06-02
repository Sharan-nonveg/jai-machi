'use server'

import { Resend } from 'resend'

interface ContactFormData {
  name: string
  email: string
  message: string
}

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validate input
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        error: 'Please fill in all fields',
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      }
    }

    // Validate message length
    if (data.message.length < 10) {
      return {
        success: false,
        error: 'Message must be at least 10 characters long',
      }
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('[v0] ERROR: RESEND_API_KEY environment variable is not set')
      return {
        success: false,
        error: 'Email service is not configured. Please contact directly at vjai5894@gmail.com',
      }
    }

    console.log('[v0] Sending email via Resend to vjai5894@gmail.com from', data.email)

    // Send email to Jai Vignesh
    const mainEmailResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default sender
      to: 'vjai5894@gmail.com',
      replyTo: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #22c55e;">New Contact Form Submission</h2>
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #22c55e;">
              ${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #999; font-size: 12px;">This email was sent via the Cricket Portfolio contact form.</p>
        </div>
      `,
    })

    if (mainEmailResult.error) {
      console.error('[v0] Failed to send main email:', mainEmailResult.error)
      return {
        success: false,
        error: `Email service error: ${mainEmailResult.error.message || 'Failed to send email'}`,
      }
    }

    console.log('[v0] Main email sent successfully. ID:', mainEmailResult.data?.id)

    // Send confirmation email to user
    const confirmEmailResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: data.email,
      subject: 'We received your message - Cricket Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #22c55e;">Thank You!</h2>
          <p>Hi ${data.name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>Jai Vignesh</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #999; font-size: 12px;">This is an automated response from Cricket Portfolio.</p>
        </div>
      `,
    })

    if (confirmEmailResult.error) {
      console.warn('[v0] Warning: Confirmation email failed, but main email was sent:', confirmEmailResult.error)
      // Still return success since the main email was sent
    } else {
      console.log('[v0] Confirmation email sent successfully. ID:', confirmEmailResult.data?.id)
    }

    return {
      success: true,
      message: 'Email sent successfully! We will get back to you soon.',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[v0] Exception processing contact form:', errorMessage, error)
    return {
      success: false,
      error: `An error occurred: ${errorMessage}. Please try again or contact directly at vjai5894@gmail.com`,
    }
  }
}
