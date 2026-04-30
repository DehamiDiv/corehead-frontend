"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  FileText,
  RotateCcw,
  ExternalLink,
  Pencil,
  Trash2,
  Search,
  Loader2,
  X,
  Check,
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
      setComments(data);
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
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string, content?: string) => {
    try {
      await api.updateComment(id, { status, content });
      setComments(prev => prev.map(c => c.id === id ? { ...c, status, content: content || c.content } : c));
      setEditingComment(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment);
    setEditValue(comment.content);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Interactions</h1>
          <p className="text-slate-500 mt-1 font-medium">View and manage blog interactions</p>
        </div>
        <button 
          onClick={fetchComments}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
        >
          <RotateCcw className={cn("w-5 h-5 group-active:rotate-180 transition-transform", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab("Recent Comments")}
          className={cn(
            "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200",
            activeTab === "Recent Comments"
              ? "bg-white text-blue-600 shadow-md shadow-blue-500/5 border border-blue-50"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          <MessageSquare className="w-[18px] h-[18px]" />
          Recent Comments
        </button>
        <button
          onClick={() => setActiveTab("Post Interactions")}
          className={cn(
            "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200",
            activeTab === "Post Interactions"
              ? "bg-white text-blue-600 shadow-md shadow-blue-500/5 border border-blue-50"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          <FileText className="w-[18px] h-[18px]" />
          Post Interactions
        </button>
      </div>

      <div className="text-[14px] text-slate-500 mb-6 font-medium">
        View and manage all recent comments across all posts
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Blog Post</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading interactions...</p>
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-slate-400 font-medium">No interactions found</p>
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                          {comment.userAvatar ? (
                            <img src={comment.userAvatar.startsWith('http') ? comment.userAvatar : `http://localhost:5000${comment.userAvatar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-blue-600 font-bold text-sm">
                              {comment.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-[14px] font-bold text-slate-900 block max-w-[120px] leading-tight">
                          {comment.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {editingComment?.id === comment.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            className="w-full p-2 text-[14px] border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(comment.id, comment.status, editValue)}
                              className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingComment(null)}
                              className="p-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[14px] text-slate-600 max-w-[300px] leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] text-slate-400 font-medium hover:text-blue-600 cursor-pointer transition-colors max-w-[200px] block">
                        {comment.postTitle}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-[13px] font-medium">
                        <span className="text-slate-800">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-slate-400 mt-0.5">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="View Post">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => startEditing(comment)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors" 
                          title="Edit Comment"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
