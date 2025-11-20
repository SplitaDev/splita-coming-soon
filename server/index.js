// Express server with Resend audience integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendWaitlistEmail, sendVendorEmail, addContactToAudience, getAudienceContactCount } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    resend: process.env.RESEND_API_KEY ? 'configured' : 'not configured',
    waitlistAudience: process.env.RESEND_WAITLIST_AUDIENCE_ID ? 'configured' : 'not configured',
    vendorAudience: process.env.RESEND_VENDOR_AUDIENCE_ID ? 'configured' : 'not configured',
    timestamp: new Date().toISOString(),
  });
});

// Stats endpoint - fetches real-time stats from Resend audiences
app.get('/api/stats', async (req, res) => {
  try {
    const waitlistAudienceId = process.env.RESEND_WAITLIST_AUDIENCE_ID;
    const vendorAudienceId = process.env.RESEND_VENDOR_AUDIENCE_ID;

    let waitlistCount = 0;
    let vendorCount = 0;

    // Get waitlist count
    if (waitlistAudienceId) {
      const waitlistResult = await getAudienceContactCount(waitlistAudienceId);
      if (waitlistResult.success) {
        waitlistCount = waitlistResult.count;
      } else {
        console.warn('Failed to get waitlist count:', waitlistResult.error);
      }
    }

    // Get vendor count
    if (vendorAudienceId) {
      const vendorResult = await getAudienceContactCount(vendorAudienceId);
      if (vendorResult.success) {
        vendorCount = vendorResult.count;
      } else {
        console.warn('Failed to get vendor count:', vendorResult.error);
      }
    }

    // Total signups = waitlist + vendors
    const totalSignups = waitlistCount + vendorCount;

    // Add a couple hundred to each number for display
    const displaySignups = totalSignups + 200;
    const displayWaitlist = waitlistCount + 200;

    res.json({
      signups: displaySignups,
      waitlist: displayWaitlist,
      cities: 1, // Keep cities as 1 for now (can be updated if needed)
    });
  } catch (error) {
    console.error('Stats error:', error);
    // Return fallback values on error
    res.json({
      signups: 3424,
      waitlist: 23,
      cities: 1,
    });
  }
});

// Waitlist submission endpoint
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, userType, vibe, timestamp } = req.body;

    if (!email || !userType) {
      return res.status(400).json({ error: 'Email and userType are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const waitlistAudienceId = process.env.RESEND_WAITLIST_AUDIENCE_ID;

    // Add to Resend audience
    if (waitlistAudienceId) {
      console.log(`📧 Adding ${normalizedEmail} to waitlist audience: ${waitlistAudienceId}`);
      const contactResult = await addContactToAudience(normalizedEmail, waitlistAudienceId, {
        firstName: userType || undefined,
        // Note: Resend doesn't support custom properties in the create call
        // Properties can be added later via update if needed
      });

      if (!contactResult.success) {
        console.error('❌ Failed to add contact to audience:', contactResult.error);
        // Continue anyway - we'll still send the email
      } else {
        console.log(`✅ Contact added to waitlist audience:`, normalizedEmail);
      }
    } else {
      console.error('❌ RESEND_WAITLIST_AUDIENCE_ID not set in .env file - contact not added to audience');
      console.log('Please add: RESEND_WAITLIST_AUDIENCE_ID=0febd25d-9658-4d72-998f-18a8d90fc24e to your .env file');
    }

    // Send welcome email
    sendWaitlistEmail(normalizedEmail, userType, vibe).catch((err) => {
      console.warn('Email sending failed (non-critical):', err);
    });

    res.json({
      success: true,
      message: 'Successfully added to waitlist',
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ error: 'Failed to process waitlist entry' });
  }
});

// Vendor submission endpoint
app.post('/api/vendor', async (req, res) => {
  try {
    const { email, timestamp } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const vendorAudienceId = process.env.RESEND_VENDOR_AUDIENCE_ID;

    // Add to Resend audience
    if (vendorAudienceId) {
      console.log(`📧 Adding ${normalizedEmail} to vendor audience: ${vendorAudienceId}`);
      const contactResult = await addContactToAudience(normalizedEmail, vendorAudienceId, {
        // Note: Resend doesn't support custom properties in the create call
        // Properties can be added later via update if needed
      });

      if (!contactResult.success) {
        console.error('❌ Failed to add contact to audience:', contactResult.error);
        // Continue anyway - we'll still send the email
      } else {
        console.log(`✅ Contact added to vendor audience:`, normalizedEmail);
      }
    } else {
      console.error('❌ RESEND_VENDOR_AUDIENCE_ID not set in .env file - contact not added to audience');
      console.log('Please add: RESEND_VENDOR_AUDIENCE_ID=e7cbab7f-7e22-410d-811a-085006b2a713 to your .env file');
    }

    // Send vendor welcome email
    sendVendorEmail(normalizedEmail).catch((err) => {
      console.warn('Email sending failed (non-critical):', err);
    });

    res.json({
      success: true,
      message: 'Successfully added to vendor list',
    });
  } catch (error) {
    console.error('Vendor error:', error);
    res.status(500).json({ error: 'Failed to process vendor entry' });
  }
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, type, userType, vibe } = req.body;

    if (!to || !type) {
      return res.status(400).json({ error: 'Email and type are required' });
    }

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

// Admin endpoints - Note: Resend doesn't provide an API to list contacts
// You'll need to view contacts in the Resend dashboard
app.get('/api/admin/waitlist', async (req, res) => {
  res.json({
    message: 'Contacts are managed in Resend dashboard',
    dashboardUrl: 'https://resend.com/audiences',
    note: 'Use the Resend dashboard to view and manage waitlist contacts',
  });
});

app.get('/api/admin/vendors', async (req, res) => {
  res.json({
    message: 'Contacts are managed in Resend dashboard',
    dashboardUrl: 'https://resend.com/audiences',
    note: 'Use the Resend dashboard to view and manage vendor contacts',
  });
});

app.get('/api/admin/export', async (req, res) => {
  res.json({
    message: 'Export contacts from Resend dashboard',
    dashboardUrl: 'https://resend.com/audiences',
    note: 'Use the Resend dashboard to export contacts',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: ${process.env.RESEND_API_KEY ? 'Ready' : 'Not configured'}`);
  console.log(`👥 Waitlist audience: ${process.env.RESEND_WAITLIST_AUDIENCE_ID ? 'Configured' : 'Not configured'}`);
  console.log(`🏢 Vendor audience: ${process.env.RESEND_VENDOR_AUDIENCE_ID ? 'Configured' : 'Not configured'}`);
  console.log(`📊 View contacts: https://resend.com/audiences`);
});

