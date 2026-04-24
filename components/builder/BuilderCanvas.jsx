'use client';

import BlogCard from './BlogCard';
import './BuilderCanvas.css';

export default function BuilderCanvas({
  blogPosts,
  contentMode,
  selectedCard,
  setSelectedCard,
  settings,
  onDeleteCard
}) {
  return (
    <div className="builder-canvas">
      <div className="canvas-container">
        <div className="blog-loop">

          {/* Header */}
          <div className="loop-header">
            <h2>Blog Collection</h2>
            <div className="loop-info">
              <span className="badge">
                {contentMode === 'dynamic' ? 'Dynamic' : 'Static'}
              </span>
              <span className="count">{blogPosts.length} posts</span>
            </div>
          </div>

          {/* Empty State */}
          {blogPosts.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              color: '#888', border: '2px dashed #e5e5e5',
              borderRadius: '12px', marginTop: '20px'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px' }}>
                No cards yet
              </p>
              <p style={{ fontSize: '13px', margin: 0 }}>
                Go to Components tab and add some blocks
              </p>
            </div>
          )}

          {/* Cards Grid */}
          <div
            className="blog-grid"
            style={{
              gridTemplateColumns: `repeat(${settings?.columns || 3}, 1fr)`,
              gap: settings?.spacingValue || '16px',
              fontFamily: settings?.fontStyle || 'Inter, sans-serif',
            }}
          >
            {blogPosts.map((post) => (
              <div key={post.id} style={{ position: 'relative' }}>

                {/* ✅ FIX — pass whole post object, compare by id */}
                <BlogCard
                  post={post}
                  isSelected={selectedCard?.id === post.id}
                  onClick={() => setSelectedCard(post)}
                  contentMode={contentMode}
                  settings={settings}
                />

                {/* Delete Button */}
                {onDeleteCard && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Remove this card?')) {
                        onDeleteCard(post.id);
                      }
                    }}
                    style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(239,68,68,0.9)', color: '#fff',
                      border: 'none', borderRadius: '6px',
                      padding: '4px 8px', cursor: 'pointer',
                      fontSize: '12px', zIndex: 10,
                      opacity: selectedCard?.id === post.id ? 1 : 0,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  >
                    🗑️ Remove
                  </button>
                )}

              </div>
            ))}
          </div>

          {/* Dynamic mode indicator */}
          {contentMode === 'dynamic' && blogPosts.length > 0 && (
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