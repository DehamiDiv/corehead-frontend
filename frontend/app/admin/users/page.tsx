"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, MoreHorizontal, Shield, Mail, Edit, Trash2, CheckCircle2, XCircle, RefreshCw, Upload, FolderOpen, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

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
  const [users, setUsers] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteNicename, setInviteNicename] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDesignation, setInviteDesignation] = useState("");
  const [inviteDescription, setInviteDescription] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteRole, setInviteRole] = useState("Author");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      if (response && response.users) {
        setUsers(response.users);
      } else if (Array.isArray(response)) {
        setUsers(response);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!inviteName || !inviteNicename || !inviteEmail || !inviteRole || (!editingUserId && !invitePassword)) {
      return alert("Please fill in all required fields marked with *");
    }
    setIsSubmitting(true);
    try {
      if (editingUserId) {
        await api.updateUser(editingUserId, { email: inviteEmail, role: inviteRole, password: invitePassword || undefined });
        alert(`User ${inviteName} updated successfully!`);
      } else {
        await api.inviteUser({ email: inviteEmail, role: inviteRole });
        alert(`User ${inviteName} created successfully!`);
      }
      setIsInviteModalOpen(false);
      // Refresh the table
      fetchUsers();
      // Reset form
      setEditingUserId(null);
      setInviteName("");
      setInviteNicename("");
      setInviteEmail("");
      setInviteDesignation("");
      setInviteDescription("");
      setInvitePassword("");
      setInviteRole("Author");
    } catch (error: any) {
      alert(error.message || `Failed to ${editingUserId ? "update" : "create"} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUserId(user.id);
    const generatedName = user.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : "Unknown User";
    const displayName = user.name || generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
    const displayNicename = user.nicename || displayName.toLowerCase().replace(/\s+/g, '-');
    
    setInviteName(displayName);
    setInviteNicename(displayNicename);
    setInviteEmail(user.email);
    setInviteRole(user.role || "Author");
    setInvitePassword(""); // Reset password field
    setInviteDesignation("");
    setInviteDescription("");
    setIsInviteModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingUserId(null);
    setInviteName("");
    setInviteNicename("");
    setInviteEmail("");
    setInviteDesignation("");
    setInviteDescription("");
    setInvitePassword("");
    setInviteRole("Author");
    setIsInviteModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (e: any) {
        alert(e.message || "Failed to delete user");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage your application users and their roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchUsers()}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            title="Refresh Users"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button 
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Nicename</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                // Generate dummy names if missing from DB
                const generatedName = user.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : "Unknown User";
                const displayName = user.name || generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
                const displayNicename = user.nicename || displayName.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <UserPlus className="w-4 h-4 text-gray-400" />
                        {displayName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {displayNicename}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        user.role === 'Admin' || user.role === 'Administrator' ? "bg-purple-50 text-purple-600" :
                        user.role === 'Editor' ? "bg-orange-50 text-orange-600" :
                        "bg-blue-50 text-blue-600"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEditClick(user)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No users found. Click "Create User" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Modal for Create User */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all p-4">
          <div className="bg-white w-full max-w-[600px] max-h-[90vh] shadow-2xl flex flex-col rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingUserId ? "Edit User" : "Create User"}</h2>
                <p className="text-sm text-gray-500 mt-1">{editingUserId ? "Update user details and access permissions." : "Add a new user to your application."}</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              
              {/* Profile Image */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-3">Profile Image</label>
                <div className="flex items-center gap-5">
                  <div className="w-[84px] h-[84px] rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50/50 text-gray-400">
                    <Upload size={24} className="opacity-50" />
                  </div>
                  <div>
                    <div className="flex gap-2.5 mb-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                        <Upload size={16} className="text-gray-500" />
                        Upload
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                        <FolderOpen size={16} className="text-gray-500" />
                        Library
                      </button>
                    </div>
                    <p className="text-[13px] text-gray-500">Upload a profile image (max 1MB)</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                  placeholder="Enter user name"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                />
              </div>

              {/* Nicename */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Nicename (URL Slug) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                  placeholder="user-nicename"
                  value={inviteNicename}
                  onChange={e => setInviteNicename(e.target.value)}
                />
                <p className="text-[13px] text-gray-500 mt-2">URL-friendly identifier. Auto-generated from name but can be customized.</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Designation</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                  placeholder="e.g., Senior Developer, Content Writer"
                  value={inviteDesignation}
                  onChange={e => setInviteDesignation(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400 min-h-[100px] resize-y"
                  placeholder="Brief description about the user..."
                  value={inviteDescription}
                  onChange={e => setInviteDescription(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Password {!editingUserId && <span className="text-red-500">*</span>}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
                    placeholder={editingUserId ? "Leave blank to keep unchanged" : "Enter password (min 8 characters)"}
                    value={invitePassword}
                    onChange={e => setInvitePassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-2">Role <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-32 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900 appearance-none"
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%239ca3af"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em 1.25em' }}
                  >
                    <option value="Author">Author</option>
                    <option value="Editor">Editor</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-all shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? (editingUserId ? "Updating..." : "Creating...") : (editingUserId ? "Update User" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
