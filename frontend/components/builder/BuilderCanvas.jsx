'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import './BuilderCanvas.css';

const CARD_STYLES = [
  { id: 'grid',    label: '⊞ Grid',    desc: 'Classic card grid' },
  { id: 'list',    label: '☰ List',    desc: 'Horizontal rows' },
  { id: 'overlay', label: '◫ Overlay', desc: 'Image + text overlap' },
  { id: 'minimal', label: '✦ Minimal', desc: 'Typography-only, no image' },
];

export default function BuilderCanvas({ blogPosts, contentMode, selectedCard, setSelectedCard, settings, onDeleteCard }) {
  const [cardLayout, setCardLayout] = useState('grid');

  const activePrimary = settings?.colors?.primary || '#4f46e5';
  const activeGradient = settings?.colors?.gradient || 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)';

  const isStackedLayout = cardLayout === 'list' || cardLayout === 'minimal';
  const gridStyle = isStackedLayout
    ? { display: 'flex', flexDirection: 'column', gap: settings.spacingValue || '16px', padding: '20px' }
    : {
        display: 'grid',
        gridTemplateColumns: `repeat(${settings.columns || 3}, 1fr)`,
        gap: settings.spacingValue || '16px',
        padding: '20px',
      };

  return (
    <div className="builder-canvas">
      <div className="canvas-container">
        <div className="blog-loop">

          {/* Loop Header */}
          <div className="loop-header" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1e2e', margin: 0 }}>
              Blog Collection
            </h2>
            <div className="loop-info">
              <span className="badge" style={{ background: activeGradient }}>
                {contentMode === 'dynamic' ? '⚡ Dynamic' : '📌 Static'}
              </span>
              <span className="count">{blogPosts.length} posts</span>
            </div>
          </div>

          {/* ── Card Style Picker ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            padding: '10px 14px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px' }}>
              Card Style:
            </span>
            {CARD_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setCardLayout(style.id)}
                title={style.desc}
                style={{
                  padding: '6px 14px',
                  border: '2px solid',
                  borderColor: cardLayout === style.id ? activePrimary : '#e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: cardLayout === style.id ? '700' : '500',
                  background: cardLayout === style.id ? `${activePrimary}12` : '#fff',
                  color: cardLayout === style.id ? activePrimary : '#64748b',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Blog Cards Grid */}
          <div className="blog-grid" style={gridStyle}>
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isSelected={selectedCard?.id === post.id}
                onClick={() => setSelectedCard(post)}
                contentMode={contentMode}
                settings={settings}
                cardLayout={cardLayout}
              />
            ))}
          </div>

          {contentMode === 'dynamic' && (
            <div className="loop-template-indicator">
              <div className="indicator-line"></div>
              <span>↑ Template repeats for each post in collection</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}