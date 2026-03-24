'use client';

import { Calendar, User } from 'lucide-react';
import './BlogCard.css';

export default function BlogCard({ post, isSelected, onClick, contentMode }) {
  return (
    <article 
      className={`blog-card ${isSelected ? 'selected' : ''} ${contentMode === 'dynamic' ? 'dynamic' : ''}`}
      onClick={onClick}
    >
      {contentMode === 'dynamic' && (
        <div className="card-badge">Template</div>
      )}
      
      <div className="card-image">
        <img src={post.image} alt={post.title} />
        <div className="card-category">{post.category}</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-excerpt">{post.excerpt}</p>
        
        <div className="card-meta">
          <div className="meta-item">
            <User size={14} />
            <span>{post.author}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} />
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="selection-indicator"></div>
      )}
    </article>
  );
}