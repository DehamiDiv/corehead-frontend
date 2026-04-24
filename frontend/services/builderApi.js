// services/builderApi.js  (Next.js frontend)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const builderApi = {
  // Save a layout
  saveLayout: async ({ name, layout_data, content_mode, grid_layout }) => {
    const res = await fetch(`${BASE_URL}/builder/layouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, layout_data, content_mode, grid_layout }),
    });
    if (!res.ok) throw new Error('Failed to save layout');
    return res.json();
  },

  // Get all layouts
  getLayouts: async () => {
    const res = await fetch(`${BASE_URL}/builder/layouts`);
    if (!res.ok) throw new Error('Failed to fetch layouts');
    return res.json();
  },

  // Get single layout by ID
  getLayout: async (id) => {
    const res = await fetch(`${BASE_URL}/builder/layouts/${id}`);
    if (!res.ok) throw new Error('Layout not found');
    return res.json();
  },

  // Update layout
  updateLayout: async (id, data) => {
    const res = await fetch(`${BASE_URL}/builder/layouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update layout');
    return res.json();
  },

  // Delete layout
  deleteLayout: async (id) => {
    const res = await fetch(`${BASE_URL}/builder/layouts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete layout');
    return res.json();
  },
};