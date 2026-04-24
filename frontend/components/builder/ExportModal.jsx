'use client';

import { useState } from 'react';
import { X, Download, Code, FileJson } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, blogPosts, contentMode }) {
  const [exportType, setExportType] = useState('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog Layout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f8f7f4; padding: 40px 24px; color: #1a1a1a; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 32px; color: #333; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .card img { width: 100%; height: 200px; object-fit: cover; }
    .card-body { padding: 20px; }
    .category { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #667eea; font-weight: 600; margin-bottom: 8px; }
    .card-body h2 { font-size: 1.1rem; margin-bottom: 8px; line-height: 1.4; }
    .card-body p { font-size: 0.875rem; color: #666; line-height: 1.6; margin-bottom: 16px; }
    .meta { font-size: 0.75rem; color: #aaa; display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f0f0f0; }
  </style>
</head>
<body>
  <h1>Blog Posts</h1>
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
    </div>`).join('')}
  </div>
</body>
</html>`;

  const generateJSON = () => JSON.stringify({
    contentMode,
    exportedAt: new Date().toISOString(),
    posts: blogPosts
  }, null, 2);

  const content = exportType === 'html' ? generateHTML() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], {
      type: exportType === 'html' ? 'text/html' : 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportType === 'html' ? 'blog-layout.html' : 'blog-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px',
        width: '100%', maxWidth: '680px',
        maxHeight: '85vh', display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
          borderRadius: '20px 20px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Download size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#333' }}>
                Export Layout
              </h2>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                {blogPosts.length} posts · {contentMode} mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.06)', border: 'none',
              borderRadius: '8px', padding: '6px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} color="#666" />
          </button>
        </div>

        {/* Format Selector */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { id: 'html', icon: Code,     label: 'HTML File' },
              { id: 'json', icon: FileJson,  label: 'JSON Data' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setExportType(id)}
                style={{
                  flex: 1, padding: '10px 16px',
                  border: `2px solid ${exportType === id ? '#667eea' : '#e5e5e5'}`,
                  borderRadius: '10px', cursor: 'pointer',
                  background: exportType === id
                    ? 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)'
                    : '#fff',
                  color: exportType === id ? '#667eea' : '#555',
                  fontWeight: exportType === id ? '700' : '500',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  fontSize: '14px', fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Preview */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '16px 24px' }}>
          <pre style={{
            background: '#1e1e2e', color: '#cdd6f4',
            borderRadius: '12px', padding: '16px',
            fontSize: '12px', lineHeight: 1.6,
            overflow: 'auto', height: '280px',
            fontFamily: 'monospace', margin: 0
          }}>
            {content.slice(0, 2000)}{content.length > 2000 ? '\n\n... (truncated, use Download to get full file)' : ''}
          </pre>
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex', gap: '10px'
        }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1, padding: '11px',
              border: '2px solid #e5e5e5', borderRadius: '10px',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              background: copied ? '#f0fdf4' : '#fff',
              color: copied ? '#16a34a' : '#555',
              borderColor: copied ? '#16a34a' : '#e5e5e5',
              fontFamily: 'inherit', transition: 'all 0.2s'
            }}
          >
            {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              flex: 2, padding: '11px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(102,126,234,0.4)'
            }}
          >
            <Download size={16} />
            Download {exportType.toUpperCase()} File
          </button>
        </div>

      </div>
    </div>
  );
}