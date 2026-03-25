'use client';

import { X, ExternalLink, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function PreviewModal({ isOpen, onClose, blogPosts, contentMode }) {
  const [viewport, setViewport] = useState('desktop');

  if (!isOpen) return null;

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const previewHTML = `
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; background: #f9f7f4; color: #1a1a1a; padding: 40px 24px; }
        h1 { font-size: 2rem; margin-bottom: 32px; letter-spacing: -0.5px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .card img { width: 100%; height: 180px; object-fit: cover; }
        .card-body { padding: 20px; }
        .category { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; }
        .card-body h2 { font-size: 1.1rem; margin-bottom: 8px; line-height: 1.4; }
        .card-body p { font-size: 0.875rem; color: #555; line-height: 1.6; margin-bottom: 16px; }
        .meta { font-size: 0.75rem; color: #aaa; display: flex; justify-content: space-between; }
        .badge { display: inline-block; padding: 2px 10px; background: #f0f0f0; border-radius: 20px; font-size: 11px; }
      </style>
    </head>
    <body>
      <h1>Blog Posts ${contentMode === 'dynamic' ? '<span style="font-size:0.6em;color:#888;">(Dynamic Mode)</span>' : ''}</h1>
      <div class="grid">
        ${blogPosts.map(post => `
          <div class="card">
            <img src="${post.image}" alt="${post.title}" />
            <div class="card-body">
              <div class="category">${post.category}</div>
              <h2>${post.title}</h2>
              <p>${post.excerpt}</p>
              <div class="meta">
                <span>${post.author}</span>
                <span>${post.date}</span>
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
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Modal Header */}
      <div style={{
        width: '100%', maxWidth: '1100px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]].map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: viewport === key ? '#fff' : 'rgba(255,255,255,0.15)',
                color: viewport === key ? '#111' : '#fff',
                fontWeight: viewport === key ? '600' : '400',
                fontSize: '13px', transition: 'all 0.2s'
              }}
            >
              <Icon size={14} /> {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
            borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px'
          }}
        >
          <X size={14} /> Close
        </button>
      </div>

      {/* Preview Frame */}
      <div style={{
        width: '100%', maxWidth: '1100px', flex: 1, maxHeight: '75vh',
        background: '#e5e5e5', borderRadius: '12px', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '16px', transition: 'all 0.3s'
      }}>
        <div style={{
          width: viewportWidths[viewport], maxWidth: '100%',
          height: '100%', borderRadius: '8px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)', transition: 'width 0.3s ease'
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