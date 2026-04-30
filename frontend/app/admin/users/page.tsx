"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  UserPlus, Search, MoreHorizontal, Shield, Mail, Edit, Trash2, 
  CheckCircle2, XCircle, RefreshCw, Upload, FolderOpen, Eye, EyeOff,
  User, RotateCcw, X, Check, Loader2, UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nicename: "",
    email: "",
    designation: "",
    description: "",
    password: "",
    role: "Author",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const response = await api.getUsers();
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && response.users) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFormData({
      name: "",
      nicename: "",
      email: "",
      designation: "",
      description: "",
      password: "",
      role: "Author",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUserId(user.id);
    const generatedName = user.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : "";
    const displayName = user.name || generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
    
    setFormData({
      name: displayName,
      nicename: user.nicename || displayName.toLowerCase().replace(/\s+/g, '-'),
      email: user.email || "",
      designation: user.designation || "",
      description: user.description || "",
      password: "",
      role: user.role || "Author",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.deleteUser(id);
        fetchUsers(true);
      } catch (e: any) {
        alert(e.message || "Failed to delete user");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editingUserId && !formData.password)) return;
    
    setIsSubmitting(true);
    try {
      if (editingUserId) {
        await api.updateUser(editingUserId, { 
          email: formData.email, 
          role: formData.role, 
          password: formData.password || undefined 
        });
      } else {
        await api.inviteUser({ 
          email: formData.email, 
          role: formData.role 
        });
      }
      setIsModalOpen(false);
      fetchUsers(true);
    } catch (error: any) {
      alert(error.message || `Failed to ${editingUserId ? "update" : "create"} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Users</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your team and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RotateCcw className={cn("w-4 h-4 text-slate-400", isRefreshing && "animate-spin")} />
            Refresh
          </button>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-[14px] font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-5 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-[14px] font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-[14px] font-bold text-slate-900 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-50">
          {filteredUsers.length} users total
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider w-20 text-center">ID</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Fetching users list...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 text-[13px] font-bold text-slate-300 text-center">#{user.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.id}`} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-900 leading-tight">
                            {user.name || (user.email ? user.email.split('@')[0] : 'User')}
                          </p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            @{user.nicename || 'user'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                        <Mail className="w-4 h-4 text-slate-300" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex px-3 py-1 rounded-lg text-[11px] font-bold border",
                        user.role === 'Administrator' || user.role === 'Admin' 
                          ? "bg-purple-50 text-purple-600 border-purple-100" 
                          : user.role === 'Editor'
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-500">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="p-6 bg-slate-50 rounded-full inline-block mb-4">
                      <UserCircle className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[550px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[24px] font-bold text-slate-900 mb-1">
                {editingUserId ? "Edit User" : "Invite User"}
              </h2>
              <p className="text-[14px] text-slate-500 font-medium">
                {editingUserId ? "Update account settings" : "Add a new member to the team"}
              </p>
            </div>
            
            <form onSubmit={handleSave} className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Full Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-[15px] font-bold text-slate-900"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Email Address</label>
                  <input 
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-[14px] font-medium text-slate-600"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">User Role</label>
                  <div className="relative">
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all appearance-none text-[14px] font-bold text-slate-900"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="Author">Author</option>
                      <option value="Editor">Editor</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Password {editingUserId && "(Optional)"}
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required={!editingUserId}
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-[14px] font-medium text-slate-600"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-[14px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 text-[14px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingUserId ? "Save Changes" : "Invite User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
