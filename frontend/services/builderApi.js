// services/builderApi.js  (Next.js frontend)
import { api } from '../lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const builderApi = {
  // Save a layout
  saveLayout: async ({ name, layout_data, content_mode, grid_layout }) => {
    return api.fetchWithAuth(`${BASE_URL}/builder/layouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, layout_data, content_mode, grid_layout }),
    });
  },

  // Get all layouts
  getLayouts: async () => {
    return api.fetchWithAuth(`${BASE_URL}/builder/layouts`);
  },

  // Get single layout by ID
  getLayout: async (id) => {
    return api.fetchWithAuth(`${BASE_URL}/builder/layouts/${id}`);
  },

  // Update layout
  updateLayout: async (id, data) => {
    return api.fetchWithAuth(`${BASE_URL}/builder/layouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  // Delete layout
  deleteLayout: async (id) => {
    return api.fetchWithAuth(`${BASE_URL}/builder/layouts/${id}`, {
      method: 'DELETE'
    });
  },

  // AI Layout Generation
  generateAILayout: async (data) => {
    return api.fetchWithAuth(`${BASE_URL}/ai/generate-layout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
};
