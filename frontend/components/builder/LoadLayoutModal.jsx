'use client';

import { useState, useEffect, useRef } from 'react';
import { X, FolderOpen, Trash2, Search } from 'lucide-react';

export default function LoadLayoutModal({
  isOpen,
  onClose,
  layouts,
  onLoad,
  onDelete,
  loading
}) {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLayouts = (layouts || []).filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>

      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: '#f9fafb', // softer light background
        borderRadius: '18px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FolderOpen size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                color: '#111827', // FIXED (dark text)
                fontWeight: '600'
              }}>
                Load Layout
              </h3>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#6b7280'
              }}>
                Select a saved layout
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{
            background: '#e5e7eb',
            border: 'none',
            padding: '6px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <X size={18} color="#374151" />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '8px 12px',
            background: '#ffffff'
          }}>
            <Search size={16} color="#9ca3af" />
            <input
              ref={inputRef}
              placeholder="Search layouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                background: 'transparent',
                color: '#111827'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{
          maxHeight: '320px',
          overflowY: 'auto',
          padding: '0 16px 16px'
        }}>

          {loading && (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              ⏳ Loading layouts...
            </p>
          )}

          {!loading && filteredLayouts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px 0' }}>
              No templates yet.
            </p>
          )}

          {!loading && filteredLayouts.map(layout => (
            <div
              key={layout.id}
              onClick={() => onLoad(layout.id)}
              style={{
                padding: '12px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#ffffff',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
            >
              <div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#111827'
                }}>
                  {layout.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {layout.content_mode} · {new Date(layout.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  color: '#4f46e5',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  Load →
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(layout.id);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#ef4444'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: '#4f46e5',
              color: '#ffffff',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}