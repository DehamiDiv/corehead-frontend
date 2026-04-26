'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Clock, Layers, Palette, RefreshCw,
  Trash2, Search, Filter, RotateCcw, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import './page.css';
import { aiApi } from '@/services/aiApi';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const STYLE_COLORS = {
  modern:     { bg: 'rgba(79,70,229,0.10)',  color: '#4f46e5', border: 'rgba(79,70,229,0.25)',  label: '✨ Modern' },
  editorial:  { bg: 'rgba(16,185,129,0.10)', color: '#10b981', border: 'rgba(16,185,129,0.25)', label: '📰 Editorial' },
  magazine:   { bg: 'rgba(245,158,11,0.10)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)', label: '🗞️ Magazine' },
  minimalist: { bg: 'rgba(107,114,128,0.10)',color: '#6b7280', border: 'rgba(107,114,128,0.25)',label: '⬜ Minimalist' },
};

const LAYOUT_ICONS = { 'blog-archive': '🗂️', 'single-post': '📄' };

export default function AIHistoryPage() {
  const router = useRouter();
  const [history, setHistory]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [loadingId, setLoadingId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch]         = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Protect the page - must be logged in to see history
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?callback=/ai-history');
    }
  }, [router]);

  /* ── Fetch history ── */
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiApi.getHistory(50);
      const layouts = data.layouts || [];
      setHistory(layouts);
      setFiltered(layouts);
    } catch (err) {
      setError(err.message);
      if (err.message?.includes('Access denied') || err.message?.includes('token')) {
        router.push('/login?callback=/ai-history');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  /* ── Filter / Search ── */
  useEffect(() => {
    let result = [...history];
    if (filterStyle !== 'all') {
      result = result.filter(h => h.design_style === filterStyle);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(h =>
        h.prompt?.toLowerCase().includes(q) ||
        h.design_style?.toLowerCase().includes(q) ||
        h.layout_type?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, filterStyle, history]);

  /* ── Restore layout into builder ── */
  const handleRestore = async (item) => {
    try {
      setLoadingId(item.id);
      
      // Use the actual generated layout if available, otherwise fallback
      let layoutData;
      if (item.generated_layout && (item.generated_layout.cards || item.generated_layout.layout_data?.cards)) {
        // Handle both possible structures
        layoutData = item.generated_layout;
        // Normalize if it's nested under layout_data
        if (item.generated_layout.layout_data) {
          layoutData = item.generated_layout.layout_data;
        }
      } else {
        // Fallback for older items or malformed data
        layoutData = {
          cards: [1, 2, 3].map((n) => ({
            id: Date.now() + n,
            title: n === 1 ? (item.prompt?.slice(0, 60) || 'AI Generated Post') : `Sample Post ${n}`,
            excerpt: `Generated with ${item.design_style || 'modern'} style — ${item.layout_type || 'single-post'} layout`,
            author: 'AI Author',
            date: new Date(item.created_at).toISOString().split('T')[0],
            image: `https://picsum.photos/400/250?random=${item.id + n}`,
            category: item.layout_type === 'blog-archive' ? 'Archive' : 'Post',
          }))
        };
      }
      
      localStorage.setItem('ai_generated_layout', JSON.stringify(layoutData));
      router.push('/builder');
    } catch (err) {
      alert('Failed to restore layout: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  /* ── Delete entry ── */
  const handleDelete = async (id) => {
    if (!confirm('Remove this generation from history?')) return;
    try {
      setDeletingId(id);
      
      // Get the auth header for direct fetch or update aiApi to have a delete method
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/ai/history/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete');

      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Stats ── */
  const stats = [
    { label: 'Total Generations', value: history.length,       icon: '🤖', color: '#4f46e5' },
    { label: 'Unique Styles',     value: [...new Set(history.map(h => h.design_style))].length, icon: '🎨', color: '#10b981' },
    { label: 'Layout Types',      value: [...new Set(history.map(h => h.layout_type))].length,  icon: '📄', color: '#f59e0b' },
  ];

  const allStyles = [...new Set(history.map(h => h.design_style).filter(Boolean))];

  return (
    <div className="ai-generator">

      {/* ── Header ── */}
      <div className="generator-header">
        <div className="header-content">
          <h1>AI Generation History</h1>
          <p>Browse, restore, and manage your past AI-generated layouts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-generate"
            onClick={fetchHistory}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <Link href="/ai-prompt" className="btn-generate" style={{ textDecoration: 'none' }}>
            <Sparkles size={18} /> New Generation
          </Link>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="generator-nav">
        <Link href="/ai-prompt"     className="nav-item">Prompt</Link>
        <Link href="/ai-options"    className="nav-item">Options</Link>
        <Link href="/ai-templates"  className="nav-item">Quick Templates</Link>
        <Link href="/ai-history"    className="nav-item active">History</Link>
      </div>

      {/* ── Content ── */}
      <div className="generator-content">

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', border: '4px solid #e0e0e0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '15px', color: '#888' }}>Loading your history…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ color: '#333', margin: '0 0 8px', fontSize: '20px' }}>Could not load history</h3>
            <p style={{ color: '#888', margin: '0 0 24px' }}>{error}</p>
            <button className="btn-generate" onClick={fetchHistory}>Try Again</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</div>
            <h3 style={{ color: '#333', margin: '0 0 8px', fontSize: '22px', fontWeight: '700' }}>No generations yet</h3>
            <p style={{ color: '#666', margin: '0 0 28px', fontSize: '15px' }}>Generate your first AI layout to see it here</p>
            <Link href="/ai-prompt" className="btn-generate" style={{ textDecoration: 'none' }}>
              <Sparkles size={18} /> Generate Layout
            </Link>
          </div>
        )}

        {/* History */}
        {!loading && !error && history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {stats.map((stat, i) => (
                <div key={i} style={{
                  padding: '18px 20px',
                  background: `${stat.color}0d`,
                  border: `2px solid ${stat.color}30`,
                  borderRadius: '14px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  type="text"
                  placeholder="Search by prompt, style, or type…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px',
                    border: '2px solid #e0e0e0', borderRadius: '10px',
                    fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', background: '#fff', color: '#333',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Style Filter */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Filter size={14} color="#888" />
                {['all', ...allStyles].map(s => {
                  const sc = STYLE_COLORS[s] || {};
                  const isActive = filterStyle === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilterStyle(s)}
                      style={{
                        padding: '6px 14px', borderRadius: '999px',
                        border: `2px solid ${isActive ? (sc.border || '#4f46e5') : '#e0e0e0'}`,
                        background: isActive ? (sc.bg || 'rgba(79,70,229,0.1)') : '#fff',
                        color: isActive ? (sc.color || '#4f46e5') : '#666',
                        fontSize: '12px', fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                    >
                      {s === 'all' ? '🌐 All' : (STYLE_COLORS[s]?.label || s)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result count */}
            {search || filterStyle !== 'all' ? (
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                Showing <strong>{filtered.length}</strong> of {history.length} generations
              </p>
            ) : null}

            {/* History Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '15px' }}>
                  🔍 No results match your search
                </div>
              ) : filtered.map((item) => {
                const sc = STYLE_COLORS[item.design_style] || STYLE_COLORS.modern;
                const isExpanded = expandedId === item.id;
                const enabledFeatures = item.features
                  ? Object.keys(item.features).filter(k => item.features[k])
                  : [];

                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#fff',
                      border: '2px solid #e8e8e8',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.25s, border-color 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px 24px' }}>

                      {/* Icon */}
                      <div style={{
                        width: '52px', height: '52px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '26px', borderRadius: '12px',
                        background: sc.bg, border: `1px solid ${sc.border}`,
                      }}>
                        {LAYOUT_ICONS[item.layout_type] || '🤖'}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Prompt Preview */}
                        <p
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          style={{
                            fontSize: '15px', fontWeight: '600', color: '#222',
                            margin: '0 0 10px', lineHeight: 1.5,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: isExpanded ? 'unset' : 2,
                            WebkitBoxOrient: 'vertical',
                            cursor: 'pointer',
                          }}
                          title="Click to expand"
                        >
                          "{item.prompt || 'No prompt recorded'}"
                        </p>

                        {/* Badges */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                            fontWeight: '700', background: 'rgba(79,70,229,0.08)',
                            color: '#4f46e5', border: '1px solid rgba(79,70,229,0.2)',
                          }}>
                            <Layers size={10} /> {item.layout_type || 'single-post'}
                          </span>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                            fontWeight: '700', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          }}>
                            <Palette size={10} /> {item.design_style || 'modern'}
                          </span>
                          {enabledFeatures.length > 0 && (
                            <span style={{
                              padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                              fontWeight: '700', background: 'rgba(16,185,129,0.08)',
                              color: '#10b981', border: '1px solid rgba(16,185,129,0.2)',
                            }}>
                              {enabledFeatures.join(', ')}
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#aaa' }}>
                          <Clock size={11} />
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                            year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleRestore(item)}
                          disabled={loadingId === item.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 18px',
                            background: loadingId === item.id
                              ? '#a5b4fc'
                              : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                            color: 'white', border: 'none', borderRadius: '10px',
                            fontSize: '13px', fontWeight: '700',
                            cursor: loadingId === item.id ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap', fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                          }}
                          onMouseEnter={e => { if (loadingId !== item.id) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          {loadingId === item.id
                            ? <><RefreshCw size={13} className="spin-icon" /> Restoring…</>
                            : <><RotateCcw size={13} /> Restore in Builder</>
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            padding: '8px 16px',
                            background: '#fff', color: '#ef4444',
                            border: '2px solid #fee2e2', borderRadius: '10px',
                            fontSize: '12px', fontWeight: '600',
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.borderColor = '#ef4444';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#fee2e2';
                          }}
                        >
                          <Trash2 size={12} />
                          {deletingId === item.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>

      <style>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}