'use client';

import { useState } from 'react';
import { ArrowLeft, Monitor, Tablet, Smartphone, Edit, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import './page.css';

export default function PreviewPage() {
  const [deviceView, setDeviceView] = useState('desktop');
  
  // Sample post data (in real app, fetch from API using postId)
  const post = {
    id: 1,
    title: 'Getting Started with React: A Comprehensive Guide',
    excerpt: 'Learn the fundamentals of React and start building amazing web applications with this step-by-step guide.',
    content: `
# Introduction to React

React is a powerful JavaScript library for building user interfaces. Created by Facebook, it has become one of the most popular tools for modern web development.

## Why Choose React?

React offers several advantages:

- **Component-Based Architecture**: Build encapsulated components that manage their own state
- **Virtual DOM**: Efficient rendering and better performance
- **Huge Ecosystem**: Access to countless libraries and tools
- **Strong Community**: Get support from millions of developers worldwide

## Getting Started

To start with React, you'll need Node.js installed on your machine. Then you can create a new React app:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## Core Concepts

### Components

Components are the building blocks of React applications. Here's a simple example:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

### State and Props

State allows components to manage their own data, while props enable data flow between components.

### Hooks

Hooks let you use state and other React features without writing a class:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## Conclusion

React provides a robust foundation for building modern web applications. Start learning today and join millions of developers creating amazing user experiences!
    `,
    author: 'John Doe',
    date: '2024-02-10',
    category: 'Development',
    tags: ['React', 'JavaScript', 'Web Development'],
    featuredImage: 'https://picsum.photos/1200/600?random=1'
  };

  const deviceSizes = {
    desktop: { width: '100%', label: 'Desktop' },
    tablet: { width: '768px', label: 'Tablet' },
    mobile: { width: '375px', label: 'Mobile' }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      alert('Share URL: ' + window.location.href);
    }
  };

  return (
    <div className="preview-page">
      {/* Header */}
      <header className="preview-header">
        <div className="header-left">
          <Link href="/posts">
            <button className="btn-back">
              <ArrowLeft size={18} />
              Back to Posts
            </button>
          </Link>
          <div className="preview-title">
            <h1>Preview Mode</h1>
            <span className="post-status draft">Draft</span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="device-toggle">
            <button 
              className={deviceView === 'desktop' ? 'active' : ''}
              onClick={() => setDeviceView('desktop')}
              title="Desktop View"
            >
              <Monitor size={18} />
            </button>
            <button 
              className={deviceView === 'tablet' ? 'active' : ''}
              onClick={() => setDeviceView('tablet')}
              title="Tablet View"
            >
              <Tablet size={18} />
            </button>
            <button 
              className={deviceView === 'mobile' ? 'active' : ''}
              onClick={() => setDeviceView('mobile')}
              title="Mobile View"
            >
              <Smartphone size={18} />
            </button>
          </div>
          
          <button className="btn-secondary" onClick={handleShare}>
            <Share2 size={18} />
            Share
          </button>
          
          <Link href={`/posts/${post.id}/edit`}>
            <button className="btn-secondary">
              <Edit size={18} />
              Edit
            </button>
          </Link>
          
          <button className="btn-primary">
            <ExternalLink size={18} />
            View Live
          </button>
        </div>
      </header>

      {/* Preview Container */}
      <div className="preview-container">
        <div className="device-frame" style={{ maxWidth: deviceSizes[deviceView].width }}>
          <div className="preview-content">
            {/* Blog Post Preview */}
            <article className="blog-post">
              {/* Featured Image */}
              <div className="post-hero">
                <img src={post.featuredImage} alt={post.title} />
              </div>

              {/* Post Header */}
              <div className="post-header-section">
                <div className="post-meta">
                  <span className="category-tag">{post.category}</span>
                  <span className="post-date">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                <h1 className="post-title">{post.title}</h1>
                
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="author-info">
                  <div className="author-avatar">
                    {post.author.charAt(0)}
                  </div>
                  <div className="author-details">
                    <span className="author-name">{post.author}</span>
                    <span className="read-time">5 min read</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="post-body">
                <div className="markdown-content">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    // Simple markdown parser for preview
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={index}>{paragraph.replace('# ', '')}</h1>;
                    } else if (paragraph.startsWith('## ')) {
                      return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                    } else if (paragraph.startsWith('```')) {
                      const code = paragraph.replace(/```\w*\n?/g, '');
                      return (
                        <pre key={index}>
                          <code>{code}</code>
                        </pre>
                      );
                    } else if (paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={index}>
                          {items.map((item, i) => (
                            <li key={i}>{item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                          ))}
                        </ul>
                      );
                    } else if (paragraph.trim()) {
                      return <p key={index} dangerouslySetInnerHTML={{ 
                        __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />;
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* Device Size Label */}
      <div className="device-label">
        {deviceSizes[deviceView].label} View {deviceView !== 'desktop' && `(${deviceSizes[deviceView].width})`}
      </div>
    </div>
  );
}