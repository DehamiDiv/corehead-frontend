const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

export const aiApi = {
  generateLayout: async ({ prompt, layoutType, designStyle, features }) => {
    const res = await fetch(`${BASE_URL}/ai/generate-layout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ prompt, layoutType, designStyle, features }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to generate layout');
    }

    return res.json();
  },

  getHistory: async (limit = 50) => {
    const res = await fetch(`${BASE_URL}/ai/history?limit=${limit}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  }
}; 