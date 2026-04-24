'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import './page.css';

export default function AIPromptPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);

  const quickSuggestions = [
    { icon: '📄', label: 'Minimal blog post' },
    { icon: '📰', label: 'Magazine style' },
    { icon: '🎴', label: 'Card grid archive' },
    { icon: '📊', label: 'Sidebar layout' },
    { icon: '📝', label: 'Long-form article' },
    { icon: '🎨', label: 'Portfolio showcase' }
  ];

  const handleNext = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt before continuing.');
      return;
    }
    setError(null);
    // Save prompt so ai-options page can read it
    localStorage.setItem('ai_prompt', prompt.trim());
    router.push('/ai-options');
  };

  return (
    <div className="ai-generator">

      {/* Header */}
      <div className="generator-header">
        <div className="header-content">
          <h1>AI Layout Generator</h1>
          <p>Describe your vision, we'll build the perfect layout</p>
        </div>
        <button className="btn-generate" onClick={handleNext}>
          <Sparkles size={20} />
          Generate Layout
        </button>
      </div>

      {/* Navigation */}
      <div className="generator-nav">
        <Link href="/ai-prompt" className="nav-item active">
          Prompt
        </Link>
        <Link href="/ai-options" className="nav-item">
          Options
        </Link>
        <Link href="/ai-templates" className="nav-item">
          Quick templates
        </Link>
        <Link href="/ai-history" className="nav-item">
         History
          </Link>
      </div>

      {/* Content */}
      <div className="generator-content">
        <div className="prompt-tab">

          <div className="prompt-section">
            <h2>✍️ Describe your layout</h2>
            <p className="section-description">
              Tell us what kind of blog layout you want to create. Be specific about elements, structure, and style.
            </p>

            <textarea
              className="prompt-textarea"
              placeholder="Create a modern single-post layout with a full-width hero image, a sticky table of contents on the left, and a related posts section at the bottom."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError(null);
              }}
              rows={6}
            />

            {/* Error message */}
            {error && (
              <p className="error-message">❌ {error}</p>
            )}
          </div>

          <div className="suggestions-section">
            <h3>💡 Quick suggestions</h3>
            <div className="suggestions-grid">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => {
                    setPrompt(`Create a ${suggestion.label} layout with full content display and modern design`);
                    setError(null);
                  }}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-info">
            <h3>🤖 How AI generates your layout</h3>
            <p>The AI will automatically:</p>
            <ul>
              <li>Structure components based on your description</li>
              <li>Bind CMS fields like {'{post.title}'} and {'{post.featured_image}'}</li>
              <li>Apply responsive design principles for mobile and desktop</li>
              <li>Optimize for SEO with proper heading hierarchy</li>
              <li>Add proper spacing, typography, and visual hierarchy</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button className="btn-next" onClick={handleNext}>
              Next: Configure Options
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}