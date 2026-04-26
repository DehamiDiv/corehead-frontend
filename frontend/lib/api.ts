import { BuilderBlock } from './types';

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
    const res = await fetch(`${BASE_URL}/blog/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  },

  async getPublicLayout(type: 'blog-loop' | 'single-post'): Promise<BuilderBlock[]> {
    if (type === 'blog-loop') {
      return [
        { 
          id: 'hero', 
          type: 'Container', 
          styles: { padding: '4rem 1rem', background: 'linear-gradient(to right, #1e3a8a, #3b82f6)', borderRadius: '0 0 2rem 2rem', marginBottom: '3rem', textAlign: 'center', color: 'white' },
          parentId: undefined 
        },
        { id: 'h1', type: 'Heading', content: 'Our Blog: Insights & Updates', styles: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }, parentId: 'hero' },
        { id: 'p1', type: 'Paragraph', content: 'Discover the latest news, tutorials, and insights from our team.', styles: { fontSize: '1.25rem', color: '#bfdbfe', maxWidth: '600px', margin: '0 auto' }, parentId: 'hero' },
        { id: 'c1', type: 'Collection List', content: { limit: 16 }, parentId: undefined }
      ] as BuilderBlock[];
    } else {
      return [
        {
          id: 'article-container',
          type: 'Container',
          styles: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' },
          parentId: undefined
        },
        { id: 'category', type: 'Heading', bindings: { content: 'post.category' }, styles: { fontSize: '0.875rem', fontWeight: '600', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }, parentId: 'article-container' },
        { id: 'h1', type: 'Heading', bindings: { content: 'post.title' }, styles: { fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', color: '#111827', marginBottom: '1.5rem' }, parentId: 'article-container' },
        {
          id: 'meta-container',
          type: 'Container',
          styles: { display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem' },
          parentId: 'article-container'
        },
        { id: 'author-name', type: 'Paragraph', bindings: { content: 'post.author.name' }, styles: { fontWeight: '600', color: '#374151', margin: 0 }, parentId: 'meta-container' },
        { id: 'date', type: 'Paragraph', bindings: { content: 'post.createdAt' }, styles: { color: '#6b7280', fontSize: '0.875rem', margin: 0 }, parentId: 'meta-container' },
        { id: 'img1', type: 'Image', bindings: { content: 'post.coverImage' }, styles: { width: '100%', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '3rem' }, parentId: 'article-container' },
        { id: 'content', type: 'RichText', bindings: { content: 'post.content' }, parentId: 'article-container' }
      ] as BuilderBlock[];
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
  }
};
