'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save, Sparkles } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Homepage Layout',
  'Blog Archive',
  'Single Post',
  'Portfolio Grid',
  'Magazine Style',
  'Minimal Blog',
];

export default function SaveLayoutModal({ isOpen, onClose, onSave, isSaving }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (value) => {
    if (!value.trim()) return 'Please enter a layout name.';
    if (value.trim().length < 3) return 'Name must be at least 3 characters.';
    return '';
  };

  const handleSave = () => {
    const err = validate(name);
    if (err) { setError(err); return; }
    onSave(name.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  const handleSuggestion = (suggestion) => {
    setName(suggestion);
    setError('');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      animation: 'fadeIn 0.15s ease'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        animation: 'slideUp 0.2s ease',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Save size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>
                Save Layout
              </h2>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                Give your layout a memorable name
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.06)', border: 'none',
              cursor: 'pointer', padding: '6px', borderRadius: '8px',
              color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>

          {/* Name Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              fontWeight: '600', color: '#374151', marginBottom: '8px'
            }}>
              Layout Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. My Homepage Layout"
              maxLength={60}
              style={{
                width: '100%', padding: '11px 14px',
                border: `2px solid ${error ? '#fca5a5' : '#e5e5e5'}`,
                borderRadius: '10px', fontSize: '14px',
                fontFamily: 'inherit', boxSizing: 'border-box',
                outline: 'none', color: '#1a1a1a',
                background: error ? '#fff5f5' : '#fff',
                transition: 'border-color 0.15s'
              }}
              onFocus={e => !error && (e.target.style.borderColor = '#4f46e5')}
              onBlur={e => !error && (e.target.style.borderColor = '#e5e5e5')}
            />
            {/* Character count */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: '4px'
            }}>
              {error
                ? <span style={{ fontSize: '12px', color: '#ef4444' }}>⚠️ {error}</span>
                : <span style={{ fontSize: '12px', color: '#aaa' }}>Press Enter to save quickly</span>
              }
              <span style={{ fontSize: '11px', color: '#ccc' }}>{name.length}/60</span>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '10px'
            }}>
              <Sparkles size={13} color="#4f46e5" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>
                Quick suggestions
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    padding: '5px 12px',
                    border: `1.5px solid ${name === s ? '#4f46e5' : '#e5e5e5'}`,
                    borderRadius: '20px', cursor: 'pointer',
                    fontSize: '12px', fontFamily: 'inherit',
                    background: name === s ? '#f5f3ff' : '#fafafa',
                    color: name === s ? '#4f46e5' : '#555',
                    fontWeight: name === s ? '600' : '400',
                    transition: 'all 0.12s'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '11px',
                border: '1.5px solid #e5e5e5', borderRadius: '10px',
                cursor: 'pointer', fontSize: '14px',
                fontWeight: '500', background: '#fff', color: '#555',
                fontFamily: 'inherit'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                flex: 2, padding: '11px',
                background: isSaving ? '#a5b4fc' : '#4f46e5',
                color: '#fff', border: 'none',
                borderRadius: '10px', cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: '600',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                fontFamily: 'inherit', transition: 'background 0.2s'
              }}
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Layout'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}