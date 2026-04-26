'use client';

import { useEffect } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './page.css';
import { useRouter } from 'next/navigation';

export default function AITemplatesPage() {
  const router = useRouter();

  // Protect the page - must be logged in to use AI features
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?callback=/ai-templates');
    }
  }, [router]);

  const templates = [
    {
      id: 'minimal-single',
      icon: '📄',
      name: 'Minimal Single Post',
      description: 'Full-width centered layout, no sidebar, clean typography',
      tags: ['Hero image', 'Centered content', 'Author card']
    },
    {
      id: 'magazine',
      icon: '📰',
      name: 'Magazine Layout',
      description: 'Main content + right sidebar with table of contents and widgets',
      tags: ['Sidebar', 'TOC', 'Related posts']
    },
    {
      id: 'card-grid',
      icon: '🎴',
      name: 'Card Grid Archive',
      description: '3-column responsive grid with post cards and featured images',
      tags: ['Grid layout', 'Post cards', 'Pagination']
    },
    {
      id: 'long-form',
      icon: '📝',
      name: 'Long-form Article',
      description: 'Reading-optimized with sticky TOC, progress bar, and footnotes',
      tags: ['Sticky nav', 'Progress bar', 'Drop caps']
    },
    {
      id: 'portfolio',
      icon: '🎨',
      name: 'Portfolio Showcase',
      description: 'Image-heavy layout with masonry gallery and project details',
      tags: ['Gallery', 'Full-width images', 'Masonry grid']
    }
  ];

  const handleUseTemplate = (templateId, templateName) => {
    localStorage.setItem('selected_template', JSON.stringify({ id: templateId, name: templateName }));
    router.push('/builder');
  };

  return (
    <div className="ai-generator">
      {/* Header */}
      <div className="generator-header">
        <div className="header-content">
          <h1>AI Layout Generator</h1>
          <p>Describe your vision, we'll build the perfect layout</p>
        </div>
        <button className="btn-generate" onClick={() => router.push('/builder')}>
          <Sparkles size={20} />
          Generate Layout
        </button>
      </div>

      {/* Navigation */}
      <div className="generator-nav">
        <Link href="/ai-prompt" className="nav-item">
          Prompt
        </Link>
        <Link href="/ai-options" className="nav-item">
          Options
        </Link>
        <Link href="/ai-templates" className="nav-item active">
          Quick templates
        </Link>
        <Link href="/ai-history" className="nav-item">History</Link>
      </div>

      {/* Content */}
      <div className="generator-content">
        <div className="templates-tab">
          <div className="templates-header">
            <h3>Choose a pre-configured template</h3>
            <p>Start with a proven layout and customize it with AI</p>
          </div>

          <div className="templates-list">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-icon">{template.icon}</div>
                <div className="template-content">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <div className="template-tags">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <button
                  className="btn-use-template"
                  onClick={() => handleUseTemplate(template.id, template.name)}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <Link href="/ai-prompt" className="btn-back">
              <ArrowLeft size={18} />
              Back to Prompt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}