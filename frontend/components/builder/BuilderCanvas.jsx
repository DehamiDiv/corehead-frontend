'use client';

import BlogCard from './BlogCard';
import './BuilderCanvas.css';

export default function BuilderCanvas({ blogPosts, contentMode, selectedCard, setSelectedCard, settings }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${settings.columns || 3}, 1fr)`,
    gap: settings.spacingValue || '16px',
    padding: '20px'
  };

  return (
    <div className="builder-canvas">
      <div className="canvas-container">
        <div className="blog-loop">
          <div className="loop-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1e2e' }}>Blog Collection</h2>
            <div className="loop-info">
              <span className="badge" style={{ background: settings.colors?.gradient || '#4f46e5' }}>
                {contentMode === 'dynamic' ? 'Dynamic' : 'Static'}
              </span>
              <span className="count">{blogPosts.length} posts</span>
            </div>
          </div>
          
          <div className="blog-grid" style={gridStyle}>
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isSelected={selectedCard?.id === post.id}
                onClick={() => setSelectedCard(post)}
                contentMode={contentMode}
                settings={settings}
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