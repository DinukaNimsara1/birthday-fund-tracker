// Storage utility for handling data persistence via the backend API (MySQL)
// Configuration via .env files - VITE_ENV determines dev vs prod mode

const getApiBase = () => {
  // Determine environment from VITE_ENV or Vite's built-in mode detection
  const isDevelopment = import.meta.env.VITE_ENV === 'development' || 
                         import.meta.env.VITE_ENV === undefined ||
                         import.meta.env.DEV || 
                         import.meta.env.MODE === 'development';
  
  if (isDevelopment) {
    // In development mode, use dev API URL from env or fallback to localhost
    return import.meta.env.VITE_API_URL_DEV || 'http://localhost:4000';
  }
  
  // In production, use the production API URL from env
  return import.meta.env.VITE_API_URL || 'http://localhost:4000';
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