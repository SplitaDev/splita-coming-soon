# Local Database Documentation

This project uses **IndexedDB** to store all form submissions locally in the browser. This ensures that all user data is saved even if the remote API is unavailable.

## What Gets Stored

### Waitlist Submissions
- Email address
- User type (Student, Friend Group, Vendor, Creator)
- Vibe preference (Night Mode, Sea-Green Mode)
- Timestamp
- Browser metadata:
  - User agent
  - Referrer
  - Screen dimensions
  - Language
  - Platform

### Vendor Submissions
- Email address
- Timestamp
- Browser metadata (same as above)

## How It Works

1. **Automatic Storage**: When a user submits a form, the data is automatically saved to IndexedDB before attempting to send to the remote API.

2. **Dual Storage**: The system tries to save to both:
   - Local IndexedDB (always succeeds)
   - Remote API (optional, fails gracefully if unavailable)

3. **Data Persistence**: All data persists in the browser until explicitly cleared.

## Accessing the Data

### Option 1: Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Expand **IndexedDB** in the left sidebar
4. Click on **SplitaSubmissions**
5. View `waitlist` and `vendors` object stores

### Option 2: Using the Admin Component

Import and use the `ViewSubmissions` component:

```tsx
import { ViewSubmissions } from '@/components/admin/ViewSubmissions';

// In your component
<ViewSubmissions />
```

### Option 3: Programmatic Access

```typescript
import { 
  getAllWaitlistSubmissions, 
  getAllVendorSubmissions,
  exportAllData,
  downloadDataAsJSON,
  getLocalStats
} from '@/lib/local-db';

// Get all waitlist submissions
const waitlist = await getAllWaitlistSubmissions();

// Get all vendor submissions
const vendors = await getAllVendorSubmissions();

// Get statistics
const stats = await getLocalStats();

// Export all data as JSON
const data = await exportAllData();

// Download as JSON file
await downloadDataAsJSON();
```

## API Reference

### `saveWaitlistSubmission(email, userType, vibe?)`
Saves a waitlist submission to local database.

### `saveVendorSubmission(email)`
Saves a vendor submission to local database.

### `getAllWaitlistSubmissions()`
Returns all waitlist submissions as an array.

### `getAllVendorSubmissions()`
Returns all vendor submissions as an array.

### `getLocalStats()`
Returns statistics:
```typescript
{
  signups: number;
  waitlist: number;
  vendors: number;
  cities: number;
}
```

### `exportAllData()`
Exports all data as a JSON object.

### `downloadDataAsJSON()`
Downloads all data as a JSON file.

### `clearAllData()`
⚠️ **Warning**: Permanently deletes all stored data.

## Database Schema

### Waitlist Store
```typescript
{
  id: number (auto-increment),
  email: string,
  userType: string,
  vibe?: string,
  timestamp: string (ISO),
  userAgent?: string,
  referrer?: string,
  screenWidth?: number,
  screenHeight?: number,
  createdAt: string (ISO)
}
```

### Vendor Store
```typescript
{
  id: number (auto-increment),
  email: string,
  timestamp: string (ISO),
  userAgent?: string,
  referrer?: string,
  screenWidth?: number,
  screenHeight?: number,
  createdAt: string (ISO)
}
```

## Storage Limits

IndexedDB storage limits vary by browser:
- **Chrome/Edge**: ~60% of disk space
- **Firefox**: ~50% of disk space
- **Safari**: ~1GB

For typical use cases, this is more than sufficient for form submissions.

## Privacy & Security

- All data is stored **locally** in the user's browser
- Data is **not** sent to any third-party services automatically
- Users can clear their data at any time via browser settings
- The admin component allows viewing and exporting data

## Troubleshooting

### Database Not Initializing
- Check browser console for errors
- Ensure IndexedDB is supported (all modern browsers support it)
- Try clearing browser cache and reloading

### Data Not Appearing
- Check if data was actually saved (check console logs)
- Verify the database was initialized correctly
- Check browser storage settings (some browsers block IndexedDB in private mode)

### Export Not Working
- Ensure browser allows file downloads
- Check browser console for errors
- Try a different browser

## Best Practices

1. **Regular Exports**: Periodically export data to JSON files for backup
2. **Data Cleanup**: Consider implementing a cleanup function for old submissions
3. **Privacy Compliance**: Ensure you comply with privacy regulations (GDPR, CCPA, etc.)
4. **User Consent**: Inform users that data is being stored locally

