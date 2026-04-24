'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Search, Tag, ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';
import './page.css';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('status', 'published');
      params.set('limit', '9');
      params.set('page', page);
      if (search) params.set('search', search);
      if (selectedCategory) params.set('category', selectedCategory);

      const res = await fetch(`${BASE_URL}/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch posts');

      const data = await res.json();
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/posts/categories`);
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Categories fetch failed:', err);
    }
  };

  useEffect(() => { fetchPosts(); }, [page, selectedCategory]);
  useEffect(() => { fetchCategories(); }, []);

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') { setPage(1); fetchPosts(); }
  };

  const categoryList = categories.length > 0
    ? categories.map(c => c.name || c)
    : [...new Set(posts.map(p => p.category).filter(Boolean))];

  return (
    <div className="blog-page">

      {/* ── Hero ── */}
      <div className="blog-hero">
        <div className="hero-badge">✦ CoreHead Blog</div>
        <h1 className="hero-title">
          Insights & <span className="hero-accent">Stories</span>
        </h1>
        <p className="hero-subtitle">
          Explore articles on development, design, and the future of the web
        </p>

        {/* Search */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            className="search-input"
          />
          <button
            className="search-btn"
            onClick={() => { setPage(1); fetchPosts(); }}
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="blog-container">

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={`cat-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => { setSelectedCategory(''); setPage(1); }}
          >
            All Posts
          </button>
          {categoryList.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Box — matches .generator-content style */}
        <div className="blog-content-box">

          {/* Loading */}
          {loading && (
            <div className="loading-state">
              <Loader size={32} className="spinner" />
              <p>Loading articles...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Failed to load posts</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchPosts}>Try Again</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && posts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No posts found</h3>
              <p>
                {search
                  ? `No results for "${search}"`
                  : selectedCategory
                  ? `No posts in "${selectedCategory}"`
                  : 'No published posts yet'}
              </p>
              {(search || selectedCategory) && (
                <button className="retry-btn" onClick={() => {
                  setSearch(''); setSelectedCategory(''); setPage(1);
                }}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Posts */}
          {!loading && !error && posts.length > 0 && (
            <>
              {pagination && (
                <div className="results-info">
                  Showing <strong>{posts.length}</strong> of{' '}
                  <strong>{pagination.total}</strong> articles
                  {selectedCategory && ` in "${selectedCategory}"`}
                  {search && ` matching "${search}"`}
                </div>
              )}

              <div className="posts-grid">
                {posts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`post-card ${
                      index === 0 && page === 1 && !selectedCategory && !search
                        ? 'featured' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="card-image">
                      <img
                        src={post.featured_image || `https://picsum.photos/800/450?random=${post.id}`}
                        alt={post.title}
                        onError={e => {
                          e.target.src = `https://picsum.photos/800/450?random=${post.id}`;
                        }}
                      />
                      <div className="card-category">
                        <Tag size={10} /> {post.category}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="card-body">
                      <h2 className="card-title">{post.title}</h2>
                      <p className="card-excerpt">{post.excerpt}</p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="card-tags">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="card-meta">
                        <div className="meta-author">
                          {post.author_avatar && (
                            <img
                              src={post.author_avatar}
                              alt={post.author_name}
                              className="author-avatar"
                              onError={e => e.target.style.display = 'none'}
                            />
                          )}
                          <div className="meta-info">
                            <span className="author-name">
                              <User size={11} /> {post.author_name || 'Unknown'}
                            </span>
                            <span className="post-date">
                              <Calendar size={11} />
                              {post.published_date
                                ? new Date(post.published_date).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                  })
                                : 'No date'}
                            </span>
                          </div>
                        </div>

                        <Link href={`/blog/${post.slug || post.id}`} className="read-more">
                          Read <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    ← Previous
                  </button>
                  <div className="page-numbers">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        className={`page-num ${page === num ? 'active' : ''}`}
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button
                    className="page-btn"
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="blog-footer">
        <p>CoreHead.app — Built with Next.js & PostgreSQL</p>
      </div>

    </div>
  );
}