"use client";

import { useState } from "react";
import { UserPlus, Search, MoreHorizontal, Shield, Mail, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_USERS = [
  {
    id: 1,
    name: "Dehami Div",
    email: "dehamidivyanjali166@gmail.com",
    role: "Administrator",
    status: "Active",
    lastActive: "Now",
  },
  {
    id: 2,
    name: "Nimasha D",
    email: "disanayakanimasha548@gmail.com",
    role: "Editor",
    status: "Active",
    lastActive: "2h ago",
  },
  {
    id: 3,
    name: "Guest User",
    email: "guest@corehead.app",
    role: "Viewer",
    status: "Inactive",
    lastActive: "3 days ago",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users & Team</h1>
          <p className="text-gray-500 mt-1">Manage team roles and access permissions.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6">
           <div className="text-sm font-bold text-gray-400">
             {INITIAL_USERS.length} Total Users
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Active</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {INITIAL_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shadow-sm overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Shield className="w-4 h-4 text-blue-500" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
                      user.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-gray-50 text-gray-400 border-gray-100"
                    )}>
                      {user.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-400">
                    {user.lastActive}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-red-600 shadow-sm transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
