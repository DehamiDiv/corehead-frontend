'use client';

import { useState, useEffect, use } from 'react';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BlogPostPage({ params }) {
  // ✅ Unwrap params Promise (required in Next.js 16+)
  const { slug } = use(params);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]); // ✅ use slug not params.slug

  // ── Loading ──
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'inherit', color: 'white', fontSize: '16px', gap: '12px'
    }}>
      <div style={{
        width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)',
        borderTopColor: 'white', borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      Loading post...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Error ──
  if (error || !post) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'inherit', textAlign: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: '20px',
        padding: '48px 40px', maxWidth: '400px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <h2 style={{ color: '#333', margin: '0 0 8px', fontSize: '22px', fontWeight: '700' }}>
          Post not found
        </h2>
        <p style={{ color: '#666', margin: '0 0 24px', fontSize: '15px' }}>{error}</p>
        <Link href="/blog" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white', borderRadius: '10px', textDecoration: 'none',
          fontWeight: '600', fontSize: '15px'
        }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    </div>
  );

  // ── Post Page ──
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'inherit'
    }}>

      {/* Article Card */}
      <div style={{
        maxWidth: '800px', margin: '0 auto',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>

        {/* Hero Image */}
        {post.featured_image && (
          <div style={{ width: '100%', height: '380px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={post.featured_image}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = `https://picsum.photos/800/380?random=${post.id}`; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)'
            }} />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '40px' }}>

          {/* Back link */}
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#667eea', textDecoration: 'none', fontSize: '14px',
            fontWeight: '600', marginBottom: '20px',
            transition: 'gap 0.2s'
          }}>
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {/* Category */}
          {post.category && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '5px 14px',
                background: 'linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)',
                border: '1px solid rgba(102,126,234,0.3)',
                color: '#667eea', borderRadius: '999px',
                fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px'
              }}>
                <Tag size={11} /> {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 24px', lineHeight: 1.2,
            letterSpacing: '-0.5px'
          }}>
            {post.title}
          </h1>

          {/* Author + Date */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
            border: '2px solid rgba(102,126,234,0.15)',
            borderRadius: '12px', marginBottom: '28px'
          }}>
            {post.author_avatar && (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  objectFit: 'cover', border: '2px solid #e0e0e0', flexShrink: 0
                }}
                onError={e => e.target.style.display = 'none'}
              />
            )}
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px'
              }}>
                <User size={13} color="#667eea" />
                {post.author_name || 'Unknown Author'}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '13px', color: '#888'
              }}>
                <Calendar size={12} color="#999" />
                {post.published_date
                  ? new Date(post.published_date).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : 'No date'}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p style={{
              fontSize: '1.1rem', color: '#555',
              lineHeight: 1.8, margin: '0 0 28px',
              fontStyle: 'italic',
              borderLeft: '4px solid #667eea',
              paddingLeft: '20px',
              background: 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
              padding: '16px 16px 16px 20px',
              borderRadius: '0 12px 12px 0'
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Body */}
          {post.body ? (
            <div
              style={{
                fontSize: '1.05rem', lineHeight: 1.8,
                color: '#444', fontFamily: 'Georgia, serif'
              }}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <div style={{
              padding: '40px 24px',
              background: '#f9f9f9',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center', color: '#999', fontSize: '15px'
            }}>
              📄 Full article content coming soon.
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              marginTop: '36px', paddingTop: '24px',
              borderTop: '2px solid #e0e0e0'
            }}>
              <p style={{
                fontSize: '12px', fontWeight: '600', color: '#999',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                Tags
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {post.tags.map((tag, i) => (
                  <span key={i} style={{
                    padding: '5px 14px',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    color: '#667eea', borderRadius: '16px',
                    fontSize: '13px', fontWeight: '500',
                    transition: 'all 0.2s'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author_bio && (
            <div style={{
              marginTop: '36px', padding: '24px',
              background: '#f9f9f9', border: '2px solid #e0e0e0',
              borderRadius: '16px', display: 'flex', gap: '16px'
            }}>
              {post.author_avatar && (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    objectFit: 'cover', flexShrink: 0,
                    border: '2px solid #e0e0e0'
                  }}
                  onError={e => e.target.style.display = 'none'}
                />
              )}
              <div>
                <p style={{
                  fontSize: '15px', fontWeight: '700', color: '#333',
                  margin: '0 0 8px'
                }}>
                  About {post.author_name}
                </p>
                <p style={{
                  fontSize: '14px', color: '#666',
                  lineHeight: 1.6, margin: 0
                }}>
                  {post.author_bio}
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link href="/blog" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', borderRadius: '12px', textDecoration: 'none',
              fontWeight: '600', fontSize: '15px',
              boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
              transition: 'all 0.3s'
            }}>
              <ArrowLeft size={16} /> Back to All Articles
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', marginTop: '30px',
        color: 'rgba(255,255,255,0.7)', fontSize: '14px'
      }}>
        CoreHead.app — Built with Next.js & PostgreSQL
      </div>

    </div>
  );
}