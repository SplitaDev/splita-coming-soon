# Backend Setup with Resend API Key

## Where to Put Your Resend API Key

### Option 1: Backend Server `.env` File (Recommended)

Create a `.env` file in your **backend server directory** (not in this frontend project):

```bash
# .env file in your backend server
RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA
SPLITA_EMAIL=arinze@splita.co
```

### Option 2: Environment Variables in Your Hosting Platform

If you're using a hosting platform, add it in their dashboard:

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - Key: `RESEND_API_KEY`
   - Value: `re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA`

**Railway/Render/Heroku:**
1. Go to your project settings
2. Add environment variable:
   - `RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA`

## Quick Backend Implementation

Here's a complete example using Node.js/Express:

### 1. Install Resend

```bash
npm install resend
```

### 2. Create Email Service File

```javascript
// server/services/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWaitlistEmail(email, userType, vibe) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Splita <hello@splita.co>', // Update with your verified domain
      to: [email],
      subject: `Welcome to Splita, ${userType}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #02B7A0; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #02B7A0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Splita! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thanks for joining the Splita waitlist! We're excited to have you as a <strong>${userType}</strong>.</p>
              ${vibe ? `<p>We've saved your preference for <strong>${vibe}</strong> - we'll make sure Splita looks perfect for you when we launch!</p>` : ''}
              <p>We're building something special to make group payments simple, fast, and reliable. You'll be among the first to know when we launch.</p>
              <p>In the meantime, feel free to reply to this email if you have any questions or feedback!</p>
              <p>Best,<br>The Splita Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendVendorEmail(email) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Splita <hello@splita.co>',
      to: [email],
      subject: 'Welcome, Hartford Business Partner! 🏢',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #02B7A0; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #02B7A0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Splita for Businesses! 🏢</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thanks for your interest in Splita! We're excited to help Hartford businesses like yours streamline group payments.</p>
              <p>With Splita, you'll get:</p>
              <ul>
                <li>Instant collections from group payments</li>
                <li>Clean, automated tracking</li>
                <li>Reduced payment friction for your customers</li>
              </ul>
              <p>We'll be in touch soon with more details about our vendor program and how you can get started.</p>
              <p>In the meantime, feel free to reply to this email or <a href="https://cal.com/arinze-okigbo-bxrnea">book a call</a> to discuss how Splita can help your business.</p>
              <p>Best,<br>The Splita Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
```

### 3. Create API Routes

```javascript
// server/routes/email.js
import express from 'express';
import { sendWaitlistEmail, sendVendorEmail } from '../services/email.js';
import { saveWaitlistEntry, saveVendorEntry } from '../services/database.js';

const router = express.Router();

// Waitlist endpoint
router.post('/waitlist', async (req, res) => {
  try {
    const { email, userType, vibe, timestamp } = req.body;
    
    // Save to database
    await saveWaitlistEntry({ email, userType, vibe, timestamp });
    
    // Send email
    const emailResult = await sendWaitlistEmail(email, userType, vibe);
    
    if (emailResult.success) {
      res.json({ success: true, id: emailResult.messageId });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ error: 'Failed to process waitlist entry' });
  }
});

// Vendor endpoint
router.post('/vendor', async (req, res) => {
  try {
    const { email, timestamp } = req.body;
    
    // Save to database
    await saveVendorEntry({ email, timestamp });
    
    // Send email
    const emailResult = await sendVendorEmail(email);
    
    if (emailResult.success) {
      res.json({ success: true, id: emailResult.messageId });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Vendor error:', error);
    res.status(500).json({ error: 'Failed to process vendor entry' });
  }
});

// Email endpoint (called by frontend)
router.post('/send-email', async (req, res) => {
  try {
    const { to, type, userType, vibe } = req.body;
    
    let emailResult;
    if (type === 'waitlist') {
      emailResult = await sendWaitlistEmail(to, userType, vibe);
    } else if (type === 'vendor') {
      emailResult = await sendVendorEmail(to);
    } else {
      return res.status(400).json({ error: 'Invalid email type' });
    }
    
    if (emailResult.success) {
      res.json({ success: true, messageId: emailResult.messageId });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
```

### 4. Important: Verify Your Domain in Resend

Before sending emails, you must:

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add your domain (e.g., `splita.co`)
3. Add the DNS records Resend provides to your domain
4. Wait for verification (usually a few minutes)

Once verified, you can use `hello@splita.co` or any email from that domain.

## Security Notes

⚠️ **Never commit your API key to Git!**

- Add `.env` to your `.gitignore`
- Use environment variables in production
- Rotate your API key if it's ever exposed

## Testing

1. Set up your backend with the API key
2. Verify your domain in Resend
3. Test the waitlist form
4. Check the recipient's inbox
5. Check Resend dashboard for delivery status

Your API key: `re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA`

