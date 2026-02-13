'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Copy, MoreVertical, Calendar, User, Eye } from 'lucide-react';
import Link from 'next/link';
import './page.css';

export default function BlogListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedPosts, setSelectedPosts] = useState([]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Getting Started with React',
      author: 'John Doe',
      category: 'Development',
      status: 'Published',
      date: '2024-02-10',
      views: 1234,
      featured_image: 'https://picsum.photos/100/100?random=1'
    },
    {
      id: 2,
      title: 'Advanced CSS Techniques',
      author: 'Jane Smith',
      category: 'Design',
      status: 'Published',
      date: '2024-02-12',
      views: 856,
      featured_image: 'https://picsum.photos/100/100?random=2'
    },
    {
      id: 3,
      title: 'JavaScript ES2024 Features',
      author: 'Mike Johnson',
      category: 'Development',
      status: 'Draft',
      date: '2024-02-13',
      views: 0,
      featured_image: 'https://picsum.photos/100/100?random=3'
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      author: 'Sarah Wilson',
      category: 'Design',
      status: 'Published',
      date: '2024-02-14',
      views: 2103,
      featured_image: 'https://picsum.photos/100/100?random=4'
    },
    {
      id: 5,
      title: 'Building Scalable APIs',
      author: 'John Doe',
      category: 'Development',
      status: 'Draft',
      date: '2024-02-15',
      views: 0,
      featured_image: 'https://picsum.photos/100/100?random=5'
    }
  ]);

  // Filter and search
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status.toLowerCase() === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch(sortBy) {
      case 'date-desc': return new Date(b.date) - new Date(a.date);
      case 'date-asc': return new Date(a.date) - new Date(b.date);
      case 'title-asc': return a.title.localeCompare(b.title);
      case 'title-desc': return b.title.localeCompare(a.title);
      case 'views-desc': return b.views - a.views;
      case 'views-asc': return a.views - b.views;
      default: return 0;
    }
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPosts(sortedPosts.map(p => p.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const handleDelete = (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedPosts.length} selected posts?`)) {
      setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
      setSelectedPosts([]);
    }
  };

  const handleDuplicate = (post) => {
    const newPost = {
      ...post,
      id: Math.max(...posts.map(p => p.id)) + 1,
      title: `${post.title} (Copy)`,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="blog-list-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <h1 className="logo">CoreHead<span>.app</span></h1>
          <div className="page-title">
            <span>All Posts</span>
            <span className="post-count">{posts.length} total</span>
          </div>
        </div>
        
        <div className="header-actions">
          <Link href="/builder">
            <button className="btn-secondary">Go to Builder</button>
          </Link>
          <Link href="/posts/new">
            <button className="btn-primary">
              <Plus size={18} />
              New Post
            </button>
          </Link>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="views-desc">Most Views</option>
            <option value="views-asc">Least Views</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedPosts.length} selected</span>
          <button className="btn-danger" onClick={handleBulkDelete}>
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      )}

      {/* Posts Table */}
      <div className="table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedPosts.length === sortedPosts.length && sortedPosts.length > 0}
                />
              </th>
              <th>Post</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map(post => (
              <tr key={post.id} className={selectedPosts.includes(post.id) ? 'selected' : ''}>
                <td className="checkbox-col">
                  <input 
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                  />
                </td>
                <td className="post-cell">
                  <div className="post-info">
                    <img src={post.featured_image} alt={post.title} />
                    <span className="post-title">{post.title}</span>
                  </div>
                </td>
                <td>
                  <div className="author-cell">
                    <User size={14} />
                    {post.author}
                  </div>
                </td>
                <td>
                  <span className="category-badge">{post.category}</span>
                </td>
                <td>
                  <span className={`status-badge ${post.status.toLowerCase()}`}>
                    {post.status}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </td>
                <td>
                  <div className="views-cell">
                    <Eye size={14} />
                    {post.views.toLocaleString()}
                  </div>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button className="action-btn" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn" title="Duplicate" onClick={() => handleDuplicate(post)}>
                      <Copy size={16} />
                    </button>
                    <button className="action-btn danger" title="Delete" onClick={() => handleDelete(post.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedPosts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No posts found</p>
            <span>Try adjusting your search or filters</span>
          </div>
        )}
      </div>
    </div>
  );
}