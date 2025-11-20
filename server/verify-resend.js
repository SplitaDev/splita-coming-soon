// Verify Resend contact creation with new API key
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const audienceId = process.env.RESEND_WAITLIST_AUDIENCE_ID;

console.log('🔍 Verifying Resend contact creation...\n');

if (!audienceId) {
  console.error('❌ Audience ID not set!');
  process.exit(1);
}

const testEmail = `verify-${Date.now()}@test.com`;

console.log(`📧 Creating contact: ${testEmail}`);
console.log(`📂 Audience ID: ${audienceId}\n`);

try {
  const { data, error } = await resend.contacts.create({
    email: testEmail,
    firstName: 'Test',
    lastName: 'User',
    unsubscribed: false,
    audienceId: audienceId,
  });

  if (error) {
    console.error('❌ Error creating contact:');
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log('✅ Contact created successfully!');
  console.log('📊 Contact ID:', data?.id || 'N/A');
  console.log('📧 Email:', data?.email || testEmail);
  console.log('\n🔍 Verifying contact appears in audience...\n');

  // Wait a moment for Resend to process
  await new Promise(resolve => setTimeout(resolve, 2000));

  // List contacts to verify
  const listResult = await resend.contacts.list({ 
    audienceId: audienceId,
    limit: 20 
  });

  if (listResult.error) {
    console.error('❌ Error listing contacts:', JSON.stringify(listResult.error, null, 2));
  } else {
    const contacts = listResult.data?.data || [];
    console.log(`📋 Found ${contacts.length} contacts in audience`);
    
    const found = contacts.find(c => c.email === testEmail);
    if (found) {
      console.log('✅ Contact found in audience list!');
      console.log('📊 Contact details:', JSON.stringify(found, null, 2));
    } else {
      console.log('⚠️  Contact not found in list yet (may need a few seconds to appear)');
      console.log('   Check Resend dashboard: https://resend.com/audiences');
    }
  }

  console.log('\n✅ Verification complete!');
} catch (err) {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
}

