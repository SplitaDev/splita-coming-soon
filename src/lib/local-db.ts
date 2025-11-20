// Local IndexedDB database for storing form submissions
// This stores all form data locally in the browser

interface WaitlistSubmission {
  id?: number;
  email: string;
  userType: string;
  vibe?: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  screenWidth?: number;
  screenHeight?: number;
  createdAt: string;
}

interface VendorSubmission {
  id?: number;
  email: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  screenWidth?: number;
  screenHeight?: number;
  createdAt: string;
}

const DB_NAME = 'SplitaSubmissions';
const DB_VERSION = 1;
const WAITLIST_STORE = 'waitlist';
const VENDOR_STORE = 'vendors';

// Initialize database
export async function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create waitlist store
      if (!db.objectStoreNames.contains(WAITLIST_STORE)) {
        const waitlistStore = db.createObjectStore(WAITLIST_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        waitlistStore.createIndex('email', 'email', { unique: false });
        waitlistStore.createIndex('timestamp', 'timestamp', { unique: false });
        waitlistStore.createIndex('userType', 'userType', { unique: false });
        waitlistStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create vendor store
      if (!db.objectStoreNames.contains(VENDOR_STORE)) {
        const vendorStore = db.createObjectStore(VENDOR_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        vendorStore.createIndex('email', 'email', { unique: false });
        vendorStore.createIndex('timestamp', 'timestamp', { unique: false });
        vendorStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

// Get browser metadata
function getBrowserMetadata() {
  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
  };
}

// Save waitlist submission
export async function saveWaitlistSubmission(
  email: string,
  userType: string,
  vibe?: string
): Promise<number> {
  try {
    const db = await initDatabase();
    const metadata = getBrowserMetadata();

    const submission: WaitlistSubmission = {
      email: email.trim().toLowerCase(),
      userType,
      vibe: vibe || undefined,
      timestamp: new Date().toISOString(),
      userAgent: metadata.userAgent,
      referrer: metadata.referrer,
      screenWidth: metadata.screenWidth,
      screenHeight: metadata.screenHeight,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WAITLIST_STORE], 'readwrite');
      const store = transaction.objectStore(WAITLIST_STORE);
      const request = store.add(submission);

      request.onsuccess = () => {
        console.log('✅ Waitlist submission saved locally:', request.result);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('❌ Failed to save waitlist submission:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error saving waitlist submission:', error);
    throw error;
  }
}

// Save vendor submission
export async function saveVendorSubmission(email: string): Promise<number> {
  try {
    const db = await initDatabase();
    const metadata = getBrowserMetadata();

    const submission: VendorSubmission = {
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
      userAgent: metadata.userAgent,
      referrer: metadata.referrer,
      screenWidth: metadata.screenWidth,
      screenHeight: metadata.screenHeight,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VENDOR_STORE], 'readwrite');
      const store = transaction.objectStore(VENDOR_STORE);
      const request = store.add(submission);

      request.onsuccess = () => {
        console.log('✅ Vendor submission saved locally:', request.result);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('❌ Failed to save vendor submission:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error saving vendor submission:', error);
    throw error;
  }
}

// Get all waitlist submissions
export async function getAllWaitlistSubmissions(): Promise<WaitlistSubmission[]> {
  try {
    const db = await initDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WAITLIST_STORE], 'readonly');
      const store = transaction.objectStore(WAITLIST_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error fetching waitlist submissions:', error);
    throw error;
  }
}

// Get all vendor submissions
export async function getAllVendorSubmissions(): Promise<VendorSubmission[]> {
  try {
    const db = await initDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VENDOR_STORE], 'readonly');
      const store = transaction.objectStore(VENDOR_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error fetching vendor submissions:', error);
    throw error;
  }
}

// Get statistics
export async function getLocalStats() {
  try {
    const waitlist = await getAllWaitlistSubmissions();
    const vendors = await getAllVendorSubmissions();

    // Count unique cities (extract from email domains)
    const uniqueDomains = new Set(
      waitlist.map((w) => {
        const domain = w.email.split('@')[1];
        return domain ? domain.split('.')[0] : '';
      })
    );

    return {
      signups: waitlist.length,
      waitlist: waitlist.length,
      vendors: vendors.length,
      cities: uniqueDomains.size,
    };
  } catch (error) {
    console.error('Error getting local stats:', error);
    return {
      signups: 0,
      waitlist: 0,
      vendors: 0,
      cities: 0,
    };
  }
}

// Export all data as JSON
export async function exportAllData() {
  try {
    const waitlist = await getAllWaitlistSubmissions();
    const vendors = await getAllVendorSubmissions();

    return {
      waitlist,
      vendors,
      exportedAt: new Date().toISOString(),
      totalWaitlist: waitlist.length,
      totalVendors: vendors.length,
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

// Download data as JSON file
export async function downloadDataAsJSON() {
  try {
    const data = await exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `splita-submissions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Data downloaded as JSON');
  } catch (error) {
    console.error('Error downloading data:', error);
    throw error;
  }
}

// Clear all data (use with caution)
export async function clearAllData(): Promise<void> {
  try {
    const db = await initDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WAITLIST_STORE, VENDOR_STORE], 'readwrite');

      const waitlistRequest = transaction.objectStore(WAITLIST_STORE).clear();
      const vendorRequest = transaction.objectStore(VENDOR_STORE).clear();

      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          console.log('✅ All data cleared');
          resolve();
        }
      };

      waitlistRequest.onsuccess = checkComplete;
      vendorRequest.onsuccess = checkComplete;

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}

