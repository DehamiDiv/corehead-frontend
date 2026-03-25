'use client';

import { useState } from 'react';
import { Sparkles, Eye, Code, FileText } from 'lucide-react';
import Sidebar from '@/components/builder/Sidebar';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import CMSFieldsPanel from '@/components/builder/CMSFieldsPanel';
import './page.css';

export default function BlogBuilderPage() {
  const [activeTab, setActiveTab] = useState('builder');
  const [contentMode, setContentMode] = useState('static');
  const [selectedCard, setSelectedCard] = useState(null);
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'Getting Started with React',
      excerpt: 'Learn the fundamentals of React and start building amazing web applications.',
      author: 'John Doe',
      date: '2024-02-10',
      image: 'https://picsum.photos/400/250?random=1',
      category: 'Development'
    },
    {
      id: 2,
      title: 'Advanced CSS Techniques',
      excerpt: 'Master modern CSS features and create stunning designs with ease.',
      author: 'Jane Smith',
      date: '2024-02-12',
      image: 'https://picsum.photos/400/250?random=2',
      category: 'Design'
    },
    {
      id: 3,
      title: 'JavaScript ES2024 Features',
      excerpt: 'Explore the latest features in JavaScript and how to use them effectively.',
      author: 'Mike Johnson',
      date: '2024-02-13',
      image: 'https://picsum.photos/400/250?random=3',
      category: 'Development'
    }
  ]);

  const [cmsFields] = useState({
    post: ['Title', 'Excerpt', 'Content', 'Featured Image', 'Category', 'Tags'],
    author: ['Name', 'Bio', 'Avatar', 'Social Links'],
    seo: ['Meta Title', 'Meta Description', 'Keywords', 'OG Image']
  });

  const handleAIGenerate = () => {
    alert('AI Layout Generation: This would generate a new blog layout based on your content and preferences.');
  };

  return (
    <div className="blog-builder">
      {/* Header */}
      <header className="builder-header">
        <div className="header-left">
          <h1 className="logo">CoreHead<span>.app</span></h1>
          <div className="page-title">
            <FileText size={20} />
            <span>Blog Builder</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="btn-secondary">
            <Eye size={18} />
            Preview
          </button>
          <button className="btn-secondary">
            <Code size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={handleAIGenerate}>
            <Sparkles size={18} />
            Generate with AI
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="builder-content">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="builder-main">
          {/* Toolbar */}
          <div className="builder-toolbar">
            <div className="mode-toggle">
              <button 
                className={contentMode === 'static' ? 'active' : ''}
                onClick={() => setContentMode('static')}
              >
                Static Content
              </button>
              <button 
                className={contentMode === 'dynamic' ? 'active' : ''}
                onClick={() => setContentMode('dynamic')}
              >
                Dynamic Content
              </button>
            </div>
            
            <div className="toolbar-right">
              <select className="layout-select">
                <option>Grid Layout</option>
                <option>List Layout</option>
                <option>Masonry Layout</option>
              </select>
            </div>
          </div>

          {/* Canvas */}
          <BuilderCanvas 
            blogPosts={blogPosts}
            contentMode={contentMode}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        </main>

        {/* Right Panel */}
        <CMSFieldsPanel 
          cmsFields={cmsFields}
          selectedCard={selectedCard}
          contentMode={contentMode}
        />
      </div>
    </div>
  );
}

