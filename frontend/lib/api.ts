import { getSiteHeader } from '@/lib/siteStorage';
import { clearSession, persistAccessToken } from '@/lib/authSession';

import { getApiBaseUrl } from '@/lib/apiOrigin';

const BASE_URL = getApiBaseUrl();

export type SiteSummary = {
  id: number;
  name: string;
  slug: string;
  status?: string;
  logo?: string | null;
  ownerId?: number;
  /** R6 */
  customDomain?: string | null;
  domainStatus?: string;
  plan?: string;
  planStatus?: string;
};

// getAuthHeader: Helper function to attach the JWT token to outgoing API requests.
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

/**
 * Auth + multi-tenant site headers (T7).
 * Pass skipSite for /sites CRUD and auth endpoints that must not send X-Site-Id.
 */
const getRequestHeaders = (options?: {
  skipSite?: boolean;
  json?: boolean;
}): Record<string, string> => {
  const headers: Record<string, string> = {
    ...getAuthHeader(),
  };
  if (options?.json) {
    headers['Content-Type'] = 'application/json';
  }
  if (!options?.skipSite) {
    Object.assign(headers, getSiteHeader());
  }
  return headers;
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
            const body = await refreshRes.json();
            const accessToken = body.accessToken;
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
              // R5-1: keep middleware cookie in sync with refreshed JWT
              persistAccessToken(accessToken);
              // Retry the original request
              return originalRequest();
            }
          }
        } catch (err) {
          console.error("Refresh token failed", err);
        }
      }

      // If refresh fails or no refresh token, log out
      clearSession();
      window.location.href = '/login?session=expired';
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    try {
      const errData = await res.json();
      const errMsg = errData.details || errData.error || errData.message || `Request failed with status ${res.status}`;
      const err = new Error(errMsg);
      (err as any).status = res.status;
      (err as any).data = errData;
      throw err;
    } catch (e: any) {
      if (e.status || (e?.message && e.message !== `Request failed with status ${res.status}`)) throw e;
      throw new Error(`Request failed with status ${res.status}`);
    }
  }
  return res.json();
};

type FetchAuthOptions = RequestInit & { skipSite?: boolean };

export const api = {
  // Helper to wrap fetch with auth, site context, and auto-refresh
  async fetchWithAuth(url: string, options: FetchAuthOptions = {}) {
    const { skipSite, headers: optionHeaders, ...rest } = options;
    const execute = async () => {
      const res = await fetch(url, {
        ...rest,
        headers: {
          ...getRequestHeaders({ skipSite }),
          ...(optionHeaders as Record<string, string> | undefined),
        }
      });
      return handleResponse(res, execute);
    };
    return execute();
  },

  // ── Sites (T3/T7) — no X-Site-Id on list/create ──────────────────────────
  async getMySites() {
    return this.fetchWithAuth(`${BASE_URL}/sites`, {
      skipSite: true,
      cache: 'no-store',
    });
  },

  async createSite(data: { name: string; slug: string; logo?: string | null }) {
    return this.fetchWithAuth(`${BASE_URL}/sites`, {
      method: 'POST',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async getSiteById(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${id}`, { skipSite: true });
  },

  /**
   * Silent membership check for public-site chrome.
   * Unlike fetchWithAuth, a stale or unrelated session must not redirect a
   * public reader away from the site. The protected site endpoint remains the
   * authority and returns the site only to an owner/member/platform admin.
   */
  async getManageableSite(id: string | number): Promise<SiteSummary | null> {
    const authHeaders = getAuthHeader();
    if (!authHeaders.Authorization) return null;

    const res = await fetch(`${BASE_URL}/sites/${id}`, {
      cache: 'no-store',
      headers: authHeaders,
    });
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      return null;
    }
    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    const site = data?.site ?? data;
    return site?.id ? site : null;
  },

  async getSiteBySlug(slug: string) {
    const res = await fetch(`${BASE_URL}/sites/by-slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch site');
    }
    return res.json();
  },

  async updateSite(
    id: string | number,
    data: { name?: string; slug?: string; logo?: string | null; status?: string }
  ) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${id}`, {
      method: 'PATCH',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteSite(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${id}`, {
      method: 'DELETE',
      skipSite: true,
    });
  },

  // ── R1-3 Team invites ────────────────────────────────────────────────────
  async getSiteMembers(siteId: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/members`, {
      skipSite: true,
      cache: 'no-store',
    });
  },

  async inviteSiteMember(
    siteId: string | number,
    data: { email: string; role: 'EDITOR' | 'AUTHOR' | string }
  ) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/members/invite`, {
      method: 'POST',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateSiteMemberRole(
    siteId: string | number,
    userId: string | number,
    role: 'EDITOR' | 'AUTHOR' | string
  ) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/members/${userId}`, {
      method: 'PATCH',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
  },

  async removeSiteMember(siteId: string | number, userId: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/members/${userId}`, {
      method: 'DELETE',
      skipSite: true,
    });
  },

  async getSiteInvites(siteId: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/invites`, {
      skipSite: true,
      cache: 'no-store',
    });
  },

  async revokeSiteInvite(siteId: string | number, inviteId: string | number) {
    return this.fetchWithAuth(
      `${BASE_URL}/sites/${siteId}/invites/${inviteId}`,
      {
        method: 'DELETE',
        skipSite: true,
      }
    );
  },

  async getInviteByToken(token: string) {
    const res = await fetch(`${BASE_URL}/invites/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invite not found');
    }
    return res.json();
  },

  async acceptInvite(token: string) {
    return this.fetchWithAuth(
      `${BASE_URL}/invites/${encodeURIComponent(token)}/accept`,
      {
        method: 'POST',
        skipSite: true,
      }
    );
  },

  // ── R6 Custom domain + billing ───────────────────────────────────────────
  async getSiteByDomain(domain: string) {
    const res = await fetch(
      `${BASE_URL}/sites/by-domain/${encodeURIComponent(domain)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to resolve domain');
    }
    return res.json();
  },

  async setSiteDomain(siteId: string | number, domain: string | null) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/domain`, {
      method: 'PUT',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
  },

  async verifySiteDomain(siteId: string | number, options?: { force?: boolean }) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/domain/verify`, {
      method: 'POST',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {}),
    });
  },

  async getSiteBilling(siteId: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/billing`, {
      skipSite: true,
      cache: 'no-store',
    });
  },

  async updateSitePlan(
    siteId: string | number,
    data: { plan: string; planStatus?: string }
  ) {
    return this.fetchWithAuth(`${BASE_URL}/sites/${siteId}/billing/plan`, {
      method: 'PUT',
      skipSite: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
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

  /**
   * R2-1: Public resolve of published layout for a site (no JWT required).
   * GET /templates/resolve?templateType=...&siteId=...
   */
  async resolveActiveLayout(
    templateType: string,
    categoryId?: string | null,
    siteId?: number | null,
    templateId?: number | null,
  ) {
    const qs = new URLSearchParams();
    qs.set('templateType', templateType);
    if (categoryId) qs.set('categoryId', String(categoryId));
    if (siteId != null) qs.set('siteId', String(siteId));
    if (templateId != null) qs.set('templateId', String(templateId));

    const headers: Record<string, string> = {};
    if (siteId != null) headers['X-Site-Id'] = String(siteId);

    const res = await fetch(`${BASE_URL}/templates/resolve?${qs.toString()}`, {
      cache: 'no-store',
      headers,
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to resolve layout');
    }
    return res.json();
  },

  // Preview Data (optional site scope for multi-tenant)
  async getPreviewPosts(limit: number = 3, siteId?: number | null) {
    const headers: Record<string, string> = { ...getSiteHeader() };
    if (siteId) headers['X-Site-Id'] = String(siteId);
    const qs = new URLSearchParams({ limit: String(limit) });
    if (siteId || headers['X-Site-Id']) {
      qs.set('siteId', String(siteId || headers['X-Site-Id']));
    }
    const res = await fetch(`${BASE_URL}/preview/posts?${qs.toString()}`, {
      cache: 'no-store',
      headers,
    });
    if (!res.ok) throw new Error('Failed to fetch preview posts');
    return res.json();
  },

  async getBindings() {
    const res = await fetch(`${BASE_URL}/bindings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch bindings');
    return res.json();
  },

  // Posts Management (site-scoped via X-Site-Id)
  async getPosts(siteId?: number | null) {
    return this.fetchWithAuth(`${BASE_URL}/posts`, {
      cache: 'no-store',
      headers: siteId ? { 'X-Site-Id': String(siteId) } : undefined,
    });
  },

  async getPostById(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/posts/${id}`);
  },

  async updatePost(id: string | number, data: any) {
    return this.fetchWithAuth(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async createPost(data: any, siteId?: number | null) {
    return this.fetchWithAuth(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(siteId ? { 'X-Site-Id': String(siteId) } : {}),
      },
      body: JSON.stringify(data)
    });
  },

  async deletePost(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE'
    });
  },

  /** T11: set post status to Published (public-visible) */
  async publishPost(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/posts/${id}/publish`, {
      method: 'PATCH',
    });
  },

  /** T11: unpublish post (Draft by default; pass status: 'Unpublished' optional) */
  async unpublishPost(id: string | number, status: 'Draft' | 'Unpublished' = 'Draft') {
    return this.fetchWithAuth(`${BASE_URL}/posts/${id}/unpublish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  async getPostBySlug(slug: string, siteId?: number | null) {
    const headers: Record<string, string> = {};
    const q = siteId ? `?siteId=${siteId}` : '';
    if (siteId) headers['X-Site-Id'] = String(siteId);
    else Object.assign(headers, getSiteHeader());

    const res = await fetch(`${BASE_URL}/posts/slug/${slug}${q}`, {
      cache: 'no-store',
      headers,
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch post by slug');
    }
    return res.json();
  },

  /**
   * R2-2: Prefer live resolve when siteId provided; else safe defaults (no fake DB).
   */
  async getPublicLayout(
    type: 'blog-loop' | 'single-post',
    siteId?: number | null
  ) {
    if (siteId != null) {
      try {
        const kind = type === 'blog-loop' ? 'Blog Archive' : 'Single Post';
        const tpl = await this.resolveActiveLayout(kind, null, siteId);
        if (tpl?.layoutJson) {
          const blocks = Array.isArray(tpl.layoutJson)
            ? tpl.layoutJson
            : tpl.layoutJson.blocks;
          if (blocks?.length) return { blocks, templateId: tpl.id, source: 'template' as const };
        }
      } catch {
        /* fall through to defaults */
      }
    }

    if (type === 'blog-loop') {
      return {
        blocks: [
          { id: '1', type: 'Heading' as const, content: 'Latest Posts' },
          { id: '2', type: 'Collection List' as const, content: { limit: 6, category: '' } }
        ],
        source: 'default' as const,
      };
    }
    return {
      blocks: [
        { id: '1', type: 'Image' as const, content: '', bindings: { content: 'post.coverImage' } },
        { id: '2', type: 'Heading' as const, content: '', bindings: { content: 'post.title' } },
        { id: '3', type: 'Paragraph' as const, content: '', bindings: { content: 'post.category' }, styles: { color: 'blue', textTransform: 'uppercase' } },
        { id: '4', type: 'Paragraph' as const, content: '', bindings: { content: 'post.content' } }
      ],
      source: 'default' as const,
    };
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

  async googleLogin(data: { credential: string }) {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Google Login failed');
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

  async resendOtp(email: string) {
    const res = await fetch(`${BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to resend OTP');
    }
    return res.json();
  },

  // Users
  async getUsers() {
    return this.fetchWithAuth(`${BASE_URL}/users`, { cache: 'no-store' });
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
    return this.fetchWithAuth(`${BASE_URL}/pages`);
  },

  async createPage(data: { name: string, slug: string, htmlContent: string, status: string }) {
    return this.fetchWithAuth(`${BASE_URL}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updatePage(id: string | number, data: { name?: string, slug?: string, htmlContent?: string, status?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deletePage(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/pages/${id}`, {
      method: 'DELETE'
    });
  },

  /** R3-1: public published page for a site */
  async getPublicPage(siteId: number, pageSlug: string) {
    const qs = new URLSearchParams({ siteId: String(siteId) });
    const res = await fetch(
      `${BASE_URL}/pages/public/${encodeURIComponent(pageSlug)}?${qs.toString()}`,
      {
        cache: 'no-store',
        headers: { 'X-Site-Id': String(siteId) },
      }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to load page');
    }
    return res.json();
  },

  // Categories (site-scoped)
  async getCategories() {
    return this.fetchWithAuth(`${BASE_URL}/categories`);
  },

  async createCategory(data: { name: string, slug: string, description?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateCategory(id: string | number, data: { name?: string, slug?: string, description?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteCategory(id: string | number) {
    return this.fetchWithAuth(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Media Library (site-scoped)
  async getMedia() {
    return this.fetchWithAuth(`${BASE_URL}/media`, { cache: 'no-store' });
  },

  async getTrash() {
    return this.fetchWithAuth(`${BASE_URL}/media/trash`, { cache: 'no-store' });
  },

  async uploadMedia(data: { name: string, type: string, size: string, base64Data: string }) {
    return this.fetchWithAuth(`${BASE_URL}/media/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async moveToTrash(id: number | string) {
    return this.fetchWithAuth(`${BASE_URL}/media/${id}/trash`, {
      method: 'PATCH'
    });
  },

  async restoreFromTrash(id: number | string) {
    return this.fetchWithAuth(`${BASE_URL}/media/${id}/restore`, {
      method: 'PATCH'
    });
  },

  async deleteMediaPermanently(id: number | string) {
    return this.fetchWithAuth(`${BASE_URL}/media/${id}`, {
      method: 'DELETE'
    });
  },

  // Interactions / Comments
  async getComments() {
    return this.fetchWithAuth(`${BASE_URL}/comments`);
  },

  async updateComment(id: number | string, data: { status?: string, content?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteComment(id: number | string) {
    return this.fetchWithAuth(`${BASE_URL}/comments/${id}`, {
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

  async modifyLayout(data: { currentBlocks: any[], instruction: string }) {
    return this.fetchWithAuth(`${BASE_URL}/ai/modify-layout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async createCheckoutSession(mock: boolean = false, planType: string = "PRO") {
    return this.fetchWithAuth(`${BASE_URL}/payment/checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mock, planType })
    });
  },

  async createPayHereCheckout(planType: string = "PRO") {
    return this.fetchWithAuth(`${BASE_URL}/payment/payhere/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType })
    });
  },


  async requestDemo(data: { name: string, email: string, company?: string, message?: string }) {
    return this.fetchWithAuth(`${BASE_URL}/payment/demo-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getAiHistory(limit: number = 50) {
    return this.fetchWithAuth(`${BASE_URL}/ai/history?limit=${limit}`);
  },

  // Settings (site-scoped)
  async getSetting(key: string) {
    try {
      const data = await this.fetchWithAuth(
        `${BASE_URL}/settings?key=${encodeURIComponent(key)}`,
        { cache: 'no-store' }
      );
      const rawValue = data?.setting?.value;
      if (rawValue === undefined || rawValue === null) return null;
      // Unwrap JSON strings (handles accidental double-stringify)
      let cur: any = rawValue;
      for (let i = 0; i < 3; i += 1) {
        if (typeof cur !== 'string') break;
        const s = cur.trim();
        if (!s) break;
        if (!(s.startsWith('{') || s.startsWith('[') || s.startsWith('"'))) break;
        try {
          cur = JSON.parse(s);
        } catch {
          break;
        }
      }
      return cur;
    } catch (err: any) {
      if (String(err?.message || '').includes('404')) return null;
      throw err;
    }
  },

  async updateSetting(key: string, value: any) {
    return this.fetchWithAuth(`${BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // Backend stores value as a JSON string
      body: JSON.stringify({ value: typeof value === 'string' ? value : JSON.stringify(value) })
    });
  },

  async saveAppearanceDraft(draft: Record<string, unknown>) {
    return this.fetchWithAuth(`${BASE_URL}/settings/appearance/draft`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
  },

  async applyAppearanceDraft(draft: Record<string, unknown>) {
    return this.fetchWithAuth(`${BASE_URL}/settings/appearance/apply`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
  },

  /**
   * Public newsletter subscription for tenant sites (e.g. Verdura).
   * 
   * Tries local Next.js API route first (so we can send real emails via Nodemailer).
   * Falls back to backend if the local route is unavailable.
   */
  async subscribeToNewsletter(
    email: string, 
    siteSlug?: string, 
    siteId?: number | string,
    siteName?: string
  ) {
    // 1. Try local Next.js route first (app/api/newsletter/subscribe)
    try {
      const localRes = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, siteSlug, siteId, siteName }),
      });

      if (localRes.ok) {
        return await localRes.json();
      }
      // If local route returned error, fall through to try backend
    } catch {
      // Local route not reachable in this context, try backend
    }

    // 2. Fallback to backend
    try {
      const res = await fetch(`${BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, siteSlug, siteId, siteName }),
      });
      if (!res.ok) {
        return { success: true, demo: true };
      }
      return await res.json();
    } catch (_e) {
      return { success: true, demo: true };
    }
  },

  async subscribeNewsletter(email: string) {
    return this.fetchWithAuth(`${BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      skipSite: true
    });
  },

  async notifySubscribersNewPost(postData: {
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    siteSlug: string;
    siteName: string;
    siteId?: string | number;
  }) {
    try {
      const res = await fetch('/api/newsletter/notify-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      return await res.json();
    } catch (_e) {
      return { success: false, error: 'Failed to dispatch post alerts' };
    }
  }
};
