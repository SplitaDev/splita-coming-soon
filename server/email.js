// Email service using Resend
import { Resend } from 'resend';

// Lazy initialization to ensure dotenv has loaded
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set in environment variables');
  }
  return new Resend(apiKey);
}

// Get contact count from Resend audience
export async function getAudienceContactCount(audienceId) {
  try {
    const resend = getResend();
    
    // Resend API: List contacts in an audience with pagination
    // Use audienceId in options to filter by audience
    let totalCount = 0;
    let after = null; // Use cursor-based pagination
    const limit = 100; // Max per page
    
    while (true) {
      const options = { 
        audienceId: audienceId, // Filter by audience
        limit: limit 
      };
      if (after) {
        options.after = after;
      }
      
      const { data, error } = await resend.contacts.list(options);

      if (error) {
        console.error('Resend list contacts error:', error);
        return { success: false, count: 0, error };
      }

      if (!data || !data.data || data.data.length === 0) {
        break; // No more contacts
      }

      totalCount += data.data.length;
      
      // Check if there are more pages (Resend uses has_more flag)
      if (!data.has_more || data.data.length < limit) {
        break; // Reached the end
      }
      
      // Get the cursor for the next page (last item's ID)
      if (data.data.length > 0) {
        after = data.data[data.data.length - 1].id;
      } else {
        break;
      }
    }

    return { success: true, count: totalCount };
  } catch (error) {
    console.error('Error getting audience count:', error);
    return { success: false, count: 0, error };
  }
}

// Add contact to Resend audience
export async function addContactToAudience(email, audienceId, options = {}) {
  try {
    if (!audienceId) {
      console.error('No audience ID provided');
      return { success: false, error: 'No audience ID provided' };
    }

    const resend = getResend();
    
    // Build contact data according to Resend API documentation
    const contactData = {
      email: email.trim().toLowerCase(),
      unsubscribed: false,
      audienceId: audienceId,
    };

    // Add optional fields if provided
    if (options.firstName) {
      contactData.firstName = options.firstName;
    }
    if (options.lastName) {
      contactData.lastName = options.lastName;
    }

    console.log('📧 Adding contact to Resend audience:', { 
      email: contactData.email, 
      audienceId, 
      firstName: contactData.firstName || 'none',
      lastName: contactData.lastName || 'none'
    });

    const { data, error } = await resend.contacts.create(contactData);

    if (error) {
      console.error('❌ Resend contact error:', JSON.stringify(error, null, 2));
      
      // Check for restricted API key error
      if (error.name === 'restricted_api_key' || error.message?.includes('restricted') || error.statusCode === 401) {
        console.error('❌ API KEY ERROR: Your Resend API key is restricted to only send emails.');
        console.error('   It cannot create contacts or manage audiences.');
        console.error('   Solution: Create a new API key in Resend with full permissions:');
        console.error('   1. Go to https://resend.com/api-keys');
        console.error('   2. Create a new API key (not restricted)');
        console.error('   3. Update RESEND_API_KEY in your .env file');
        return { 
          success: false, 
          error: 'API key is restricted to email sending only. Please use a full API key with audience permissions.' 
        };
      }
      
      // If contact already exists, that's okay - Resend handles duplicates
      if (error.message && (error.message.includes('already exists') || error.message.includes('duplicate') || error.message?.toLowerCase().includes('already'))) {
        console.log('✅ Contact already exists in audience');
        return { success: true, message: 'Contact already in audience' };
      }
      return { success: false, error: error.message || JSON.stringify(error) };
    }

    console.log('✅ Contact successfully added to Resend audience');
    console.log('📊 Contact ID:', data?.id || 'N/A');
    return { success: true, contactId: data?.id };
  } catch (error) {
    console.error('Error adding contact to audience:', error);
    return { success: false, error: error.message || error };
  }
}

export async function sendWaitlistEmail(email, userType, vibe) {
  try {
    const resend = getResend();
    const fromEmail = process.env.SPLITA_EMAIL || 'Splita <hello@splita.co>';
    
    console.log(`📧 Sending waitlist email to: ${email}`);
    console.log(`📤 From: ${fromEmail}`);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
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
            .signature { margin-top: 28px; font-size: 15px; color: #111; }
            .signature-name { font-weight: 600; color: #02B7A0; font-size: 16px; }
            .signature-role { margin-top: 2px; }
            .signature-link a { color: #02B7A0; text-decoration: none; }
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
              <p>Feel free to reply to this email if you want to connect or share ideas.</p>

              <div class="signature">
                <p class="signature-name">Arinze Okigbo</p>
                <p class="signature-role">Founder, Splita</p>
                <p class="signature-link"><a href="https://splita.co">splita.co</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend email error:', JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log('✅ Waitlist email sent successfully!');
    console.log('📧 Message ID:', data?.id || 'N/A');
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error };
  }
}

export async function sendVendorEmail(email) {
  try {
    const resend = getResend();
    const fromEmail = process.env.SPLITA_EMAIL || 'Splita <hello@splita.co>';
    
    console.log(`📧 Sending vendor email to: ${email}`);
    console.log(`📤 From: ${fromEmail}`);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Splita Vendor Partnership - Next Steps',
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
            .signature { margin-top: 28px; font-size: 15px; color: #111; }
            .signature-name { font-weight: 600; color: #02B7A0; font-size: 16px; }
            .signature-role { margin-top: 2px; }
            .signature-link a { color: #02B7A0; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thanks for Your Interest! 🚀</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for applying to become a Splita vendor partner! We're excited about the possibility of working together.</p>
              <p>Our team will review your application and get back to you within 2-3 business days with next steps.</p>
              <p>In the meantime, if you have any questions, feel free to reply to this email.</p>

              <div class="signature">
                <p class="signature-name">Arinze Okigbo</p>
                <p class="signature-role">Founder, Splita</p>
                <p class="signature-link"><a href="https://splita.co">splita.co</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend email error:', JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log('✅ Vendor email sent successfully!');
    console.log('📧 Message ID:', data?.id || 'N/A');
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error };
  }
}


