const BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

export const api = {
  // Templates
  async getTemplates() {
    const res = await fetch(`${BASE_URL}/templates`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  async getTemplateById(id: string) {
    const res = await fetch(`${BASE_URL}/templates/${id}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
  },

  async createTemplate(data: { name: string, type: string, layoutJson: any, status?: string }) {
    const res = await fetch(`${BASE_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create template');
    }
    return res.json();
  },

  async updateTemplate(id: string, data: { name?: string, type?: string, layoutJson?: any, status?: string }) {
    const res = await fetch(`${BASE_URL}/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update template');
    }
    return res.json();
  },

  // Preview Data
  async getPreviewPosts(limit: number = 3) {
    const res = await fetch(`${BASE_URL}/preview/posts?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch preview posts');
    return res.json();
  }
};
