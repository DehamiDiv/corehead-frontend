"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit2, Save, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function ProfileSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState({
    name: "Dehami Div",
    email: "admin@corehead.dev",
    role: "ADMIN",
    status: "Active",
    designation: "System Administrator",
    bio: "Lead developer and system administrator for CoreHead CMS. Passionate about building robust web applications and seamless user experiences.",
    userId: "#1",
    accountCreated: "December 30, 2025",
    lastUpdated: "January 12, 2026",
    avatar: "" // added avatar property
  });

  const [formData, setFormData] = useState(user);

  // Load from backend database
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = payload.id;
        if (!currentUserId) return;

        const res = await api.getUsers();
        if (res.success && res.users) {
          const dbUser = res.users.find((u: any) => u.id === currentUserId);
          if (dbUser) {
             const userState = {
                name: dbUser.name || "Admin User",
                email: dbUser.email,
                role: dbUser.role.toUpperCase(),
                status: "Active",
                designation: dbUser.designation || "Developer",
                bio: dbUser.bio || "No bio added yet.",
                userId: `#${dbUser.id}`,
                accountCreated: new Date(dbUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                avatar: dbUser.avatar || ""
             };
             setUser(userState);
             setFormData(userState);
          }
        }
      } catch (e) {
        console.error("Failed to load user from backend", e);
      }
    };
    fetchUser();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setFormData(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = payload.id;
        
        if (currentUserId) {
          await api.updateUser(currentUserId, {
            name: formData.name,
            email: formData.email,
            designation: formData.designation,
            bio: formData.bio,
            avatar: formData.avatar
          });
        }
      }

      const updatedUser = {
        ...formData,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile successfully saved to the database!");
    } catch (e: any) {
      console.error(e);
      alert("Failed to save profile. Error: " + (e.message || "Unknown error"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your profile information and preferences</p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-500 mt-0.5">Update your personal details and profile picture</p>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-100 transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-blue-200 transition-all"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </>
            ) : (
              <button 
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-bold border border-gray-100 transition-all"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50">
                <img 
                  src={(isEditing ? formData.avatar : user.avatar) || `https://api.dicebear.com/7.x/initials/svg?seed=${isEditing ? formData.name : user.name}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-blue-600 hover:scale-110 transition-transform"
                    title="Upload new picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{isEditing ? formData.name : user.name}</h3>
              <p className="text-gray-400 font-bold text-sm mb-2">{isEditing ? formData.email : user.email}</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded-md uppercase tracking-wider border border-red-100">
                  {user.role}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-black rounded-md uppercase tracking-wider border border-emerald-100">
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={isEditing ? formData.name : user.name}
                onChange={handleChange}
                readOnly={!isEditing}
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl font-bold text-sm transition-all focus:outline-none",
                  isEditing 
                    ? "bg-white border-2 border-blue-100 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    : "bg-gray-50/50 border border-gray-100 text-gray-500"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={isEditing ? formData.email : user.email}
                onChange={handleChange}
                readOnly={!isEditing}
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl font-bold text-sm transition-all focus:outline-none",
                  isEditing 
                    ? "bg-white border-2 border-blue-100 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    : "bg-gray-50/50 border border-gray-100 text-gray-500"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Designation</label>
              <input 
                type="text" 
                name="designation"
                value={isEditing ? formData.designation : user.designation}
                onChange={handleChange}
                readOnly={!isEditing}
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl font-bold text-sm transition-all focus:outline-none",
                  isEditing 
                    ? "bg-white border-2 border-blue-100 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    : "bg-gray-50/50 border border-gray-100 text-gray-500"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Bio</label>
              <textarea 
                rows={4}
                name="bio"
                value={isEditing ? formData.bio : user.bio}
                onChange={handleChange}
                readOnly={!isEditing}
                className={cn(
                  "w-full px-5 py-3.5 rounded-2xl font-bold text-sm leading-relaxed resize-none transition-all focus:outline-none",
                  isEditing 
                    ? "bg-white border-2 border-blue-100 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    : "bg-gray-50/50 border border-gray-100 text-gray-500"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
          <p className="text-sm text-gray-500 mt-0.5">View your account information</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-gray-900">User ID</span>
            <span className="text-sm font-bold text-gray-400">{user.userId}</span>
          </div>
          <div className="h-px bg-gray-50 w-full" />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-gray-900">Account Created</span>
            <span className="text-sm font-bold text-gray-400">{user.accountCreated}</span>
          </div>
          <div className="h-px bg-gray-50 w-full" />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-gray-900">Last Updated</span>
            <span className="text-sm font-bold text-gray-400">{user.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
