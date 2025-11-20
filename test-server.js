// Simple test server for testing forms and emails
// Run with: node test-server.js
// Make sure to set RESEND_API_KEY in your environment

import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load .env.test-server if it exists, otherwise load .env
dotenv.config({ path: '.env.test-server' });
dotenv.config(); // Also load .env for fallback

const app = express();
const PORT = 3001;
const resend = new Resend(process.env.RESEND_API_KEY || 're_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA');

// Resend Audience IDs - Update these with your actual audience IDs from Resend dashboard
// You can find/create audiences at: https://resend.com/audiences
const WAITLIST_AUDIENCE_ID = process.env.RESEND_WAITLIST_AUDIENCE_ID || null;
const VENDOR_AUDIENCE_ID = process.env.RESEND_VENDOR_AUDIENCE_ID || null;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// In-memory storage for testing
const waitlist = [];
const vendors = [];
let stats = {
  signups: 3424,
  waitlist: 23,
  cities: 1,
};

// Helper function to add contact to Resend
async function addContactToResend(email, audienceId, metadata = {}) {
  try {
    // Resend contacts API - create contact
    // Note: Resend API structure may vary - this is the standard format
    const contactPayload = {
      email: email,
      unsubscribed: false,
      ...metadata,
    };

    // If audience ID is provided, include it in the payload
    // Note: Some Resend versions may require adding to audience separately
    if (audienceId) {
      contactPayload.audienceId = audienceId;
    }

    const { data, error } = await resend.contacts.create(contactPayload);

    if (error) {
      console.error('❌ Resend contact error:', error);
      // Try without audienceId if that fails
      if (audienceId) {
        console.log('⚠️  Retrying without audience ID...');
        const { data: retryData, error: retryError } = await resend.contacts.create({
          email: email,
          unsubscribed: false,
          ...metadata,
        });
        
        if (retryError) {
          return { success: false, error: retryError };
        }
        
        console.log('✅ Contact added to Resend (default audience):', retryData.id);
        return { success: true, contactId: retryData.id };
      }
      return { success: false, error };
    }

    console.log('✅ Contact added to Resend:', data.id);
    return { success: true, contactId: data.id };
  } catch (error) {
    console.error('❌ Error adding contact to Resend:', error);
    // Don't fail the form submission if contact creation fails
    return { success: false, error: error.message };
  }
}

// Stats endpoint
app.get('/api/stats', (req, res) => {
  stats.waitlist = waitlist.length;
  res.json(stats);
});

// Waitlist endpoint
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, userType, vibe, timestamp } = req.body;
    console.log('📝 Waitlist submission:', { email, userType, vibe });
    
    // Save to memory
    waitlist.push({ email, userType, vibe, timestamp, id: Date.now() });
    stats.waitlist = waitlist.length;
    
    // Add contact to Resend with metadata
    const contactResult = await addContactToResend(
      email,
      WAITLIST_AUDIENCE_ID,
      {
        firstName: userType, // Store userType as firstName for now
        // Add custom fields if Resend supports them
        // Note: Resend may have limitations on custom fields
      }
    );

    if (contactResult.success) {
      console.log('✅ Contact added to Resend waitlist audience');
    } else {
      console.warn('⚠️  Failed to add contact to Resend, but submission saved:', contactResult.error);
    }
    
    res.json({ 
      success: true, 
      id: `waitlist_${Date.now()}`,
      resendContactId: contactResult.contactId || null,
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ error: 'Failed to process waitlist' });
  }
});

// Vendor endpoint
app.post('/api/vendor', async (req, res) => {
  try {
    const { email, timestamp } = req.body;
    console.log('🏢 Vendor submission:', { email });
    
    // Save to memory
    vendors.push({ email, timestamp, id: Date.now() });
    
    // Add contact to Resend vendor audience
    const contactResult = await addContactToResend(
      email,
      VENDOR_AUDIENCE_ID,
      {
        firstName: 'Business', // Tag as business contact
      }
    );

    if (contactResult.success) {
      console.log('✅ Contact added to Resend vendor audience');
    } else {
      console.warn('⚠️  Failed to add contact to Resend, but submission saved:', contactResult.error);
    }
    
    res.json({ 
      success: true, 
      id: `vendor_${Date.now()}`,
      resendContactId: contactResult.contactId || null,
    });
  } catch (error) {
    console.error('Vendor error:', error);
    res.status(500).json({ error: 'Failed to process vendor' });
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, type, userType, vibe } = req.body;
    console.log('📧 Sending email:', { to, type, userType, vibe });
    
    let emailContent;
    
    if (type === 'waitlist') {
      emailContent = {
        from: 'Splita <hello@splita.co>',
        to: [to],
        subject: `Welcome to Splita, ${userType}! 🎉`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
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
      };
    } else if (type === 'vendor') {
      emailContent = {
        from: 'Splita <hello@splita.co>',
        to: [to],
        subject: 'Welcome, Hartford Business Partner! 🏢',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
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
    } else {
      return res.status(400).json({ error: 'Invalid email type' });
    }
    
    const { data, error } = await resend.emails.send(emailContent);
    
    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }
    
    console.log('✅ Email sent successfully:', data.id);
    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Test endpoint to view submissions
app.get('/api/test/submissions', (req, res) => {
  res.json({
    waitlist,
    vendors,
    stats,
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📧 Using Resend API key: ${process.env.RESEND_API_KEY ? '✅ Set' : '⚠️  Using default (may not work)'}`);
  console.log(`\n👥 Resend Audiences:`);
  console.log(`   Waitlist Audience ID: ${WAITLIST_AUDIENCE_ID || '⚠️  Not set (contacts will go to default)'}`);
  console.log(`   Vendor Audience ID: ${VENDOR_AUDIENCE_ID || '⚠️  Not set (contacts will go to default)'}`);
  console.log(`\n📝 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/stats`);
  console.log(`   POST http://localhost:${PORT}/api/waitlist`);
  console.log(`   POST http://localhost:${PORT}/api/vendor`);
  console.log(`   POST http://localhost:${PORT}/api/send-email`);
  console.log(`   GET  http://localhost:${PORT}/api/test/submissions (view all submissions)\n`);
});

