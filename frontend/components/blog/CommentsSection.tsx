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
}

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/comments?postId=${postId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        // Backend returns all, filter for approved status
        const approvedComments = data.filter((c: any) => c.status === "approved" || c.status === "Approved");
        setComments(approvedComments);
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !content.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName.trim())}`;

    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userName: userName.trim(),
          content: content.trim(),
          userAvatar,
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
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
    <section className="comments-section">
      <div className="comments-header">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h2>Discussion ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <h3>Join the discussion</h3>
        <div className="form-inputs">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="name-input"
            />
          </div>
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
        {success && <p className="comment-success">Comment posted successfully!</p>}

        <button type="submit" disabled={submitting} className="submit-comment-btn">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Post Comment
            </>
          )}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="comments-loading">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="comments-empty">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-avatar">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} />
                ) : (
                  <div className="avatar-placeholder">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="comment-content-box">
                <div className="comment-meta">
                  <span className="comment-author">{comment.userName}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
