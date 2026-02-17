"use client";

import { MessageSquare, Check, X, Trash2 } from "lucide-react";

const comments = [
  {
    id: 1,
    author: "Alice Johnson",
    content: "Great guide! Very helpful for beginners.",
    post: "Getting Started with React",
    date: "2 hours ago",
    status: "Pending",
  },
  {
    id: 2,
    author: "Bob Smith",
    content: "I think you missed a point about hooks...",
    post: "Advanced React Patterns",
    date: "5 hours ago",
    status: "Approved",
  },
];

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comments</h1>
          <p className="text-slate-500 mt-1">Moderate user comments.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                    {comment.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-700">
                        {comment.author}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {comment.date}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      {comment.content}
                    </p>
                    <div className="text-xs text-slate-500">
                      On:{" "}
                      <span className="font-medium text-blue-600">
                        {comment.post}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {comment.status === "Pending" && (
                    <>
                      <button
                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
