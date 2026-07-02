"use client";

import { useEffect, useState } from "react";

interface AuthorProfileHeaderProps {
  authorName: string;
  initialData: {
    name: string;
    bio: string | null;
    avatar: string | null;
  };
}

export default function AuthorProfileHeader({ authorName, initialData }: AuthorProfileHeaderProps) {
  const [profileData, setProfileData] = useState(initialData);

  useEffect(() => {
    // Try to load custom profile data from localStorage (demo backend workaround)
    try {
      const localDataRaw = localStorage.getItem('corehead_author_data_' + authorName);
      if (localDataRaw) {
        const localData = JSON.parse(localDataRaw);
        setProfileData({
          ...initialData,
          bio: localData.bio || initialData.bio,
          avatar: localData.avatar || initialData.avatar,
        });
      }
    } catch (e) {
      console.error("Failed to parse local author data", e);
    }
  }, [authorName, initialData]);

  return (
    <section className="author-header">
      <div className="author-header-content">
        <div className="author-avatar-large">
          {profileData.avatar ? (
            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            profileData.name.charAt(0).toUpperCase()
          )}
        </div>
        <h1>{profileData.name}</h1>
        <p className="author-role">Author</p>
        <p className="author-bio">{profileData.bio || "Tech enthusiast and writer at CoreHead."}</p>
      </div>
    </section>
  );
}
