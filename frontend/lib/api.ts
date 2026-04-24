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
          { type: 'heading', content: '<h1>Latest Posts</h1>' },
          { type: 'loop', cardTemplate: '<a href="/blog/{{ slug }}" class="post-link"><article class="post-card"><img src="{{ imageUrl }}" /><h3>{{ title }}</h3><p>{{ excerpt }}</p><span>{{ author.name }}</span></article></a>' }
        ]
      };
    } else {
      return {
         blocks: [
           { type: 'hero', content: '<div class="post-hero"><img src="{{ imageUrl }}" /><h1>{{ title }}</h1><p class="category">{{ category }}</p></div>' },
           { type: 'html', content: '<div class="post-body">{{ content }}</div>' },
           { type: 'authorbox', content: '<div class="author-box"><h4>Written by {{ author.name }}</h4><p>{{ author.bio }}</p></div>' }
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
  }
};
