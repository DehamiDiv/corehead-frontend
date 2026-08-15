'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

export default function AIPromptPage() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const router = useRouter();

  // Protect the page - must be logged in to use AI features
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?callback=/ai-prompt');
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLaunching(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLaunching) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.3)] flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
            <Sparkles className="w-12 h-12 text-indigo-600 relative z-10" />
          </div>

          <h1 className="text-white text-3xl font-black tracking-tighter mb-2 italic">
            CORE<span className="text-indigo-500">HEAD</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-indigo-500" />
            <p className="text-indigo-200/50 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing Neural Design</p>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>
        </div>

        <div className="absolute bottom-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full animate-progress-loading" style={{ width: '100%' }} />
        </div>

        <style jsx>{`
          @keyframes progress-loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-progress-loading {
            animation: progress-loading 1.5s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }

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
            <button className="btn-back" onClick={handleGenerate} title="Generate with current description">
              Skip to Builder
              <Sparkles size={18} />
            </button>
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