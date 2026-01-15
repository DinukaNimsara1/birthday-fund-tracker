// Storage utility for handling data persistence via the backend API (MySQL)
// Supports both build-time (Vite) and runtime (Azure Static Web Apps) configuration

// Try build-time env var first (Vite), then runtime config, then fallback to localhost
const getApiBase = () => {
  // Build-time variable (set during Azure Static Web Apps build)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Runtime configuration (for Azure Static Web Apps - can be set via window)
  if (typeof window !== 'undefined' && window.APP_CONFIG?.API_URL) {
    return window.APP_CONFIG.API_URL;
  }
  
  // Fallback for local development
  return 'http://localhost:4000';
};

const API_BASE = getApiBase();

export const storage = {
  async get(key) {
    try {
      const res = await fetch(`${API_BASE}/api/storage/${encodeURIComponent(key)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const data = await res.json();
      // data.value is stored as JSON in MySQL, but the existing app expects .value to be a JSON string
      return { value: JSON.stringify(data.value) };
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key, value) {
    try {
      // value is already a JSON string everywhere we call storage.set
      const parsed = JSON.parse(value);
      const res = await fetch(`${API_BASE}/api/storage/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsed }),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const data = await res.json();
      return { key: data.key, value: JSON.stringify(data.value) };
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  },

  async delete(key) {
    try {
      const res = await fetch(`${API_BASE}/api/storage/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      return { key, deleted: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  },
};

// Make it available globally for consistency with the artifact version
if (typeof window !== 'undefined') {
  window.storage = storage;
}