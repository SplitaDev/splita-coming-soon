// API service for submitting to Resend audiences

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.splita.co'; // Update with your actual API URL

export interface StatsData {
  signups: number;
  waitlist: number;
  cities: number;
}

export async function fetchStats(): Promise<StatsData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      signups: data.signups || 0,
      waitlist: data.waitlist || 0,
      cities: data.cities || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return fallback values if API fails
    return {
      signups: 3424,
      waitlist: 23,
      cities: 1,
    };
  }
}

export async function submitWaitlist(email: string, userType: string, vibe?: string): Promise<boolean> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Submit to API which adds to Resend audience
    const response = await fetch(`${API_BASE_URL}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        userType,
        vibe,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add to waitlist');
    }

    await response.json(); // Consume response
    
    // Email is now sent automatically by the server when adding to audience
    // No need to send separately from frontend

    return true;
  } catch (error) {
    console.error('Error submitting waitlist:', error);
    throw error; // Re-throw to allow form to handle error message
  }
}

export async function submitVendor(email: string): Promise<boolean> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Submit to API which adds to Resend audience
    const response = await fetch(`${API_BASE_URL}/api/vendor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add to vendor list');
    }

    await response.json(); // Consume response
    
    // Email is now sent automatically by the server when adding to audience
    // No need to send separately from frontend

    return true;
  } catch (error) {
    console.error('Error submitting vendor:', error);
    throw error; // Re-throw to allow form to handle error message
  }
}


