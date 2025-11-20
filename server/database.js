// Database module for storing form submissions
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const DB_PATH = path.join(dataDir, 'splita_submissions.db');

// Initialize database
export async function initDatabase() {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Create waitlist submissions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS waitlist_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        user_type TEXT NOT NULL,
        vibe TEXT,
        timestamp TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create vendor submissions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS vendor_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        timestamp TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for faster queries
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_submissions(email);
      CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist_submissions(created_at);
      CREATE INDEX IF NOT EXISTS idx_vendor_email ON vendor_submissions(email);
      CREATE INDEX IF NOT EXISTS idx_vendor_created ON vendor_submissions(created_at);
    `);

    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Get database connection
let dbInstance = null;

export async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

// Save waitlist submission
export async function saveWaitlistEntry({ email, userType, vibe, timestamp }) {
  try {
    const db = await getDatabase();
    
    // Check if email already exists
    const existing = await db.get(
      'SELECT id FROM waitlist_submissions WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing) {
      // Update existing entry
      await db.run(
        `UPDATE waitlist_submissions 
         SET user_type = ?, vibe = ?, timestamp = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE email = ?`,
        [userType, vibe || null, timestamp, email.toLowerCase().trim()]
      );
      return { id: existing.id, updated: true };
    } else {
      // Insert new entry
      const result = await db.run(
        `INSERT INTO waitlist_submissions (email, user_type, vibe, timestamp) 
         VALUES (?, ?, ?, ?)`,
        [email.toLowerCase().trim(), userType, vibe || null, timestamp]
      );
      return { id: result.lastID, updated: false };
    }
  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    throw error;
  }
}

// Save vendor submission
export async function saveVendorEntry({ email, timestamp }) {
  try {
    const db = await getDatabase();
    
    // Check if email already exists
    const existing = await db.get(
      'SELECT id FROM vendor_submissions WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing) {
      // Update existing entry
      await db.run(
        `UPDATE vendor_submissions 
         SET timestamp = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE email = ?`,
        [timestamp, email.toLowerCase().trim()]
      );
      return { id: existing.id, updated: true };
    } else {
      // Insert new entry
      const result = await db.run(
        `INSERT INTO vendor_submissions (email, timestamp) 
         VALUES (?, ?)`,
        [email.toLowerCase().trim(), timestamp]
      );
      return { id: result.lastID, updated: false };
    }
  } catch (error) {
    console.error('Error saving vendor entry:', error);
    throw error;
  }
}

// Get all waitlist submissions
export async function getAllWaitlistSubmissions(limit = 100, offset = 0) {
  try {
    const db = await getDatabase();
    const submissions = await db.all(
      `SELECT * FROM waitlist_submissions 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return submissions;
  } catch (error) {
    console.error('Error fetching waitlist submissions:', error);
    throw error;
  }
}

// Get all vendor submissions
export async function getAllVendorSubmissions(limit = 100, offset = 0) {
  try {
    const db = await getDatabase();
    const submissions = await db.all(
      `SELECT * FROM vendor_submissions 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return submissions;
  } catch (error) {
    console.error('Error fetching vendor submissions:', error);
    throw error;
  }
}

// Get statistics
export async function getStats() {
  try {
    const db = await getDatabase();
    
    const waitlistResult = await db.get('SELECT COUNT(*) as count FROM waitlist_submissions');
    const vendorResult = await db.get('SELECT COUNT(*) as count FROM vendor_submissions');
    const citiesResult = await db.get(`
      SELECT COUNT(DISTINCT SUBSTR(email, INSTR(email, '@') + 1)) as count 
      FROM waitlist_submissions
    `);

    return {
      signups: waitlistResult?.count || 0,
      waitlist: waitlistResult?.count || 0,
      vendors: vendorResult?.count || 0,
      cities: citiesResult?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

// Export all submissions to JSON
export async function exportSubmissions() {
  try {
    const waitlist = await getAllWaitlistSubmissions(10000);
    const vendors = await getAllVendorSubmissions(10000);
    
    return {
      waitlist,
      vendors,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error exporting submissions:', error);
    throw error;
  }
}

