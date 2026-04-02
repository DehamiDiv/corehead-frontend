'use client';

import { X, Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';

function generateHTML(blogPosts, contentMode) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #f9f7f4; color: #1a1a1a; padding: 40px 24px; }
    h1 { font-size: 2rem; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .card img { width: 100%; height: 180px; object-fit: cover; }
    .card-body { padding: 20px; }
    .category { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; }
    .card-body h2 { font-size: 1.1rem; margin-bottom: 8px; }
    .card-body p { font-size: 0.875rem; color: #555; line-height: 1.6; margin-bottom: 16px; }
    .meta { font-size: 0.75rem; color: #aaa; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <h1>Blog Posts</h1>
  <div class="grid">
    ${blogPosts.map(post => `    <div class="card">
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
    </div>`).join('\n    ')}
  </div>
</body>
</html>`;
}

function generateJSON(blogPosts) {
  return JSON.stringify({ posts: blogPosts, exportedAt: new Date().toISOString() }, null, 2);
}

export default function ExportModal({ isOpen, onClose, blogPosts, contentMode }) {
  const [tab, setTab] = useState('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = tab === 'html' ? generateHTML(blogPosts, contentMode) : generateJSON(blogPosts);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = tab === 'html' ? 'html' : 'json';
    const mime = tab === 'html' ? 'text/html' : 'application/json';
    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-export.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: '#1a1a2e', borderRadius: '16px', width: '100%', maxWidth: '760px',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>Export Blog</h2>
            <p style={{ color: '#888', fontSize: '13px', marginTop: '2px' }}>
              Download or copy your blog as HTML or JSON
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', color: '#aaa',
            borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex'
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0' }}>
          {['html', 'json'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: tab === t ? '#4f46e5' : 'rgba(255,255,255,0.06)',
              color: tab === t ? '#fff' : '#888',
              fontSize: '13px', fontWeight: tab === t ? 600 : 400,
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Code */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <pre style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
            padding: '16px', fontSize: '12px', color: '#a8d8a8',
            lineHeight: '1.7', overflow: 'auto', whiteSpace: 'pre-wrap',
            wordBreak: 'break-word', fontFamily: "'Fira Code', 'Courier New', monospace"
          }}>
            {code}
          </pre>
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', gap: '12px', justifyContent: 'flex-end'
        }}>
          <button onClick={handleCopy} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: copied ? '#22c55e' : 'rgba(255,255,255,0.1)',
            color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            transition: 'all 0.2s'
          }}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleDownload} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: '#4f46e5', color: '#fff', cursor: 'pointer',
            fontSize: '14px', fontWeight: 500
          }}>
            <Download size={15} /> Download .{tab}
          </button>
        </div>
      </div>
    </div>
  );
}