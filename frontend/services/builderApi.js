// services/builderApi.js  (Next.js frontend)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found in localStorage');
        return {};
    }
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

export const builderApi = {
  // Save a layout
  saveLayout: async ({ name, layout_data, content_mode, grid_layout }) => {
    const res = await fetch(`${BASE_URL}/builder/layouts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ name, layout_data, content_mode, grid_layout }),
    });
    if (!res.ok) throw new Error('Failed to save layout');
    return res.json();
  },

  // Get all layouts
  getLayouts: async () => {
    const res = await fetch(`${BASE_URL}/builder/layouts`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch layouts');
    return res.json();
  },

  // Get single layout by ID
  getLayout: async (id) => {
    const res = await fetch(`${BASE_URL}/builder/layouts/${id}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Layout not found');
    return res.json();
  },

  // Update layout
  updateLayout: async (id, data) => {
    const res = await fetch(`${BASE_URL}/builder/layouts/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update layout');
    return res.json();
  },

  // Delete layout
  deleteLayout: async (id) => {
    const res = await fetch(`${BASE_URL}/builder/layouts/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete layout');
    return res.json();
  },

  // AI Layout Generation
  generateAILayout: async (data) => {
    const res = await fetch(`${BASE_URL}/ai/generate-layout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errObj = await res.json().catch(() => ({}));
        throw new Error(errObj.error || errObj.message || 'Failed to generate AI layout');
    }
    return res.json();
  },
};