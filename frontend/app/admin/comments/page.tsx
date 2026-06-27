"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MessageSquare,
  FileText,
  RotateCcw,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  X,
  Check,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Comment {
  id: number;
  content: string;
  status: string;
  postTitle: string;
  postSlug?: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState("Recent Comments");
  const [isLoading, setIsLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getComments();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string, content?: string) => {
    try {
      await api.updateComment(id, { status, content });
      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status, content: content || c.content } : c
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const postInteractions = useMemo(() => {
    const groups: Record<string, { postTitle: string; count: number; latestDate: string }> = {};
    comments.forEach((c) => {
      if (!groups[c.postTitle]) {
        groups[c.postTitle] = { postTitle: c.postTitle, count: 0, latestDate: c.createdAt };
      }
      groups[c.postTitle].count++;
      if (new Date(c.createdAt) > new Date(groups[c.postTitle].latestDate)) {
        groups[c.postTitle].latestDate = c.createdAt;
      }
    });
    return Object.values(groups).sort((a, b) => b.count - a.count);
  }, [comments]);

  const startEditing = (comment: Comment) => {
    setEditingComment(comment);
    setEditValue(comment.content);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="max-w-[1200px] mx-auto pt-8 pb-32 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Interactions</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            View and manage blog interactions
          </p>
        </div>
        <button
          onClick={fetchComments}
          className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          title="Refresh"
        >
          <RotateCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-1">
        {["Recent Comments", "Post Interactions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-[14px] font-semibold border-b-2 -mb-[1px] transition-all",
              activeTab === tab
                ? "border-[#1E293B] text-[#1E293B]"
                : "border-transparent text-[#64748B] hover:text-[#475569]"
            )}
          >
            {tab === "Recent Comments" ? (
              <MessageSquare className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-description */}
      <p className="text-[13px] text-[#2563EB] mb-4 mt-3">
        {activeTab === "Recent Comments"
          ? "View and manage all recent comments across all posts"
          : "View interaction summary grouped by post"}
      </p>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
            <p className="text-[#94A3B8] text-sm">Loading...</p>
          </div>
        ) : activeTab === "Recent Comments" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">User</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">Comment</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">Blog Post</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">Date</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {comments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <p className="text-[#94A3B8]">No interactions found</p>
                    </td>
                  </tr>
                ) : (
                  comments.map((comment) => {
                    const { date, time } = formatDate(comment.createdAt);
                    return (
                      <tr
                        key={comment.id}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#E8F0FE] flex items-center justify-center overflow-hidden shrink-0 border border-[#E2E8F0]">
                              {comment.userAvatar ? (
                                <img
                                  src={comment.userAvatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[#2563EB] font-bold text-sm">
                                  {comment.userName.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-[14px] font-semibold text-[#1E293B] whitespace-nowrap">
                              {comment.userName}
                            </span>
                          </div>
                        </td>

                        {/* Comment */}
                        <td className="px-6 py-4 max-w-[280px]">
                          {editingComment?.id === comment.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                className="w-full p-2.5 text-[13px] border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(comment.id, comment.status, editValue)
                                  }
                                  className="px-3 py-1 bg-[#2563EB] text-white rounded-lg text-[12px] font-semibold flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Save
                                </button>
                                <button
                                  onClick={() => setEditingComment(null)}
                                  className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] rounded-lg text-[12px] font-semibold flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[14px] text-[#475569] line-clamp-2">
                              {comment.content}
                            </p>
                          )}
                        </td>

                        {/* Blog Post */}
                        <td className="px-6 py-4 max-w-[200px]">
                          <span className="text-[14px] text-[#2563EB] line-clamp-2 cursor-pointer hover:underline">
                            {comment.postTitle}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[13px] text-[#64748B]">
                            {date},<br />
                            {time}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => window.open(`/blog/${comment.postSlug || ""}`, "_blank")}
                              className="p-2 text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 rounded-lg transition-all"
                              title="View post"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEditing(comment)}
                              className="p-2 text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Post Interactions Tab
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">Blog Post</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">Interactions</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">Latest Activity</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {postInteractions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <p className="text-[#94A3B8]">No engagement data found</p>
                    </td>
                  </tr>
                ) : (
                  postInteractions.map((post) => {
                    const { date, time } = formatDate(post.latestDate);
                    return (
                      <tr
                        key={post.postTitle}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1E293B] max-w-[400px] line-clamp-1">
                              {post.postTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-[13px] font-semibold border border-[#E2E8F0]">
                            {post.count} comments
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[13px] text-[#64748B]">
                            {date}, {time}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setActiveTab("Recent Comments")}
                            className="text-[13px] font-semibold text-[#2563EB] hover:underline flex items-center justify-end gap-1 ml-auto"
                          >
                            View Threads <MoreVertical className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
