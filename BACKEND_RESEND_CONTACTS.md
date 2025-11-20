# Backend Implementation: Resend Contacts

This document shows how to implement Resend contact creation in your production backend.

## Implementation

Add this function to your backend API:

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to add contact to Resend
async function addContactToResend(email, audienceId, metadata = {}) {
  try {
    const contactPayload = {
      email: email,
      unsubscribed: false,
      ...metadata,
    };

    if (audienceId) {
      contactPayload.audienceId = audienceId;
    }

    const { data, error } = await resend.contacts.create(contactPayload);

    if (error) {
      console.error('Resend contact error:', error);
      // Try without audienceId if that fails
      if (audienceId) {
        const { data: retryData, error: retryError } = await resend.contacts.create({
          email: email,
          unsubscribed: false,
          ...metadata,
        });
        
        if (retryError) {
          return { success: false, error: retryError };
        }
        
        return { success: true, contactId: retryData.id };
      }
      return { success: false, error };
    }

    return { success: true, contactId: data.id };
  } catch (error) {
    console.error('Error adding contact to Resend:', error);
    return { success: false, error: error.message };
  }
}
```

## Update Waitlist Endpoint

```javascript
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, userType, vibe, timestamp } = req.body;
    
    // Save to database
    const entry = await saveWaitlistEntry({ email, userType, vibe, timestamp });
    
    // Add contact to Resend
    const contactResult = await addContactToResend(
      email,
      process.env.RESEND_WAITLIST_AUDIENCE_ID,
      {
        firstName: userType,
        // Add more metadata as needed
      }
    );

    if (contactResult.success) {
      console.log('Contact added to Resend waitlist audience');
    } else {
      console.warn('Failed to add contact to Resend:', contactResult.error);
      // Don't fail the request - form submission still succeeds
    }
    
    // Send welcome email
    await sendWelcomeEmail(email, userType, vibe);
    
    res.json({ 
      success: true, 
      id: entry.id,
      resendContactId: contactResult.contactId || null,
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ error: 'Failed to process waitlist' });
  }
});
```

## Update Vendor Endpoint

```javascript
app.post('/api/vendor', async (req, res) => {
  try {
    const { email, timestamp } = req.body;
    
    // Save to database
    const entry = await saveVendorEntry({ email, timestamp });
    
    // Add contact to Resend
    const contactResult = await addContactToResend(
      email,
      process.env.RESEND_VENDOR_AUDIENCE_ID,
      {
        firstName: 'Business',
      }
    );

    if (contactResult.success) {
      console.log('Contact added to Resend vendor audience');
    } else {
      console.warn('Failed to add contact to Resend:', contactResult.error);
    }
    
    // Send welcome email
    await sendVendorEmail(email);
    
    res.json({ 
      success: true, 
      id: entry.id,
      resendContactId: contactResult.contactId || null,
    });
  } catch (error) {
    console.error('Vendor error:', error);
    res.status(500).json({ error: 'Failed to process vendor' });
  }
});
```

## Environment Variables

Add to your backend `.env`:

```bash
RESEND_API_KEY=re_KS7428TD_3vuXwjoiLQ462WJkXLHbq9VA
RESEND_WAITLIST_AUDIENCE_ID=your-waitlist-audience-id
RESEND_VENDOR_AUDIENCE_ID=your-vendor-audience-id
```

## Notes

- Contact creation failures don't block form submissions
- Contacts are added to default audience if audience ID is not set
- All errors are logged for debugging
- You can manually add contacts later in Resend dashboard if needed

