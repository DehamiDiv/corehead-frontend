"use client";

import React from "react";
import { Edit2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileSettingsPage() {
  const user = {
    name: "Sayuru Piyasooriya",
    email: "sayuru@seekahost.co.uk",
    role: "ADMIN",
    status: "Active",
    designation: "Developer",
    bio: "Sayuru Piyasooriya is a web developer and tech writer who enjoys working with Next.js, React, and modern web tools. He shares practical tips and easy-to-follow guides to help developers build better websites and applications",
    userId: "#1",
    accountCreated: "December 30, 2025",
    lastUpdated: "January 12, 2026"
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
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-bold border border-gray-100 transition-all">
            Edit Profile
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sayuru" 
                  alt="Avatar" 
                  className="w-full h-full object-cover bg-gray-100"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-100 text-blue-600 hover:scale-110 transition-transform">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{user.name}</h3>
              <p className="text-gray-400 font-bold text-sm mb-2">{user.email}</p>
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
                value={user.name}
                readOnly
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-400 font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input 
                type="email" 
                value={user.email}
                readOnly
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-400 font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Designation</label>
              <input 
                type="text" 
                value={user.designation}
                readOnly
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-400 font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Bio</label>
              <textarea 
                rows={4}
                value={user.bio}
                readOnly
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-400 font-bold text-sm leading-relaxed resize-none"
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

      {/* Footer */}
      <div className="pt-10 flex flex-col items-center justify-center text-center gap-2 opacity-40 grayscale group">
        <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
          Copyright © 2026 SeekaHost Technologies Ltd. All Rights Reserved.
        </p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Company Number: 16028964 | VAT Number: 485829729
        </p>
        <div className="mt-4 flex items-center gap-2">
           <span className="text-[10px] font-black text-gray-300">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
