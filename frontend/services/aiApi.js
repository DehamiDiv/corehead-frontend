const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (!token) return {};
    const headers = { 'Authorization': `Bearer ${token}` };
    const siteId = localStorage.getItem('currentSiteId');
    if (siteId) headers['X-Site-Id'] = siteId;
    return headers;
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
      cache: 'no-store',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  deleteHistory: async (id) => {
    const res = await fetch(`${BASE_URL}/ai/history/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete history');
    return res.json();
  },

  updateHistory: async (id, prompt) => {
    const res = await fetch(`${BASE_URL}/ai/history/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Failed to update history');
    return res.json();
  },

  promoteHistory: async (id, name) => {
    const res = await fetch(`${BASE_URL}/ai/history/${id}/promote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(name ? { name } : {}),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to save layout to the library');
    }
    return res.json();
  },

  generateBlogContent: async ({ topic, tone, keywords, wordCount }) => {
    const res = await fetch(`${BASE_URL}/ai/generate-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ topic, tone, keywords, wordCount }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to generate blog content');
    }

    return res.json();
  },

  modifyLayout: async ({ currentBlocks, instruction }) => {
    const res = await fetch(`${BASE_URL}/ai/modify-layout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ currentBlocks, instruction }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || err.message || 'Failed to modify layout');
    }

    return res.json();
  }
}; 
