'use client';

import { useState } from 'react';
import { Sparkles, Eye, Code, FileText } from 'lucide-react';
import Sidebar from '@/components/builder/Sidebar';
import Link from 'next/link';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import CMSFieldsPanel from '@/components/builder/CMSFieldsPanel';
import PreviewModal from '@/components/builder/PreviewModal';
import ExportModal from '@/components/builder/ExportModal';
import './page.css';

export default function BlogBuilderPage() {
  const [activeTab, setActiveTab] = useState('builder');
  const [contentMode, setContentMode] = useState('static');
  const [selectedCard, setSelectedCard] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

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

  const handleAddAIPost = (newPost) => {
    setBlogPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="blog-builder">
      {/* Header */}
      <header className="builder-header">
        <div className="header-left">
          <Link href="/dashboard" className="logo" style={{ textDecoration: 'none' }}>
            CoreHead<span>.app</span>
          </Link>
          <div className="page-title">
            <FileText size={20} />
            <span>Blog Builder</span>
          </div>
        </div>

        <div className="header-actions">
          <Link href="/preview/1" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Eye size={18} />
            Preview
          </Link>
          <button className="btn-secondary" onClick={() => setExportOpen(true)}>
            <Code size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAiOpen(true); }}>
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

          {/* Tab Content */}
          {activeTab === 'builder' && (
            <BuilderCanvas
              blogPosts={blogPosts}
              contentMode={contentMode}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
            />
          )}

          {activeTab === 'components' && (
            <div className="tab-panel">
              <h2>Components</h2>
              <p>Drag and drop elements into your layout.</p>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="tab-panel">
              <h2>CMS Fields</h2>
              <p>Manage your post, author and SEO fields.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-panel">
              <h2>Settings</h2>
              <p>Configure fonts, colors, and spacing.</p>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="tab-panel">
              <h2>Preview</h2>
              <button className="btn-secondary" onClick={() => setPreviewOpen(true)}>
                <Eye size={18} /> Open Preview
              </button>
            </div>
          )}
        </main>

        {/* Right Panel */}
        <CMSFieldsPanel
          cmsFields={cmsFields}
          selectedCard={selectedCard}
          contentMode={contentMode}
        />
      </div>

      {/* Modals */}
      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        blogPosts={blogPosts}
        contentMode={contentMode}
      />

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        blogPosts={blogPosts}
        contentMode={contentMode}
      />

      
    </div>
  );
}