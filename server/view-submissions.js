// Simple script to view database submissions
// Run with: node view-submissions.js

import { initDatabase, getAllWaitlistSubmissions, getAllVendorSubmissions, getStats } from './database.js';

async function viewSubmissions() {
  try {
    await initDatabase();
    
    console.log('\n📊 SPLITA SUBMISSIONS DATABASE\n');
    console.log('=' .repeat(50));
    
    // Get stats
    const stats = await getStats();
    console.log('\n📈 STATISTICS:');
    console.log(`   Total Waitlist Signups: ${stats.signups}`);
    console.log(`   Total Vendor Applications: ${stats.vendors}`);
    console.log(`   Cities Represented: ${stats.cities}`);
    
    // Get waitlist submissions
    console.log('\n📝 WAITLIST SUBMISSIONS:');
    console.log('-'.repeat(50));
    const waitlist = await getAllWaitlistSubmissions(100);
    if (waitlist.length === 0) {
      console.log('   No waitlist submissions yet.');
    } else {
      waitlist.forEach((sub, index) => {
        console.log(`\n   ${index + 1}. ${sub.email}`);
        console.log(`      Type: ${sub.user_type}`);
        if (sub.vibe) console.log(`      Vibe: ${sub.vibe}`);
        console.log(`      Submitted: ${new Date(sub.created_at).toLocaleString()}`);
      });
    }
    
    // Get vendor submissions
    console.log('\n\n🏢 VENDOR SUBMISSIONS:');
    console.log('-'.repeat(50));
    const vendors = await getAllVendorSubmissions(100);
    if (vendors.length === 0) {
      console.log('   No vendor submissions yet.');
    } else {
      vendors.forEach((sub, index) => {
        console.log(`\n   ${index + 1}. ${sub.email}`);
        console.log(`      Submitted: ${new Date(sub.created_at).toLocaleString()}`);
      });
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error viewing submissions:', error);
    process.exit(1);
  }
}

viewSubmissions();


