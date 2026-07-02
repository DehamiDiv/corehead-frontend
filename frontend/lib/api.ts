const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// getAuthHeader: Helper function to attach the JWT token to outgoing API requests.
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

// handleResponse: Centralized response handler — now supports auto-refresh on 401
const handleResponse = async (res: Response, originalRequest: () => Promise<any>): Promise<any> => {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Attempt to get a new access token
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const { accessToken } = await refreshRes.json();
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request
            return originalRequest();
          }
        } catch (err) {
          console.error("Refresh token failed", err);
        }
      }

      // If refresh fails or no refresh token, log out
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    try {
      const errData = await res.json();
      throw new Error(errData.details || errData.error || `Request failed with status ${res.status}`);
    } catch {
      throw new Error(`Request failed with status ${res.status}`);
    }
  }
  return res.json();
};

export const api = {
  // Helper to wrap fetch with auth and auto-refresh
  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const execute = async () => {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...getAuthHeader()
        }
      });
      return handleResponse(res, execute);
    };
    return execute();
  },

  // Templates
  async getTemplates() {
    return this.fetchWithAuth(`${BASE_URL}/templates`);
  },

  async getTemplateById(id: string) {
    return this.fetchWithAuth(`${BASE_URL}/templates/${id}`);
  },

  async createTemplate(data: { name: string, type: string, layoutJson: any, status?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateTemplate(id: string, data: { name?: string, type?: string, layoutJson?: any, status?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteTemplate(id: string) {
    return this.fetchWithAuth(`${BASE_URL}/templates/${id}`, {
      method: 'DELETE'
    });
  },

  async publishTemplate(id: string) {
    return this.fetchWithAuth(`${BASE_URL}/templates/${id}/publish`, {
      method: 'PATCH'
    });
  },

  async assignTemplate(id: string, data: { categoryId?: string; isGlobalDefault?: boolean }) {
    return this.fetchWithAuth(`${BASE_URL}/templates/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Preview Data
  async getPreviewPosts(limit: number = 3) {
    const res = await fetch(`${BASE_URL}/preview/posts?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch preview posts');
    return res.json();
  },

  async getBindings() {
    const res = await fetch(`${BASE_URL}/bindings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch bindings');
    return res.json();
  },

  // Posts Management
  async getPosts() {
    const res = await fetch(`${BASE_URL}/posts`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPostById(id: string | number) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  },

  async updatePost(id: string | number, data: any) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  },

  async createPost(data: any) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async deletePost(id: string | number) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  async getPostBySlug(slug: string) {
    const res = await fetch(`${BASE_URL}/posts/slug/${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch post by slug');
    }
    return res.json();
  },

  async getPublicLayout(type: 'blog-loop' | 'single-post') {
    if (type === 'blog-loop') {
      return {
        blocks: [
          { id: '1', type: 'Heading' as const, content: 'Latest Posts' },
          { id: '2', type: 'Collection List' as const, content: { limit: 6, category: '' } }
        ]
      };
    } else {
      return {
         blocks: [
           { id: '1', type: 'Image' as const, content: '', bindings: { content: 'featured_image' } },
           { id: '2', type: 'Heading' as const, content: '', bindings: { content: 'title' } },
           { id: '3', type: 'Paragraph' as const, content: '', bindings: { content: 'category' }, styles: { color: 'blue', textTransform: 'uppercase' } },
           { id: '4', type: 'Paragraph' as const, content: '', bindings: { content: 'content' } }
         ]
      };
    }
  },

  // Auth
  async login(credentials: { email: string, password: string }) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: { email: string, password: string, name?: string }) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send reset email');
    }
    return res.json();
  },

  async resetPassword(data: { token: string, password: string }) {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to reset password');
    }
    return res.json();
  },

  // Auth/Verify & AI functions from auth-complete
  async verifyEmail(data: { email: string, otp: string }) {
    const res = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Verification failed');
    }
    return res.json();
  },

  // Users
  async getUsers() {
    return this.fetchWithAuth(`${BASE_URL}/users`);
  },

  async inviteUser(data: { email: string, role: string, name?: string, nicename?: string, designation?: string, bio?: string, password?: string, avatar?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/users/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateUser(id: string | number, data: { email?: string, role?: string, password?: string, name?: string, designation?: string, bio?: string, avatar?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteUser(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/users/${id}`, {
      method: 'DELETE'
    });
  },

  // Pages
  async getPages() {
    const res = await fetch(`${BASE_URL}/pages`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
  },

  async createPage(data: { name: string, slug: string, htmlContent: string, status: string }) {
    const res = await fetch(`${BASE_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create page');
    }
    return res.json();
  },

  async updatePage(id: string | number, data: { name?: string, slug?: string, htmlContent?: string, status?: string }) {
    const res = await fetch(`${BASE_URL}/pages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update page');
    }
    return res.json();
  },

  async deletePage(id: string | number) {
    const res = await fetch(`${BASE_URL}/pages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete page');
    }
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(data: { name: string, slug: string, description?: string }) {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create category');
    }
    return res.json();
  },

  async updateCategory(id: string | number, data: { name?: string, slug?: string, description?: string }) {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update category');
    }
    return res.json();
  },

  async deleteCategory(id: string | number) {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete category');
    }
    return res.json();
  },

  // Settings
  async getSetting(key: string) {
    const res = await fetch(`${BASE_URL}/settings?key=${key}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch setting');
    const data = await res.json();
    return data.setting?.value || null;
  },

  async updateSetting(key: string, value: any) {
    const res = await fetch(`${BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ value })
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
  },

  // Media Library
  async getMedia() {
    const res = await fetch(`${BASE_URL}/media`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  },

  async getTrash() {
    const res = await fetch(`${BASE_URL}/media/trash`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch trash');
    return res.json();
  },

  async uploadMedia(data: { name: string, type: string, size: string, base64Data: string }) {
    const res = await fetch(`${BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async moveToTrash(id: number | string) {
    const res = await fetch(`${BASE_URL}/media/${id}/trash`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to move to trash');
    return res.json();
  },

  async restoreFromTrash(id: number | string) {
    const res = await fetch(`${BASE_URL}/media/${id}/restore`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to restore media');
    return res.json();
  },

  async deleteMediaPermanently(id: number | string) {
    const res = await fetch(`${BASE_URL}/media/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete media permanently');
    return res.json();
  },

  // Interactions / Comments
  async getComments() {
    const res = await fetch(`${BASE_URL}/comments`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  async updateComment(id: number | string, data: { status?: string, content?: string }) {
    const res = await fetch(`${BASE_URL}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update comment');
    return res.json();
  },

  async deleteComment(id: number | string) {
    const res = await fetch(`${BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
  },

  // AI Layouts
  async generateLayout(data: { prompt: string, layoutType: string, designStyle: string, features?: any }) {
    return this.fetchWithAuth(`${BASE_URL}/ai/generate-layout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getAiHistory(limit: number = 50) {
    return this.fetchWithAuth(`${BASE_URL}/ai/history?limit=${limit}`);
  }
};
