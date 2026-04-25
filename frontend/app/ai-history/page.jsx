'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Clock, Layers, Palette, RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import './page.css';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AIHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Fetch AI generation history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/ai/history?limit=50`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data.layouts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // Load a past layout into builder
  const handleReload = async (item) => {
    try {
      setLoadingId(item.id);

      // Save to localStorage so builder picks it up
      const layoutData = {
        cards: [
          {
            id: Date.now(),
            title: item.prompt?.slice(0, 60) || 'AI Generated Post',
            excerpt: `Generated with ${item.design_style} style — ${item.layout_type} layout`,
            author: 'AI Author',
            date: new Date(item.created_at).toISOString().split('T')[0],
            image: `https://picsum.photos/400/250?random=${item.id}`,
            category: item.layout_type || 'AI Generated'
          }
        ]
      };

      localStorage.setItem('ai_generated_layout', JSON.stringify(layoutData));
      router.push('/builder');

    } catch (err) {
      alert('Failed to reload layout: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // Style badge colors
  const getStyleColor = (style) => {
    const colors = {
      modern:     { bg: 'rgba(79,70,229,0.1)',  color: '#4f46e5', border: 'rgba(79,70,229,0.3)' },
      editorial:  { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', border: 'rgba(16,185,129,0.3)' },
      magazine:   { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
      minimalist: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', border: 'rgba(107,114,128,0.3)' },
    };
    return colors[style] || colors.modern;
  };

  const getLayoutIcon = (type) => {
    return type === 'blog-archive' ? '🗂️' : '📄';
  };

  return (
    <div className="ai-generator">

      {/* Header */}
      <div className="generator-header">
        <div className="header-content">
          <h1>AI Generation History</h1>
          <p>View and reload your previously generated layouts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-generate"
            onClick={fetchHistory}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <Link href="/ai-prompt" className="btn-generate" style={{ textDecoration: 'none' }}>
            <Sparkles size={18} />
            New Generation
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="generator-nav">
        <Link href="/ai-prompt" className="nav-item">Prompt</Link>
        <Link href="/ai-options" className="nav-item">Options</Link>
        <Link href="/ai-templates" className="nav-item">Quick Templates</Link>
        <Link href="/ai-history" className="nav-item active">History</Link>
      </div>

      {/* Content */}
      <div className="generator-content">

        {/* Loading */}
        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 20px', color: '#999', gap: '16px'
          }}>
            <div style={{
              width: '32px', height: '32px',
              border: '3px solid #e0e0e0',
              borderTopColor: '#4f46e5', borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ margin: 0, fontSize: '15px' }}>Loading history...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ color: '#333', margin: '0 0 8px', fontSize: '20px' }}>Failed to load history</h3>
            <p style={{ color: '#666', margin: '0 0 24px' }}>{error}</p>
            <button className="btn-generate" onClick={fetchHistory}>Try Again</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🤖</div>
            <h3 style={{ color: '#333', margin: '0 0 8px', fontSize: '22px', fontWeight: '700' }}>
              No generations yet
            </h3>
            <p style={{ color: '#666', margin: '0 0 28px', fontSize: '15px' }}>
              Generate your first AI layout to see it here
            </p>
            <Link href="/ai-prompt" className="btn-generate" style={{ textDecoration: 'none' }}>
              <Sparkles size={18} /> Generate Layout
            </Link>
          </div>
        )}

        {/* History List */}
        {!loading && !error && history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Stats Bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px', marginBottom: '8px'
            }}>
              {[
                { label: 'Total Generations', value: history.length, icon: '🤖', color: '#667eea' },
                { label: 'Layout Types', value: [...new Set(history.map(h => h.layout_type))].length, icon: '📄', color: '#10b981' },
                { label: 'Design Styles', value: [...new Set(history.map(h => h.design_style))].length, icon: '🎨', color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: '16px 20px',
                  background: '#eff6ff',
                  border: '2px solid #bfdbfe',
                  borderRadius: '12px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* History Items */}
            {history.map((item) => {
              const styleColors = getStyleColor(item.design_style);
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '24px',
                    background: '#f9f9f9',
                    border: '2px solid #e0e0e0',
                    borderRadius: '16px',
                    transition: 'all 0.3s',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f9f9f9';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '56px', height: '56px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', borderRadius: '12px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe'
                  }}>
                    {getLayoutIcon(item.layout_type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Prompt */}
                    <p style={{
                      fontSize: '15px', fontWeight: '600', color: '#333',
                      margin: '0 0 10px', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      "{item.prompt}"
                    </p>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {/* Layout type */}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px',
                        fontWeight: '600', background: '#eff6ff',
                        color: '#4f46e5', border: '1px solid #bfdbfe'
                      }}>
                        <Layers size={10} />
                        {item.layout_type || 'single-post'}
                      </span>

                      {/* Design style */}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px',
                        fontWeight: '600',
                        background: styleColors.bg,
                        color: styleColors.color,
                        border: `1px solid ${styleColors.border}`
                      }}>
                        <Palette size={10} />
                        {item.design_style || 'modern'}
                      </span>

                      {/* Features */}
                      {item.features && Object.keys(item.features).filter(k => item.features[k]).length > 0 && (
                        <span style={{
                          padding: '3px 10px', borderRadius: '999px', fontSize: '12px',
                          fontWeight: '600', background: 'rgba(16,185,129,0.1)',
                          color: '#10b981', border: '1px solid rgba(16,185,129,0.2)'
                        }}>
                          {Object.keys(item.features).filter(k => item.features[k]).length} features
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '12px', color: '#999'
                    }}>
                      <Clock size={11} />
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => handleReload(item)}
                      disabled={loadingId === item.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '10px 20px',
                        background: loadingId === item.id
                          ? '#a5b4fc'
                          : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: 'white', border: 'none', borderRadius: '10px',
                        fontSize: '13px', fontWeight: '600', cursor: loadingId === item.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s', whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => {
                        if (loadingId !== item.id) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.4)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {loadingId === item.id ? (
                        <>⏳ Loading...</>
                      ) : (
                        <><RefreshCw size={13} /> Reload in Builder</>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}