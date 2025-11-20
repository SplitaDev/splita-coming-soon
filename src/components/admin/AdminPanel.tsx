// Simple admin panel to access local database
// Access by adding ?admin=true to the URL
import { useState, useEffect } from 'react';
import { ViewSubmissions } from './ViewSubmissions';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check URL for admin parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdmin(true);
      setIsOpen(true);
    }
  }, []);

  if (!showAdmin) {
    return null;
  }

  return (
    <>
      {/* Floating Admin Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 glass-panel p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          title="View Local Database"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[rgb(var(--primary))]"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      )}

      {/* Admin Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Local Database Admin</h2>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ViewSubmissions />
          </div>
        </div>
      )}
    </>
  );
}

