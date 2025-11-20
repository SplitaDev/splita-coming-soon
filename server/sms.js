// SMS service using Twilio (Free Trial: $15.50 credit)
import twilio from 'twilio';

// Lazy initialization to ensure dotenv has loaded
function getTwilio() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken) {
    console.warn('⚠️ Twilio credentials not set - SMS will be disabled');
    return null;
  }

  if (!phoneNumber) {
    console.warn('⚠️ Twilio phone number not set - SMS will be disabled');
    return null;
  }

  return twilio(accountSid, authToken);
}

// Send SMS notification
export async function sendSMS(to, message) {
  try {
    const client = getTwilio();
    
    if (!client) {
      console.log('📱 SMS skipped - Twilio not configured');
      return { success: false, error: 'SMS service not configured' };
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to.replace(/\s/g, ''))) {
      return { success: false, error: 'Invalid phone number format' };
    }

    // Format phone number (ensure it starts with +)
    let formattedPhone = to.trim().replace(/\s/g, '');
    if (!formattedPhone.startsWith('+')) {
      // Assume US number if no country code
      if (formattedPhone.length === 10) {
        formattedPhone = `+1${formattedPhone}`;
      } else {
        return { success: false, error: 'Phone number must include country code (e.g., +1234567890)' };
      }
    }

    console.log(`📱 Sending SMS to: ${formattedPhone}`);
    console.log(`📝 Message: ${message.substring(0, 50)}...`);

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log('✅ SMS sent successfully!');
    console.log('📧 Message SID:', result.sid);
    
    return { 
      success: true, 
      messageSid: result.sid,
      status: result.status 
    };
  } catch (error) {
    console.error('❌ SMS send error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send SMS' 
    };
  }
}

// Send welcome SMS for waitlist signup
export async function sendWaitlistSMS(phoneNumber, userType) {
  const message = `🎉 Welcome to Splita! Thanks for joining as a ${userType}. We'll notify you when we launch. Reply STOP to opt out.`;
  return await sendSMS(phoneNumber, message);
}

// Send welcome SMS for vendor signup
export async function sendVendorSMS(phoneNumber) {
  const message = `🚀 Thanks for your interest in Splita! We'll review your vendor application and get back to you within 2-3 business days. Reply STOP to opt out.`;
  return await sendSMS(phoneNumber, message);
}

// Send launch notification SMS
export async function sendLaunchSMS(phoneNumber, name) {
  const message = `🎊 Splita is now live! ${name ? `Hi ${name}, ` : ''}Start splitting payments with your group today: https://splita.co`;
  return await sendSMS(phoneNumber, message);
}

