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

  // Public Facing / Receiver Mock Endpoints
  async getPostBySlug(slug: string) {
    return {
      id: `mock-${slug}`,
      title: `The Ultimate Guide to ${slug.replace(/-/g, ' ')}`,
      slug: slug,
      excerpt: "This is a dynamically retrieved excerpt based on the slug.",
      content: "<p>This is the full rich-text <strong>content</strong> of the blog post. It goes into extreme detail about the particular subject matter.</p><p>This should be rendered dynamically.</p>",
      imageUrl: "https://picsum.photos/1200/600",
      createdAt: new Date().toISOString(),
      category: "Development",
      author: { name: "System Admin", bio: "Tech enthusiast" }
    };
  },

  async getPublicLayout(type: 'blog-loop' | 'single-post') {
    // Map the internal type to the backend's expected type name
    const apiType = type === 'single-post' ? 'Single Post' : 'Blog Loop';
    const res = await fetch(`${BASE_URL}/templates?type=${encodeURIComponent(apiType)}&status=published`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch public layout');
    }
    // Assuming the backend returns a layout object with a `blocks` field
    return res.json();
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

  async getUsers() {
    return this.fetchWithAuth(`${BASE_URL}/users`);
  },

  async updateUser(id: number, data: { name?: string, role?: string, status?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteUser(id: number) {
    return this.fetchWithAuth(`${BASE_URL}/users/${id}`, {
      method: 'DELETE'
    });
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
