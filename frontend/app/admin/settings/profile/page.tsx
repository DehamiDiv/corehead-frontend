"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit2, Save, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { updateStoredUser } from "@/lib/authSession";
import { resolveAdminMediaUrl } from "@/lib/apiOrigin";

type ProfileState = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  designation: string;
  bio: string;
  userId: string;
  accountCreated: string;
  lastUpdated: string;
  avatar: string;
};

const formatAccountDate = (value?: string | Date | null) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

const toProfileState = (account: any): ProfileState => ({
  id: Number(account.id),
  name: account.name || "Account User",
  email: account.email || "",
  role: String(account.role || "ACCOUNT").toUpperCase(),
  status: account.status || "active",
  designation: account.designation || "",
  bio: account.bio || "No bio added yet.",
  userId: `#${account.id}`,
  accountCreated: formatAccountDate(account.createdAt),
  lastUpdated: formatAccountDate(account.updatedAt || account.createdAt),
  avatar: account.avatar || account.image || "",
});

export default function ProfileSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ProfileState | null>(null);
  const [formData, setFormData] = useState<ProfileState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Load from backend database
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        if (!currentUser?.id) {
          throw new Error("Authenticated user profile was not returned.");
        }

        const userState = toProfileState(currentUser);
        updateStoredUser(currentUser);
        setUser(userState);
        setFormData(userState);
      } catch (e: any) {
        console.error("Failed to load user from backend", e);
        setLoadError(e?.message || "Unable to load your account profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleEditToggle = () => {
    if (!user || !formData) return;
    if (isEditing) {
      // Cancel edit
      setFormData(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!user || !formData) return;
    try {
      const savedUser = await api.updateUser(user.id, {
        name: formData.name,
        designation: formData.designation,
        bio: formData.bio,
        avatar: formData.avatar,
      });
      updateStoredUser(savedUser);

      const updatedUser = {
        ...formData,
        name: savedUser.name ?? formData.name,
        designation: savedUser.designation ?? formData.designation,
        bio: savedUser.bio ?? formData.bio,
        avatar: savedUser.avatar ?? formData.avatar,
        lastUpdated: formatAccountDate(savedUser.updatedAt),
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
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!formData) return;
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm font-semibold text-gray-500">
        Loading your account profile…
      </div>
    );
  }

  if (loadError || !user || !formData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <h1 className="text-lg font-bold text-red-800">Profile unavailable</h1>
          <p className="mt-2 text-sm text-red-600">{loadError || "Unable to load your account profile."}</p>
        </div>
      </div>
    );
  }

  const displayedName = isEditing ? formData.name : user.name;
  const displayedAvatar = resolveAdminMediaUrl(
    isEditing ? formData.avatar : user.avatar,
  );
  const avatarSrc =
    displayedAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayedName)}&background=2563eb&color=fff&bold=true&size=192`;

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
                  src={avatarSrc}
                  alt={`${displayedName} profile picture`}
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
                value={user.email}
                readOnly
                disabled
                title="Email cannot be changed from profile"
                className="w-full px-5 py-3.5 rounded-2xl font-bold text-sm bg-gray-50/80 border border-gray-100 text-gray-400 cursor-not-allowed focus:outline-none opacity-90"
              />
              <p className="text-xs text-gray-400 font-medium ml-1">
                Email cannot be edited from your profile.
              </p>
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
