'use client';

import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function PreviewModal({ isOpen, onClose, blogPosts, contentMode }) {
  const [viewport, setViewport] = useState('desktop');

  if (!isOpen) return null;

  const viewportWidths = {
    desktop: '100%',
    tablet:  '768px',
    mobile:  '375px',
  };

  const previewHTML = `
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8f7f4;
          color: #1a1a1a;
          padding: 40px 24px;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .page-subtitle {
          color: #888;
          font-size: 14px;
          margin-bottom: 32px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
          transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .card img { width: 100%; height: 180px; object-fit: cover; }
        .card-body { padding: 20px; }
        .category {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .card-body h2 { font-size: 1.05rem; margin-bottom: 8px; line-height: 1.4; color: #1a1a1a; }
        .card-body p { font-size: 0.875rem; color: #666; line-height: 1.6; margin-bottom: 16px; }
        .meta {
          font-size: 0.75rem;
          color: #aaa;
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
        .dynamic-badge {
          display: inline-block;
          padding: 3px 10px;
          background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
          border: 1px solid rgba(102,126,234,0.3);
          border-radius: 999px;
          font-size: 11px;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 24px;
        }
      </style>
    </head>
    <body>
      <div class="page-title">Blog Posts</div>
      ${contentMode === 'dynamic'
        ? '<div class="dynamic-badge">⚡ Dynamic Mode — fields bound to CMS</div>'
        : '<div class="dynamic-badge">📌 Static Mode</div>'
      }
      <div class="grid">
        ${blogPosts.map(post => `
          <div class="card">
            <img src="${post.image || 'https://picsum.photos/400/250?random=' + post.id}"
                 alt="${post.title}"
                 onerror="this.src='https://picsum.photos/400/250?random=${post.id}'" />
            <div class="card-body">
              <div class="category">${post.category || 'General'}</div>
              <h2>${post.title}</h2>
              <p>${post.excerpt}</p>
              <div class="meta">
                <span>✍️ ${post.author}</span>
                <span>📅 ${post.date}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>

      {/* Top Bar */}
      <div style={{
        width: '100%', maxWidth: '1100px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            ['desktop', Monitor,     'Desktop'],
            ['tablet',  Tablet,      'Tablet'],
            ['mobile',  Smartphone,  'Mobile'],
          ].map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                background: viewport === key
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255,255,255,0.15)',
                color: '#fff',
                transition: 'all 0.2s',
                boxShadow: viewport === key ? '0 4px 12px rgba(102,126,234,0.4)' : 'none'
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
            {blogPosts.length} posts · {contentMode} mode
          </span>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', borderRadius: '10px', padding: '8px 16px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div style={{
        width: '100%', maxWidth: '1100px',
        flex: 1, maxHeight: '72vh',
        background: '#e5e7eb', borderRadius: '16px',
        overflow: 'hidden', display: 'flex',
        alignItems: 'flex-start', justifyContent: 'center',
        padding: '20px', transition: 'all 0.3s'
      }}>
        <div style={{
          width: viewportWidths[viewport],
          maxWidth: '100%', height: '100%',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          transition: 'width 0.3s ease',
          background: '#fff'
        }}>
          <iframe
            srcDoc={previewHTML}
            style={{ width: '100%', height: '100%', border: 'none', minHeight: '500px' }}
            title="Blog Preview"
          />
        </div>
      </div>

    </div>
  );
}
