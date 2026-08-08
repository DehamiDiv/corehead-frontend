"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  LogIn,
  AlertTriangle,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

type InvitePreview = {
  email: string;
  role: string;
  expiresAt?: string;
  site?: { id: number; name: string; slug: string };
  inviter?: { name?: string | null; email?: string };
};

/**
 * R1-3: Accept a site team invite via token link.
 */
export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = String(params?.token || "");

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [done, setDone] = useState<{ message: string; siteSlug?: string } | null>(
    null,
  );
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setLoggedInEmail(u?.email || null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setError("Invalid invite link");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getInviteByToken(token);
        if (!cancelled) setInvite(res.invite || res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Invite not found or expired");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);
    try {
      const res = await api.acceptInvite(token);
      setDone({
        message: res.message || "You joined the site",
        siteSlug: res.site?.slug,
      });
      // Refresh sites list on next admin load
      setTimeout(() => {
        router.push("/admin/sites");
      }, 1800);
    } catch (e: any) {
      setError(e?.message || "Could not accept invite");
    } finally {
      setAccepting(false);
    }
  };

  const loginHref = `/login?callback=${encodeURIComponent(`/invite/${token}`)}`;
  const signupHref = `/signup?callback=${encodeURIComponent(`/invite/${token}`)}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Site invitation
          </h1>
          <p className="text-sm text-slate-500">
            Join a CoreHead workspace team
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-8 text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm">Loading invite…</p>
          </div>
        )}

        {!loading && error && !done && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && invite && !done && (
          <>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-2 text-sm">
              <p className="text-slate-600">
                You&apos;re invited to{" "}
                <span className="font-bold text-slate-900">
                  {invite.site?.name || "a site"}
                </span>
              </p>
              <p className="text-slate-500">
                Role:{" "}
                <span className="font-bold text-blue-600">{invite.role}</span>
              </p>
              <p className="text-slate-500">
                For:{" "}
                <span className="font-mono text-slate-800">{invite.email}</span>
              </p>
              {invite.inviter && (
                <p className="text-xs text-slate-400">
                  Invited by{" "}
                  {invite.inviter.name || invite.inviter.email || "owner"}
                </p>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 text-center">
                  Sign in with <strong>{invite.email}</strong> to accept.
                </p>
                <Link
                  href={loginHref}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in to accept
                </Link>
                <Link
                  href={signupHref}
                  className="block text-center text-sm font-semibold text-slate-500 hover:text-blue-600"
                >
                  Create account with this email
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {loggedInEmail &&
                  loggedInEmail.toLowerCase() !==
                    invite.email.toLowerCase() && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      You are signed in as <strong>{loggedInEmail}</strong>.
                      Switch to <strong>{invite.email}</strong> to accept.
                    </div>
                  )}
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={accepting}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {accepting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accept invitation
                </button>
              </div>
            )}
          </>
        )}

        {done && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-900">{done.message}</p>
            <p className="text-sm text-slate-500">Taking you to My Sites…</p>
            <Link
              href="/admin/sites"
              className="inline-flex text-sm font-bold text-blue-600 hover:underline"
            >
              Open My Sites now
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">
            CoreHead
          </Link>
        </p>
      </div>
    </div>
  );
}
