"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, User, Send, Loader2, Lock, X } from "lucide-react";
import "./CommentsSection.css";

interface Comment {
  id: number;
  content: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  status?: string;
}

interface CommentsSectionProps {
  postId: number;
  /** Optional site id for multi-tenant public APIs */
  siteId?: number | null;
  /** When false, hide form (comments disabled) */
  allowComments?: boolean;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type AccountUser = {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  image?: string;
};

function readAccountUser(): AccountUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u !== "object") return null;
    return u as AccountUser;
  } catch {
    return null;
  }
}

function displayNameFromAccount(u: AccountUser | null): string {
  if (!u) return "";
  const name = String(u.name || "").trim();
  if (name) return name;
  const email = String(u.email || "").trim();
  if (email.includes("@")) return email.split("@")[0];
  return email || "";
}

function avatarFromAccount(u: AccountUser | null, name: string): string {
  if (u?.avatar || u?.image) {
    const a = String(u.avatar || u.image);
    if (a.startsWith("http") || a.startsWith("data:") || a.startsWith("/")) {
      return a.startsWith("/")
        ? `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${a}`
        : a;
    }
  }
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "guest")}`;
}

export default function CommentsSection({
  postId,
  siteId,
  allowComments = true,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Auto-fill name from logged-in account
  useEffect(() => {
    const u = readAccountUser();
    setAccount(u);
    const name = displayNameFromAccount(u);
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const qs = new URLSearchParams({ postId: String(postId) });
        if (siteId != null) qs.set("siteId", String(siteId));
        const headers: Record<string, string> = {};
        if (siteId != null) headers["X-Site-Id"] = String(siteId);

        const res = await fetch(`${API_BASE}/comments/public?${qs.toString()}`, {
          headers,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.comments || [];
        setComments(list);
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId, siteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = account || readAccountUser();
    if (!u) {
      setShowAuthModal(true);
      return;
    }
    const name = displayNameFromAccount(u) || userName.trim();
    if (!name || !content.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const userAvatar = avatarFromAccount(u, name);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (siteId != null) headers["X-Site-Id"] = String(siteId);
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          postId,
          userName: name,
          content: content.trim(),
          userAvatar,
          userId: u?.id || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to post comment");
      }
      const newComment = await res.json();

      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred while posting your comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="comments-section !mt-0 !pt-0 !border-0">
      <div className="comments-header">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h2>Discussion ({comments.length})</h2>
      </div>

      {allowComments === false && (
        <p className="comments-empty">Comments are turned off for this post.</p>
      )}

      {allowComments !== false && (
        <form onSubmit={handleSubmit} className="comment-form">
          <h3>Join the discussion</h3>
          <div className="form-inputs">
            {account ? (
              <>
                <div className="input-group">
                  <User className="input-icon" />
                  <input
                    type="text"
                    placeholder="Signed in as…"
                    value={userName}
                    readOnly
                    className="name-input"
                    title="Name is taken from your account"
                    style={{ background: "#f1f5f9", cursor: "default" }}
                  />
                </div>
                <p
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Commenting as your account: {userName}
                </p>
              </>
            ) : (
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                🔒 Registered users only — click below to log in or register to comment.
              </p>
            )}

            <textarea
              placeholder={
                account
                  ? "Share your thoughts..."
                  : "Please log in or register to post a comment..."
              }
              value={content}
              onChange={(e) => {
                if (!account) {
                  setShowAuthModal(true);
                  return;
                }
                setContent(e.target.value);
              }}
              onClick={() => {
                if (!account) {
                  setShowAuthModal(true);
                }
              }}
              required={!!account}
              rows={4}
              className="content-textarea"
            />
          </div>

          {error && <p className="comment-error">{error}</p>}
          {success && (
            <p className="comment-success">Comment posted successfully.</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            onClick={(e) => {
              if (!account) {
                e.preventDefault();
                setShowAuthModal(true);
              }
            }}
            className="submit-btn"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>
      )}

      {/* Registration Required Popup Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              Registration Required
            </h3>
            <p className="text-slate-600 text-sm text-center mb-6 leading-relaxed">
              Only registered users can post comments. Please log in or register a new account to join the discussion.
            </p>

            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/login"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl text-center transition-all shadow-sm active:scale-95"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl text-center transition-all shadow-sm active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2 px-4 text-slate-500 hover:text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="comments-loading">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : comments.length === 0 ? (
        <p className="comments-empty">
          No comments yet. Be the first to share a thought.
        </p>
      ) : (
        <ul className="comments-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-avatar">
                {c.userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.userAvatar} alt="" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="comment-body">
                <div className="comment-meta">
                  <strong>{c.userName || "Anonymous"}</strong>
                  <span>
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p>{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
