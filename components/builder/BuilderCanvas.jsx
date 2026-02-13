'use client';

import BlogCard from './BlogCard';
import './BuilderCanvas.css';

export default function BuilderCanvas({ blogPosts, contentMode, selectedCard, setSelectedCard }) {
  return (
    <div className="builder-canvas">
      <div className="canvas-container">
        <div className="blog-loop">
          <div className="loop-header">
            <h2>Blog Collection</h2>
            <div className="loop-info">
              <span className="badge">{contentMode === 'dynamic' ? 'Dynamic' : 'Static'}</span>
              <span className="count">{blogPosts.length} posts</span>
            </div>
          </div>
          
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isSelected={selectedCard === post.id}
                onClick={() => setSelectedCard(post.id)}
                contentMode={contentMode}
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