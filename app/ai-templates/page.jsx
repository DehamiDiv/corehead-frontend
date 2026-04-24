'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { aiApi } from '@/services/aiApi';
import './page.css';

export default function AITemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null); // track which template is loading
  const [error, setError] = useState(null);

  const templates = [
    {
      id: 'minimal-single',
      icon: '📄',
      name: 'Minimal Single Post',
      description: 'Full-width centered layout, no sidebar, clean typography',
      tags: ['Hero image', 'Centered content', 'Author card'],
      // pre-filled options for this template
      layoutType: 'single-post',
      designStyle: 'minimalist',
      features: { sidebar: false, toc: false, author: true, related: false, comments: false, social: true },
      prompt: 'Create a minimal single post layout with full-width hero image, centered content, clean typography, author card at the bottom, and social sharing buttons.'
    },
    {
      id: 'magazine',
      icon: '📰',
      name: 'Magazine Layout',
      description: 'Main content + right sidebar with table of contents and widgets',
      tags: ['Sidebar', 'TOC', 'Related posts'],
      layoutType: 'single-post',
      designStyle: 'magazine',
      features: { sidebar: true, toc: true, author: true, related: true, comments: false, social: true },
      prompt: 'Create a magazine style single post layout with main content area, right sidebar containing table of contents and widgets, related posts at the bottom.'
    },
    {
      id: 'card-grid',
      icon: '🎴',
      name: 'Card Grid Archive',
      description: '3-column responsive grid with post cards and featured images',
      tags: ['Grid layout', 'Post cards', 'Pagination'],
      layoutType: 'blog-archive',
      designStyle: 'modern',
      features: { sidebar: false, toc: false, author: false, related: false, comments: false, social: false },
      prompt: 'Create a blog archive layout with a 3-column responsive card grid, each card showing featured image, category, title, excerpt, author and date. Include pagination at the bottom.'
    },
    {
      id: 'long-form',
      icon: '📝',
      name: 'Long-form Article',
      description: 'Reading-optimized with sticky TOC, progress bar, and footnotes',
      tags: ['Sticky nav', 'Progress bar', 'Drop caps'],
      layoutType: 'single-post',
      designStyle: 'editorial',
      features: { sidebar: true, toc: true, author: true, related: true, comments: true, social: true },
      prompt: 'Create a long-form article layout optimized for reading, with sticky table of contents on the left, reading progress bar at the top, drop caps, footnotes support, author bio, and comments section.'
    },
    {
      id: 'portfolio',
      icon: '🎨',
      name: 'Portfolio Showcase',
      description: 'Image-heavy layout with masonry gallery and project details',
      tags: ['Gallery', 'Full-width images', 'Masonry grid'],
      layoutType: 'blog-archive',
      designStyle: 'modern',
      features: { sidebar: false, toc: false, author: true, related: true, comments: false, social: true },
      prompt: 'Create a portfolio showcase layout with masonry image grid, full-width featured images, project detail cards, author section, and related projects at the bottom.'
    }
  ];

  const handleUseTemplate = async (template) => {
    try {
      setLoading(true);
      setLoadingId(template.id);
      setError(null);

      // Call backend with pre-filled template options — no prompt page needed
      const result = await aiApi.generateLayout({
        prompt: template.prompt,
        layoutType: template.layoutType,
        designStyle: template.designStyle,
        features: template.features,
      });

      // Save generated layout for builder page
      localStorage.setItem('ai_generated_layout', JSON.stringify(result.layout));

      // Go to builder
      router.push('/builder');

    } catch (err) {
      setError(err.message || 'Failed to generate template. Please try again.');
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  return (
    <div className="ai-generator">

      {/* Header */}
      <div className="generator-header">
        <div className="header-content">
          <h1>AI Layout Generator</h1>
          <p>Describe your vision, we'll build the perfect layout</p>
        </div>
        <button className="btn-generate" disabled={loading}>
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Layout'}
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
            <Link href="/ai-history" className="nav-item">
            History
        </Link>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          ❌ {error}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="loading-spinner" />
            <h3>Generating your layout...</h3>
            <p>AI is building your custom blog layout. This may take a few seconds.</p>
          </div>
        </div>
      )}

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
                  onClick={() => handleUseTemplate(template)}
                  disabled={loading}
                >
                  {loadingId === template.id ? '⏳ Generating...' : 'Use Template'}
                </button>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <Link href="/ai-options" className="btn-back">
              <ArrowLeft size={18} />
              Back to Options
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}