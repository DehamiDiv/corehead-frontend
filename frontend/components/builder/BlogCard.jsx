'use client';

import { Calendar, User } from 'lucide-react';
import './BlogCard.css';

export default function BlogCard({ post, isSelected, onClick, contentMode, settings }) {
  const activePrimary = settings?.colors?.primary || '#667eea';
  const activeGradient = settings?.colors?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const fontStyle = settings?.fontStyle || 'inherit';
  const borderRadius = settings?.radiusValue || '16px';

  const cardStyle = {
    fontFamily: fontStyle,
    borderRadius: borderRadius,
    borderColor: isSelected ? activePrimary : (contentMode === 'dynamic' ? '#a78bfa' : '#e0e0e0'),
    boxShadow: isSelected ? `0 8px 20px ${activePrimary}33` : 'none',
  };

  return (
    <article 
      className={`blog-card ${isSelected ? 'selected' : ''} ${contentMode === 'dynamic' ? 'dynamic' : ''}`}
      onClick={onClick}
      style={cardStyle}
    >
      {contentMode === 'dynamic' && (
        <div className="card-badge" style={{ background: activeGradient }}>Template</div>
      )}
      
      <div className="card-image">
        <img src={post.image} alt={post.title} />
        <div className="card-category" style={{ background: activeGradient }}>{post.category}</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title" style={{ fontFamily: fontStyle }}>{post.title}</h3>
        <p className="card-excerpt" style={{ fontFamily: fontStyle }}>{post.excerpt}</p>
        
        <div className="card-meta">
          <div className="meta-item">
            <User size={14} color={activePrimary} />
            <span>{post.author}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} color={activePrimary} />
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="selection-indicator" style={{ borderColor: activePrimary, borderRadius: borderRadius }}></div>
      )}
    </article>
  );
}

