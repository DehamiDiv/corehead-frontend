"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, Send, Loader2 } from "lucide-react";
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
  const [nameLocked, setNameLocked] = useState(false);

  // Auto-fill name from logged-in account
  useEffect(() => {
    const u = readAccountUser();
    setAccount(u);
    const name = displayNameFromAccount(u);
    if (name) {
      setUserName(name);
      setNameLocked(true);
    } else {
      setNameLocked(false);
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
    // Re-read account in case they logged in after page load
    const u = account || readAccountUser();
    const name =
      (nameLocked ? displayNameFromAccount(u) : userName.trim()) ||
      userName.trim();
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
      // Keep auto-filled name after submit
      if (!nameLocked) setUserName(name);
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
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                placeholder={
                  nameLocked ? "Signed in as…" : "Your name"
                }
                value={userName}
                onChange={(e) => {
                  if (!nameLocked) setUserName(e.target.value);
                }}
                required
                readOnly={nameLocked}
                className="name-input"
                title={
                  nameLocked
                    ? "Name is taken from your account"
                    : "Enter a display name"
                }
                style={
                  nameLocked
                    ? { background: "#f1f5f9", cursor: "default" }
                    : undefined
                }
              />
            </div>
            {nameLocked && (
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
            )}
            {!nameLocked && (
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Not signed in — enter a name, or log in to use your account name.
              </p>
            )}
            <textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="content-textarea"
            />
          </div>

          {error && <p className="comment-error">{error}</p>}
          {success && (
            <p className="comment-success">Comment posted successfully.</p>
          )}

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>
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
