# Email Setup Guide

This guide explains how to set up automated, personalized emails for the waitlist and vendor forms.

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### 1. POST `/api/waitlist`

Saves waitlist entry and triggers email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "userType": "Student",
  "vibe": "Night Mode",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "id": "waitlist_123"
}
```

### 2. POST `/api/vendor`

Saves vendor interest and triggers email.

**Request Body:**
```json
{
  "email": "business@example.com",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "id": "vendor_456"
}
```

### 3. POST `/api/send-email`

Sends personalized emails using your Splita email.

**Request Body (Waitlist):**
```json
{
  "to": "user@example.com",
  "type": "waitlist",
  "userType": "Student",
  "vibe": "Night Mode"
}
```

**Request Body (Vendor):**
```json
{
  "to": "business@example.com",
  "type": "vendor"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_123"
}
```

## Email Service Setup

### Option 1: Resend (Recommended)

Resend is modern, developer-friendly, and perfect for transactional emails.

1. **Sign up at [resend.com](https://resend.com)**
2. **Get your API key**
3. **Verify your domain** (e.g., `splita.co`)
4. **Set up your backend:**

```javascript
// Example using Node.js/Express with Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Waitlist welcome email
app.post('/api/send-email', async (req, res) => {
  const { to, type, userType, vibe } = req.body;
  
  try {
    let emailContent;
    
    if (type === 'waitlist') {
      emailContent = {
        from: 'Splita <hello@splita.co>', // Your verified domain
        to: [to],
        subject: `Welcome to Splita, ${userType}! 🎉`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
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
                <p>Thanks for joining the Splita waitlist! We're excited to have you as a ${userType}.</p>
                ${vibe ? `<p>We've saved your preference for <strong>${vibe}</strong> - we'll make sure Splita looks perfect for you when we launch!</p>` : ''}
                <p>We're building something special to make group payments simple, fast, and reliable. You'll be among the first to know when we launch.</p>
                <p>In the meantime, feel free to reply to this email if you have any questions or feedback!</p>
                <p>Best,<br>The Splita Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
    } else if (type === 'vendor') {
      emailContent = {
        from: 'Splita <hello@splita.com>',
        to: [to],
        subject: 'Welcome, Hartford Business Partner! 🏢',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
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
      };
    }
    
    const { data, error } = await resend.emails.send(emailContent);
    
    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    
    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
```

### Option 2: SendGrid

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { to, type, userType, vibe } = req.body;
  
  const msg = {
    to: to,
    from: 'hello@splita.co',
    subject: type === 'waitlist' 
      ? `Welcome to Splita, ${userType}! 🎉`
      : 'Welcome, Hartford Business Partner! 🏢',
    html: generateEmailHTML(type, userType, vibe),
  };
  
  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});
```

### Option 3: AWS SES

```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

app.post('/api/send-email', async (req, res) => {
  const { to, type, userType, vibe } = req.body;
  
  const params = {
    Source: 'hello@splita.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: type === 'waitlist' ? `Welcome to Splita!` : 'Welcome, Business Partner!' },
      Body: { Html: { Data: generateEmailHTML(type, userType, vibe) } },
    },
  };
  
  try {
    await ses.sendEmail(params).promise();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});
```

## Database Schema

Make sure to save all form submissions:

```sql
-- Waitlist table
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(50),
  vibe VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  email_sent_at TIMESTAMP
);

-- Vendor interest table
CREATE TABLE vendor_interest (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  email_sent_at TIMESTAMP
);
```

## Environment Variables

Add to your backend `.env`:

```bash
# Email service
RESEND_API_KEY=re_xxxxxxxxxxxxx
# or
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# or
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx

# Your Splita email
SPLITA_EMAIL=hello@splita.co
```

## Testing

1. Submit a waitlist form
2. Check your database - entry should be saved
3. Check the recipient's inbox - personalized email should arrive
4. Check email service dashboard for delivery status

## Email Personalization

The emails are personalized based on:
- **Waitlist**: User type (Student, Friend Group, Vendor, Creator) and vibe preference
- **Vendor**: Business context and Hartford-specific messaging

## Next Steps

1. Choose an email service (Resend recommended)
2. Set up your backend endpoints
3. Verify your domain
4. Test email delivery
5. Monitor email analytics

