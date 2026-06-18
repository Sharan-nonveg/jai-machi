'use server'

import { Resend } from 'resend'

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface EmailResponse {
  success: boolean
  message?: string
  error?: string
  emailId?: string
}

// Initialize Resend client - will be null if API key is not configured
const resend = process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('your_actual_key') 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Recipient email - configurable via environment variable
const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL_RECIPIENT || 'vjai5894@gmail.com'

// Development mode flag
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || process.env.ENVIRONMENT === 'development'
const IS_EMAIL_CONFIGURED = !!resend && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('your_actual_key')

export async function sendContactEmail(data: ContactFormData): Promise<EmailResponse> {
  try {
    // Validate input
    if (!data.name || !data.name.trim()) {
      return {
        success: false,
        error: 'Please enter your name',
      }
    }

    if (!data.email || !data.email.trim()) {
      return {
        success: false,
        error: 'Please enter your email address',
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

    if (!data.message || !data.message.trim()) {
      return {
        success: false,
        error: 'Please enter your message',
      }
    }

    // Validate message length
    if (data.message.length < 10) {
      return {
        success: false,
        error: 'Message must be at least 10 characters long',
      }
    }

    if (data.message.length > 5000) {
      return {
        success: false,
        error: 'Message must be less than 5000 characters',
      }
    }

    // Sanitize and trim data
    const sanitizedData = {
      name: data.name.trim().substring(0, 200),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim(),
    }

    console.log('[Email Service] Attempting to send email from:', sanitizedData.email)
    console.log('[Email Service] Recipient:', RECIPIENT_EMAIL)
    console.log('[Email Service] Email Service Configured:', IS_EMAIL_CONFIGURED)
    console.log('[Email Service] Development Mode:', IS_DEVELOPMENT)

    // If Resend is not configured, log and return error with helpful message
    if (!IS_EMAIL_CONFIGURED) {
      console.warn('[Email Service] Resend API key is not configured or is a placeholder')
      
      if (IS_DEVELOPMENT) {
        // In development, log the email details
        console.log('[Email Service - DEV MODE] Would send email with data:', {
          to: RECIPIENT_EMAIL,
          from: 'noreply@cricket-portfolio.dev',
          subject: `New Contact Form Submission from ${sanitizedData.name}`,
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message,
        })
        
        return {
          success: true,
          message: 'Email logged to console (dev mode). Configure RESEND_API_KEY for production.',
          emailId: 'dev-' + Date.now(),
        }
      }
      
      return {
        success: false,
        error: 'Email service is not configured. Please configure RESEND_API_KEY environment variable.',
      }
    }

    // Send email to portfolio owner
    console.log('[Email Service] Sending main email to:', RECIPIENT_EMAIL)
    
    const mainEmailResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: RECIPIENT_EMAIL,
      replyTo: sanitizedData.email,
      subject: 'New Portfolio Contact Form Submission',
      html: generateContactEmailHTML(sanitizedData),
    })

    if (mainEmailResult.error) {
      console.error('[Email Service] Failed to send main email:', mainEmailResult.error)
      return {
        success: false,
        error: `Failed to send email: ${mainEmailResult.error.message || 'Unknown error'}`,
      }
    }

    console.log('[Email Service] Main email sent successfully. ID:', mainEmailResult.data?.id)

    // Send confirmation email to visitor
    console.log('[Email Service] Sending confirmation email to:', sanitizedData.email)
    
    try {
      const confirmEmailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: sanitizedData.email,
        subject: 'We received your message - Cricket Portfolio',
        html: generateConfirmationEmailHTML(sanitizedData.name),
      })

      if (confirmEmailResult.error) {
        console.warn('[Email Service] Confirmation email failed (main was sent):', confirmEmailResult.error)
        // Don't fail the whole request - main email was sent
      } else {
        console.log('[Email Service] Confirmation email sent. ID:', confirmEmailResult.data?.id)
      }
    } catch (confirmError) {
      console.warn('[Email Service] Exception sending confirmation email:', confirmError)
      // Still return success since main email was sent
    }

    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
      emailId: mainEmailResult.data?.id,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[Email Service] Exception:', errorMessage)
    console.error('[Email Service] Full error:', error)
    
    return {
      success: false,
      error: `An error occurred while sending your message. Please try again or contact directly at ${RECIPIENT_EMAIL}`,
    }
  }
}

// Generate HTML for contact owner email
function generateContactEmailHTML(data: {
  name: string
  email: string
  message: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border-top: 4px solid #22c55e; }
          .info-block { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #22c55e; border-radius: 4px; }
          .label { font-weight: 600; color: #22c55e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .value { color: #333; word-wrap: break-word; }
          .message-content { white-space: pre-wrap; word-wrap: break-word; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .timestamp { color: #999; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="info-block">
              <div class="label">Name</div>
              <div class="value">${escapeHTML(data.name)}</div>
            </div>
            
            <div class="info-block">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${escapeHTML(data.email)}">${escapeHTML(data.email)}</a></div>
            </div>
            
            <div class="info-block">
              <div class="label">Message</div>
              <div class="value message-content">${escapeHTML(data.message)}</div>
            </div>
            
            <div class="footer">
              <p>This email was sent from your Cricket Portfolio contact form.</p>
              <p class="timestamp">Sent at: ${new Date().toLocaleString()}</p>
              <p>Reply directly to this email to respond to the visitor.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

// Generate HTML for confirmation email to visitor
function generateConfirmationEmailHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 8px 8px; text-align: center; }
          .message { font-size: 16px; line-height: 1.8; margin: 20px 0; color: #555; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Thank You!</h1>
          </div>
          <div class="content">
            <p class="message">Hi ${escapeHTML(name)},</p>
            <p class="message">We've received your message and will get back to you as soon as possible.</p>
            <p class="message">We appreciate you reaching out!</p>
            
            <div class="footer">
              <p>This is an automated response from the Cricket Portfolio.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

// Utility function to escape HTML
function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
