'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { aiApi } from '@/services/aiApi';

const layoutTypes = [
  { id: 'single-post',   label: 'Single Post' },
  { id: 'blog-archive',  label: 'Blog Archive' },
];

const designStyles = [
  { id: 'modern',      label: '✨ Modern' },
  { id: 'editorial',   label: '📰 Editorial' },
  { id: 'magazine',    label: '🗞️ Magazine' },
  { id: 'minimalist',  label: '⬜ Minimalist' },
];

export default function AIGenerateModal({ isOpen, onClose, onGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [layoutType, setLayoutType] = useState('single-post');
  const [designStyle, setDesignStyle] = useState('modern');
  const [features, setFeatures] = useState({
    sidebar: true, toc: true, author: true,
    related: false, comments: false, social: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await aiApi.generateLayout({
        prompt: prompt.trim(),
        layoutType,
        designStyle,
        features,
      });

      // Pass generated layout back to builder page
      if (result.layout?.cards) {
        onGenerated(result.layout.cards);
      } else {
        // Fallback — add a single AI post card
        onGenerated([{
          id: Date.now(),
          title: 'AI Generated: ' + prompt.slice(0, 40),
          excerpt: 'Layout generated with style: ' + designStyle,
          author: 'AI Author',
          date: new Date().toISOString().split('T')[0],
          image: 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 100),
          category: layoutType
        }]);
      }

      onClose();
      setPrompt('');

    } catch (err) {
      setError(err.message || 'Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px',
        width: '100%', maxWidth: '520px',
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#4f46e5" />
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
              Generate with AI
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px',
              borderRadius: '6px', color: '#888'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px' }}>

          {/* Prompt */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              ✍️ Describe your layout
            </label>
            <textarea
  value={prompt}
  onChange={e => { setPrompt(e.target.value); setError(null); }}
  placeholder="e.g. Modern blog with full-width hero, sidebar with TOC, and related posts at the bottom"
  rows={3}
  style={{
    width: '100%', padding: '10px 12px',
    border: '2px solid #e5e5e5', borderRadius: '8px',
    fontSize: '13px', resize: 'vertical',
    fontFamily: 'inherit', boxSizing: 'border-box',
    outline: 'none',
    color: '#1a1a1a',           // ← make sure text is visible
    background: '#ffffff',      // ← white background
    lineHeight: '1.5'
  }}
  onFocus={e => e.target.style.borderColor = '#4f46e5'}
  onBlur={e => e.target.style.borderColor = '#e5e5e5'}
/>
            
          </div>

          {/* Layout Type */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              📄 Layout Type
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {layoutTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setLayoutType(type.id)}
                  style={{
                    flex: 1, padding: '8px 12px',
                    border: `2px solid ${layoutType === type.id ? '#4f46e5' : '#e5e5e5'}`,
                    borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                    background: layoutType === type.id ? '#eff6ff' : '#fff',
                    color: layoutType === type.id ? '#4f46e5' : '#444',
                    fontWeight: layoutType === type.id ? '600' : '400'
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Design Style */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              🎨 Design Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {designStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setDesignStyle(style.id)}
                  style={{
                    padding: '8px 12px',
                    border: `2px solid ${designStyle === style.id ? '#4f46e5' : '#e5e5e5'}`,
                    borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                    background: designStyle === style.id ? '#eff6ff' : '#fff',
                    color: designStyle === style.id ? '#4f46e5' : '#444',
                    fontWeight: designStyle === style.id ? '600' : '400'
                  }}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              🔧 Features
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {Object.entries(features).map(([key, value]) => (
                <label
                  key={key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', border: '1px solid #e5e5e5',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '12px',
                    background: value ? '#eff6ff' : '#fff',
                    borderColor: value ? '#bfdbfe' : '#e5e5e5'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleFeature(key)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ textTransform: 'capitalize', fontWeight: value ? '600' : '400' }}>
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', background: '#fef2f2',
              border: '1px solid #fecaca', borderRadius: '8px',
              fontSize: '13px', color: '#dc2626', marginBottom: '16px'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#a5b4fc' : '#4f46e5',
              color: '#fff', border: 'none',
              borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: '600',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <Sparkles size={18} />
            {loading ? 'Generating...' : 'Generate Layout'}
          </button>

        </div>
      </div>
    </div>
  );
}