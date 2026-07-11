"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  Check,
  Loader2,
  UserPlus,
  Users,
  Trash2,
  Mail,
  RefreshCw,
  Shield,
} from "lucide-react";
import { api } from "@/lib/api";
import { useSite } from "@/components/admin/SiteContext";
import EmptyState from "@/components/ui/EmptyState";

type Member = {
  id: number;
  role: string;
  userId: number;
  createdAt?: string;
  user?: {
    id: number;
    email: string;
    name?: string | null;
    avatar?: string | null;
  };
};

type Invite = {
  id: number;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  inviteLink?: string;
  inviter?: { name?: string | null; email?: string };
};

/**
 * R1-3 — Site team: members + email invites for the current workspace.
 */
export default function TeamPage() {
  const { currentSite, currentSiteId, loading: siteLoading } = useSite();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "AUTHOR">("EDITOR");
  const [inviting, setInviting] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);
  const [busyInviteId, setBusyInviteId] = useState<number | null>(null);

  const siteId = currentSiteId;

  const load = useCallback(async () => {
    if (!siteId) {
      setMembers([]);
      setInvites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        api.getSiteMembers(siteId),
        api.getSiteInvites(siteId).catch(() => ({ invites: [] })),
      ]);
      setMembers(
        Array.isArray(membersRes?.members) ? membersRes.members : [],
      );
      setInvites(Array.isArray(invitesRes?.invites) ? invitesRes.invites : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId || !email.trim()) return;
    setInviting(true);
    setError(null);
    setSuccess(null);
    setLastInviteLink(null);
    setEmailPreviewUrl(null);
    try {
      const res = await api.inviteSiteMember(siteId, {
        email: email.trim(),
        role,
      });
      // Only treat real SMTP as success for "delivered"
      if (res.emailSent === true && res.emailRealDelivery !== false) {
        setSuccess(
          res.message ||
            `Invite processed. Real email sent to ${email.trim()}.`,
        );
        setError(null);
      } else {
        // Member/invite may still succeed while email is dev-only / failed
        setSuccess(res.message || "Invite saved.");
        setError(
          res.emailError ||
            "Email was NOT delivered to a real inbox. Configure EMAIL_HOST / EMAIL_USER / EMAIL_PASS in CoreHead-Backend/.env (Gmail App Password), restart backend, then invite again. You can still copy the invite link below.",
        );
      }
      if (res.inviteLink) setLastInviteLink(res.inviteLink);
      if (res.emailPreviewUrl) setEmailPreviewUrl(res.emailPreviewUrl);
      setEmail("");
      await load();
    } catch (err: any) {
      setError(err?.message || "Invite failed");
    } finally {
      setInviting(false);
    }
  };

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!siteId) return;
    setBusyUserId(userId);
    setError(null);
    try {
      await api.updateSiteMemberRole(siteId, userId, newRole);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to update role");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleRemove = async (userId: number, label: string) => {
    if (!siteId) return;
    if (!confirm(`Remove ${label} from this site?`)) return;
    setBusyUserId(userId);
    setError(null);
    try {
      await api.removeSiteMember(siteId, userId);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to remove member");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleRevoke = async (inviteId: number) => {
    if (!siteId) return;
    if (!confirm("Revoke this invite?")) return;
    setBusyInviteId(inviteId);
    setError(null);
    try {
      await api.revokeSiteInvite(siteId, inviteId);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to revoke invite");
    } finally {
      setBusyInviteId(null);
    }
  };

  if (siteLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading site…
      </div>
    );
  }

  if (!siteId || !currentSite) {
    return (
      <EmptyState
        icon={Users}
        title="Select a site"
        description="Choose a site from the switcher to manage its team."
        actions={[{ label: "My Sites", href: "/admin/sites", variant: "primary" }]}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
            R1-3 · Team
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Team — {currentSite.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Invite editors and authors to this site. Owners manage membership;
            platform Users page is separate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* Invite form */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Invite teammate</h2>
            <p className="text-xs text-slate-500">
              Existing accounts join immediately. New emails get a shareable
              link.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleInvite}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "EDITOR" | "AUTHOR")}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
          >
            <option value="EDITOR">Editor</option>
            <option value="AUTHOR">Author</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="h-11 px-6 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {inviting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Invite
          </button>
        </form>

        {lastInviteLink && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Invite link
              </p>
              <code className="text-xs text-slate-600 truncate font-mono block">
                {lastInviteLink}
              </code>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(lastInviteLink)}
              className="shrink-0 p-2 rounded-lg hover:bg-white text-slate-500 hover:text-blue-600"
              title="Copy invite link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
        {emailPreviewUrl && (
          <a
            href={emailPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-bold text-blue-600 hover:underline"
          >
            Open email preview (dev) →
          </a>
        )}
      </section>

      {/* Members */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-400" />
          <h2 className="font-bold text-slate-900">Members</h2>
          <span className="text-xs font-bold text-slate-400 ml-auto">
            {members.length}
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            No members found.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {members.map((m) => {
              const isOwner = m.role === "OWNER";
              const label = m.user?.name || m.user?.email || `User #${m.userId}`;
              return (
                <li
                  key={m.id}
                  className="px-6 py-4 flex flex-wrap items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 shrink-0">
                      {(m.user?.name || m.user?.email || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {label}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {m.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        <Shield className="w-3 h-3" />
                        Owner
                      </span>
                    ) : (
                      <>
                        <select
                          value={m.role}
                          disabled={busyUserId === m.userId}
                          onChange={(e) =>
                            handleRoleChange(m.userId, e.target.value)
                          }
                          className="h-9 px-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700"
                        >
                          <option value="EDITOR">Editor</option>
                          <option value="AUTHOR">Author</option>
                        </select>
                        <button
                          type="button"
                          disabled={busyUserId === m.userId}
                          onClick={() => handleRemove(m.userId, label)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Remove member"
                        >
                          {busyUserId === m.userId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Pending invites */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Mail className="w-5 h-5 text-slate-400" />
          <h2 className="font-bold text-slate-900">Pending invites</h2>
          <span className="text-xs font-bold text-slate-400 ml-auto">
            {invites.length}
          </span>
        </div>

        {invites.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No pending invites.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="px-6 py-4 flex flex-wrap items-center gap-3 justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">{inv.email}</p>
                  <p className="text-xs text-slate-500">
                    {inv.role} · expires{" "}
                    {inv.expiresAt
                      ? new Date(inv.expiresAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {inv.inviteLink && (
                    <button
                      type="button"
                      onClick={() => handleCopy(inv.inviteLink!)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy link
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyInviteId === inv.id}
                    onClick={() => handleRevoke(inv.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Revoke invite"
                  >
                    {busyInviteId === inv.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
