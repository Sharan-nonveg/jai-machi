# Contact Form Email Setup Guide

## Overview
The contact form uses **Resend** for sending emails. This is a production-ready email service with excellent deliverability.

## Current Status
- ✅ Contact form component is fully functional
- ✅ Email validation is implemented
- ✅ Error handling is comprehensive
- ⚠️ **REQUIRED**: Resend API key must be configured for emails to be sent

## How It Works

### Development Mode
When the `RESEND_API_KEY` environment variable is not configured or is a placeholder:
- Emails are logged to the console instead of being sent
- The form shows a message: "Email logged to console (dev mode)"
- This allows testing the form without a real API key

### Production Mode
When a valid `RESEND_API_KEY` is configured:
- Emails are sent immediately via Resend
- Confirmation emails are sent to the visitor
- Contact emails are sent to the portfolio owner

## Step-by-Step Setup

### 1. Create a Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" (or "Sign In" if you have an account)
3. Complete the registration with your email address
4. Verify your email address

### 2. Get Your API Key
1. Log into your Resend account dashboard
2. Click "API Keys" in the left sidebar
3. Click "Create API Key" button
4. Copy the generated key (it starts with `re_`)
5. Keep this key safe - anyone with it can send emails from your account

### 3. Configure Your Environment

#### For Local Development
Edit `.env.local` in the project root:
```env
RESEND_API_KEY=re_your_actual_api_key_here
```

Replace `re_your_actual_api_key_here` with your actual key from Resend.

#### For GitHub Pages (Static Hosting)
Unfortunately, **GitHub Pages cannot send emails** because it's static hosting with no server.
You have two options:
- Use a dynamic hosting provider (Vercel, Netlify, Hostinger, etc.)
- Or set up a separate email backend service

#### For Vercel (Recommended)
1. Push your code to GitHub
2. Deploy to Vercel at [https://vercel.com](https://vercel.com)
3. In Project Settings → Environment Variables:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key
   - Environments: Production, Preview, Development
4. Click "Save" and redeploy

#### For Hostinger
1. Log into your Hostinger account
2. Go to your hosting control panel
3. Navigate to Environment Variables (or Advanced settings)
4. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key
5. Restart your application

#### For Other Platforms
Check your hosting provider's documentation for environment variables configuration.

### 4. Customize the Recipient Email
By default, contact emails go to `vjai5894@gmail.com`.

To change this, add to `.env.local`:
```env
CONTACT_EMAIL_RECIPIENT=your-email@example.com
```

## Testing the Contact Form

### Local Testing (Development Mode)
1. Run the dev server: `npm run dev`
2. Navigate to the contact section
3. Fill out the form and submit
4. Check your browser's developer console (F12)
5. You should see logged email details
6. No actual email is sent in dev mode

### Local Testing (With Real Emails)
1. Add your Resend API key to `.env.local`
2. Restart the dev server: `npm run dev`
3. Fill out the contact form
4. Submit and check your inbox (or spam folder)
5. You should receive both:
   - Contact email at the recipient address
   - Confirmation email at the visitor's email

### Production Testing
1. Deploy your code with the `RESEND_API_KEY` configured
2. Test the contact form on the live website
3. Verify both emails are received

## Email Content

### Contact Email (Sent to Portfolio Owner)
- **To**: vjai5894@gmail.com (or configured recipient)
- **From**: onboarding@resend.dev
- **Subject**: "New Portfolio Contact Form Submission"
- **Reply-To**: Visitor's email address
- **Contains**: Visitor's name, email, and message

### Confirmation Email (Sent to Visitor)
- **To**: Visitor's email address
- **From**: onboarding@resend.dev
- **Subject**: "We received your message - Cricket Portfolio"
- **Contains**: Thank you message and assurance of response

## Troubleshooting

### Emails Not Sending
1. **Check the API key**: Verify it's entered correctly in `.env.local`
2. **Check spam folder**: Sometimes emails go to spam
3. **Check Resend dashboard**: View sending activity at [https://resend.com/activity](https://resend.com/activity)
4. **Check browser console**: Look for error messages
5. **Check application logs**: Review server-side logs for details

### "Email service is not configured" Error
- This means the API key is missing or invalid
- Add or fix the `RESEND_API_KEY` in `.env.local`
- Restart the dev server or redeploy

### Confirmation Email Not Sent
- This is not critical - the main email was still sent
- Check Resend activity dashboard to see what happened
- This might happen if the visitor's email address is invalid

### Rate Limiting
- Resend free tier has limits (100 emails/day)
- If you hit the limit, you'll receive an error
- Upgrade your Resend plan if needed

## File Locations

- **Email server action**: `app/actions/send-email.ts`
- **Contact form component**: `components/cta-section.tsx`
- **Environment configuration**: `.env.local`
- **Type definitions**: `types/react-simple-maps.d.ts`

## Code Structure

### Server Action (app/actions/send-email.ts)
- Validates all form inputs
- Checks if Resend is configured
- Sends two emails (contact + confirmation)
- Returns success/error response
- Includes comprehensive error handling and logging

### Contact Form Component (components/cta-section.tsx)
- Handles form state and submission
- Prevents duplicate submissions
- Shows loading state
- Displays success/error messages
- Has 30-second timeout for requests
- Disables form inputs while submitting

## Security Considerations

1. **Never commit your API key**: Always use environment variables
2. **Limit API key permissions**: In Resend, restrict to sending emails only
3. **Input validation**: All form inputs are validated server-side
4. **HTML escaping**: User input is escaped to prevent XSS
5. **CORS**: Server actions are same-origin only

## Production Checklist

- [ ] Resend API key is configured
- [ ] `.env.local` is not committed to Git
- [ ] Recipient email is verified/correct
- [ ] Contact form has been tested
- [ ] Both emails (contact + confirmation) are received
- [ ] Errors are properly handled
- [ ] Hosting provider environment variables are set
- [ ] Application logs are monitored

## Support and Resources

- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)
- **Resend Dashboard**: [https://resend.com/dashboard](https://resend.com/dashboard)
- **Contact Support**: Check Resend's support channels

## Notes

- Emails are sent asynchronously but the form waits for confirmation
- Failed confirmation emails don't prevent success (contact email was already sent)
- All emails are HTML-formatted for better appearance
- The sender address is always `onboarding@resend.dev` (Resend's default)
- Reply-To addresses direct responses to the visitor's email
