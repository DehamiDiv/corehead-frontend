const BASE_URL = 'http://localhost:5000/api';

// getAuthHeader: Helper function to attach the JWT token to outgoing API requests.
// This allows the backend to verify the user's identity and role via authMiddleware.
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

  async deleteTemplate(id: string) {
    const res = await fetch(`${BASE_URL}/templates/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete template');
    }
    return res.json();
  },

  async publishTemplate(id: string) {
    const res = await fetch(`${BASE_URL}/templates/${id}/publish`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to publish template');
    }
    return res.json();
  },

  async assignTemplate(id: string, data: { categoryId?: string; isGlobalDefault?: boolean }) {
    const res = await fetch(`${BASE_URL}/templates/${id}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign template');
    }
    return res.json();
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

  async register(data: { email: string, password: string }) {
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

  // AI Layouts
  async generateLayout(data: { prompt: string, layoutType: string, designStyle: string, features?: any }) {
    const res = await fetch(`${BASE_URL}/ai/generate-layout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI generation failed');
    }
    return res.json();
  },

  async getAiHistory(limit: number = 50) {
    const res = await fetch(`${BASE_URL}/ai/history?limit=${limit}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch AI history');
    return res.json();
  },

  // Users
  async getUsers() {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async inviteUser(data: { email: string, role: string }) {
    const res = await fetch(`${BASE_URL}/users/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to invite user');
    }
    return res.json();
  },

  async updateUser(id: string | number, data: { email?: string, role?: string, password?: string, name?: string, designation?: string, bio?: string, avatar?: string }) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update user');
    }
    return res.json();
  },

  async deleteUser(id: string | number) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete user');
    }
    return res.json();
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
  }
};
