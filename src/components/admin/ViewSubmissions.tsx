// Admin component to view all local form submissions
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  getAllWaitlistSubmissions, 
  getAllVendorSubmissions, 
  downloadDataAsJSON,
  clearAllData,
  getLocalStats
} from '@/lib/local-db';
import { Download, Trash2, RefreshCw } from 'lucide-react';

interface WaitlistSubmission {
  id?: number;
  email: string;
  userType: string;
  vibe?: string;
  timestamp: string;
  createdAt: string;
  userAgent?: string;
  referrer?: string;
  screenWidth?: number;
  screenHeight?: number;
}

interface VendorSubmission {
  id?: number;
  email: string;
  timestamp: string;
  createdAt: string;
  userAgent?: string;
  referrer?: string;
  screenWidth?: number;
  screenHeight?: number;
}

export function ViewSubmissions() {
  const [waitlist, setWaitlist] = useState<WaitlistSubmission[]>([]);
  const [vendors, setVendors] = useState<VendorSubmission[]>([]);
  const [stats, setStats] = useState({ signups: 0, waitlist: 0, vendors: 0, cities: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [waitlistData, vendorData, statsData] = await Promise.all([
        getAllWaitlistSubmissions(),
        getAllVendorSubmissions(),
        getLocalStats(),
      ]);
      setWaitlist(waitlistData);
      setVendors(vendorData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownload = async () => {
    try {
      await downloadDataAsJSON();
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data');
    }
  };

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        await clearAllData();
        await loadData();
        alert('All data cleared');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data');
      }
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 text-center">
        <p>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Local Database Submissions</h2>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={handleClear} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[rgb(var(--primary))]">{stats.signups}</p>
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Waitlist</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[rgb(var(--primary))]">{stats.vendors}</p>
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Vendors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[rgb(var(--primary))]">{stats.cities}</p>
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Cities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[rgb(var(--primary))]">{waitlist.length + vendors.length}</p>
            <p className="text-xs text-[rgb(var(--muted-foreground))]">Total</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Waitlist Submissions ({waitlist.length})</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {waitlist.length === 0 ? (
            <p className="text-sm text-[rgb(var(--muted-foreground))]">No waitlist submissions yet</p>
          ) : (
            waitlist.map((submission) => (
              <div key={submission.id} className="p-3 border border-[rgb(var(--border))] rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{submission.email}</p>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      {submission.userType} {submission.vibe ? `• ${submission.vibe}` : ''}
                    </p>
                    <p className="text-xs text-[rgb(var(--muted-foreground))]">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Vendor Submissions ({vendors.length})</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {vendors.length === 0 ? (
            <p className="text-sm text-[rgb(var(--muted-foreground))]">No vendor submissions yet</p>
          ) : (
            vendors.map((submission) => (
              <div key={submission.id} className="p-3 border border-[rgb(var(--border))] rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{submission.email}</p>
                    <p className="text-xs text-[rgb(var(--muted-foreground))]">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

