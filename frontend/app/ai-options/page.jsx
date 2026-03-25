'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './page.css';

export default function AIOptionsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('single-post');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [features, setFeatures] = useState({
    sidebar: true,
    toc: true,
    author: true,
    related: false,
    comments: false,
    social: false
  });

  const layoutTypes = [
    { 
      id: 'single-post', 
      name: 'Single Post Template', 
      description: 'Individual blog article layout with full content display' 
    },
    { 
      id: 'blog-archive', 
      name: 'Blog Archive', 
      description: 'Post listing page with grid or list view' 
    }
  ];

  const designStyles = [
    { 
      id: 'modern', 
      name: 'Modern & Clean', 
      description: 'Contemporary design with minimal aesthetics' 
    },
    { 
      id: 'editorial', 
      name: 'Classic Editorial', 
      description: 'Traditional blog style with serif fonts' 
    },
    { 
      id: 'magazine', 
      name: 'Magazine Layout', 
      description: 'Multi-column editorial design' 
    },
    { 
      id: 'minimalist', 
      name: 'Minimalist', 
      description: 'Ultra-clean with maximum white space' 
    }
  ];

  const handleFeatureToggle = (feature) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleGenerate = () => {
    alert('AI Layout would be generated!\n\nTemplate: ' + selectedTemplate + '\nStyle: ' + selectedStyle);
  };

  return (
    <div className="ai-generator">
      {/* Header */}
      <div className="generator-header">
        <div className="header-content">
          <h1>AI Layout Generator</h1>
          <p>Describe your vision, we'll build the perfect layout</p>
        </div>
        <button className="btn-generate" onClick={handleGenerate}>
          <Sparkles size={20} />
          Generate Layout
        </button>
      </div>

      {/* Navigation */}
      <div className="generator-nav">
        <Link href="/ai-prompt" className="nav-item">
          Prompt
        </Link>
        <Link href="/ai-options" className="nav-item active">
          Options
        </Link>
        <Link href="/ai-templates" className="nav-item">
          Quick templates
        </Link>
      </div>

      {/* Content */}
      <div className="generator-content">
        <div className="options-tab">
          <div className="option-section">
            <h3>📄 Layout Type</h3>
            <div className="option-grid">
              {layoutTypes.map(type => (
                <div 
                  key={type.id}
                  className={`option-card ${selectedTemplate === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(type.id)}
                >
                  <div className="option-header">
                    <h4>{type.name}</h4>
                    {selectedTemplate === type.id && (
                      <span className="check-icon">✓</span>
                    )}
                  </div>
                  <p>{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="option-section">
            <h3>🎨 Design Style</h3>
            <div className="option-grid">
              {designStyles.map(style => (
                <div 
                  key={style.id}
                  className={`option-card ${selectedStyle === style.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="option-header">
                    <h4>{style.name}</h4>
                    {selectedStyle === style.id && (
                      <span className="check-icon">✓</span>
                    )}
                  </div>
                  <p>{style.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="option-section">
            <h3>🔧 Key Features to Include</h3>
            <div className="features-list">
              <label className="feature-item">
                <input 
                  type="checkbox" 
                  checked={features.sidebar}
                  onChange={() => handleFeatureToggle('sidebar')}
                />
                <span>Include sidebar with widgets</span>
              </label>
              <label className="feature-item">
                <input 
                  type="checkbox" 
                  checked={features.toc}
                  onChange={() => handleFeatureToggle('toc')}
                />
                <span>Table of contents (sticky navigation)</span>
              </label>
              <label className="feature-item">
                <input 
                  type="checkbox" 
                  checked={features.author}
                  onChange={() => handleFeatureToggle('author')}
                />
                <span>Author bio section with avatar</span>
              </label>
              <label className="feature-item">
                <input 
                  type="checkbox" 
                  checked={features.related}
                  onChange={() => handleFeatureToggle('related')}
                />
                <span>Related posts section</span>
              </label>
              <label className="feature-item">
                <input 
                  type="checkbox" 
                  checked={features.comments}
                  onChange={() => handleFeatureToggle('comments')}
                />
                <span>Comments section</span>
              </label>
              <label className="feature-item">
                <input 
                  type="checkbox" 
                  checked={features.social}
                  onChange={() => handleFeatureToggle('social')}
                />
                <span>Social sharing buttons</span>
              </label>
            </div>
          </div>

          <div className="action-buttons">
            <Link href="/ai-prompt" className="btn-back">
              <ArrowLeft size={18} />
              Back to Prompt
            </Link>
            <Link href="/ai-templates" className="btn-next">
              Next: Choose Template
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}