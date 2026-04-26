'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

export default function AIPromptPage() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Protect the page - must be logged in to use AI features
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?callback=/ai-prompt');
    }
  }, [router]);

  const quickSuggestions = [
    { icon: '📄', label: 'Minimal blog post' },
    { icon: '📰', label: 'Magazine style' },
    { icon: '🎴', label: 'Card grid archive' },
    { icon: '📊', label: 'Sidebar layout' },
    { icon: '📝', label: 'Long-form article' },
    { icon: '🎨', label: 'Portfolio showcase' }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first.');
      return;
    }
    localStorage.setItem('ai_prompt', prompt.trim());
    router.push('/builder');
  };

  const handleNext = (e) => {
    if (!prompt.trim()) {
      e.preventDefault();
      setError('Please enter a prompt before continuing.');
      return;
    }
    localStorage.setItem('ai_prompt', prompt.trim());
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
        <Link href="/ai-prompt" className="nav-item active">
          Prompt
        </Link>
        <Link href="/ai-options" className="nav-item">
          Options
        </Link>
        <Link href="/ai-templates" className="nav-item">
          Quick templates
        </Link>
        <Link href="/ai-history" className="nav-item">History</Link>
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
              onChange={(e) => { setPrompt(e.target.value); setError(''); }}
              rows={6}
              style={{ borderColor: error ? '#ef4444' : '' }}
            />

            {/* Error message */}
            {error && (
              <div style={{
                marginTop: '8px', padding: '10px 14px',
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '8px', fontSize: '13px', color: '#dc2626'
              }}>
                ⚠️ {error}
              </div>
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
                    setError('');
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
            <Link href="/ai-options" className="btn-next" onClick={handleNext}>
              Next: Configure Options
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}