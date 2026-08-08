'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Eye, Code, FileText } from 'lucide-react';
import Sidebar from '@/components/builder/Sidebar';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import CMSFieldsPanel from '@/components/builder/CMSFieldsPanel';
import PreviewModal from '@/components/builder/PreviewModal';
import ExportModal from '@/components/builder/ExportModal';
import ComponentsPanel from '@/components/builder/ComponentsPanel';
import SettingsPanel from '@/components/builder/SettingsPanel';
import AIGenerateModal from '@/components/builder/AIGenerateModal';
import SaveLayoutModal from '@/components/builder/SaveLayoutModal';
import LoadLayoutModal from '@/components/builder/LoadLayoutModal';
import './page.css';
import { builderApi } from '@/services/builderApi';
import PaywallModal from '@/components/admin/PaywallModal';

const defaultSettings = {
  font: 'inter',
  fontStyle: 'Inter, sans-serif',
  theme: 'premium-indigo',
  colors: {
    id: 'premium-indigo',
    label: 'Indigo Royale',
    primary: '#4f46e5',
    bg: '#ffffff',
    text: '#1e1e2e',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
  },

  spacing: 'normal',
  spacingValue: '16px',
  radius: 'medium',
  radiusValue: '12px',
  columns: 3,
};


export default function BlogBuilderPage() {
  const [activeTab, setActiveTab] = useState('builder');
  const [contentMode, setContentMode] = useState('static');
  const [selectedCard, setSelectedCard] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [loadingLayouts, setLoadingLayouts] = useState(false);
  const [aiPosts, setAiPosts] = useState([]);    // AI cards stored separately
  const [compareMode, setCompareMode] = useState(false); // show both side by side
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallCooldown, setPaywallCooldown] = useState(0);

  const [blogPosts, setBlogPosts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [cmsFields] = useState({
    post: ['Title', 'Excerpt', 'Content', 'Featured Image', 'Category', 'Tags'],
    author: ['Name', 'Bio', 'Avatar', 'Social Links'],
    seo: ['Meta Title', 'Meta Description', 'Keywords', 'OG Image']
  });

  // Handle AI flows from separate pages
  useEffect(() => {
    const triggerAIFlow = async () => {
      const aiPrompt = localStorage.getItem('ai_prompt');
      const selectedTemplate = localStorage.getItem('selected_template');
      const aiOptions = localStorage.getItem('ai_options');

      if (aiPrompt || selectedTemplate) {
        try {
          setIsGenerating(true);
          const options = aiOptions ? JSON.parse(aiOptions) : {};
          const template = selectedTemplate ? JSON.parse(selectedTemplate) : null;

          const result = await builderApi.generateAILayout({
            prompt: aiPrompt || `Template: ${template?.name}`,
            layoutType: options.layoutType || 'single-post',
            designStyle: options.designStyle || 'modern',
            features: options.features || {}
          });

          if (result.layout?.cards) {
            setBlogPosts(result.layout.cards);
          }
        } catch (err) {
          console.warn('AI Flow error:', err.message);
          if (err.message?.includes('LIMIT_EXCEEDED') || err.data?.error?.includes('LIMIT_EXCEEDED') || err.status === 402 || err.status === 429 || err.status === 403) {
            setPaywallCooldown(err.data?.cooldown_remaining || err.data?.cooldownRemaining || 0);
            setIsPaywallOpen(true);
          } else {
            alert('AI Generation failed: ' + err.message);
          }
        } finally {
          setIsGenerating(false);
          localStorage.removeItem('ai_prompt');
          localStorage.removeItem('selected_template');
          localStorage.removeItem('ai_options');
        }
      }

      // Existing direct generated layout pick-up
      const aiLayout = localStorage.getItem('ai_generated_layout');
      if (aiLayout) {
        try {
          const parsed = JSON.parse(aiLayout);
          if (parsed.cards) setBlogPosts(parsed.cards);
          localStorage.removeItem('ai_generated_layout');
        } catch (e) {
          console.error('Failed to load AI layout:', e);
        }
      }
    };

    triggerAIFlow();
  }, []);

  // Open save modal
  const handleSaveClick = () => setSaveModalOpen(true);

  // Save with custom name
  const handleSaveWithName = async (name) => {
    try {
      setIsSaving(true);
      await builderApi.saveLayout({
        name,
        layout_data: { cards: blogPosts, settings },
        content_mode: contentMode,
        grid_layout: 'grid'
      });
      setSaveModalOpen(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Open layout picker
  const handleOpenLayoutPicker = async () => {
    try {
      setLoadingLayouts(true);
      setShowLayoutPicker(true);
      const data = await builderApi.getLayouts();
      setSavedLayouts(data.layouts);
    } catch (err) {
      alert('Failed to fetch layouts: ' + err.message);
      setShowLayoutPicker(false);
    } finally {
      setLoadingLayouts(false);
    }
  };

  // Load layout by ID
  const handleLoadSelected = async (id) => {
    try {
      const data = await builderApi.getLayout(id);
      if (data.layout.layout_data?.cards) setBlogPosts(data.layout.layout_data.cards);
      if (data.layout.layout_data?.settings) setSettings(data.layout.layout_data.settings);
      setShowLayoutPicker(false);
    } catch (err) {
      alert('Failed to load layout: ' + err.message);
    }
  };

  // Delete saved layout
  const handleDeleteLayout = async (id) => {
    await builderApi.deleteLayout(id);
    setSavedLayouts(prev => prev.filter(l => l.id !== id));
  };

  // Add component from Components tab
  const handleAddComponent = (template) => {
    setBlogPosts(prev => [...prev, { ...template, id: Date.now() }]);
    setActiveTab('builder');
  };

  // Delete a card from canvas
  const handleDeleteCard = (cardId) => {
    setBlogPosts(prev => prev.filter(post => post.id !== cardId));
    if (selectedCard?.id === cardId) setSelectedCard(null);
  };

  // Update card from CMS Fields Panel
  const handleUpdateCard = (cardId, updatedValues) => {
    setBlogPosts(prev =>
      prev.map(post => post.id === cardId ? { ...post, ...updatedValues } : post)
    );
    setSelectedCard(prev =>
      prev?.id === cardId ? { ...prev, ...updatedValues } : prev
    );
  };

  // AI generated posts — store separately, enable compare mode
  const handleAIGenerated = (newCards) => {
    setAiPosts(newCards);
    setCompareMode(true);
  };

  return (
    <div className="blog-builder">
      {isGenerating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily: 'Inter, sans-serif'
        }}>
          <div className="animate-spin-custom" style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            marginBottom: '20px'
          }}></div>
          <style>{`
            .animate-spin-custom {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Generating Layout with AI
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Please wait while we prepare your custom workspace...
          </p>
        </div>
      )}

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
          <button className="btn-secondary" onClick={() => setPreviewOpen(true)}>
            <Eye size={18} /> Preview
          </button>
          <button className="btn-secondary" onClick={() => setExportOpen(true)}>
            <Code size={18} /> Export
          </button>

          <button
            className="btn-primary"
            disabled={blogPosts.length === 0}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
              opacity: blogPosts.length === 0 ? 0.5 : 1,
              cursor: blogPosts.length === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              const mainBuilderBlocks = blogPosts.map((post, idx) => ({
                id: `card-${post.id}-${idx}`,
                type: 'Container',
                content: 'Card Container',
                parentId: null,
                styles: {
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: '#e2e8f0',
                  margin: '16px 0px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                },
                bindings: {}
              }));

              const childBlocks = [];
              blogPosts.forEach((post, idx) => {
                const parentId = `card-${post.id}-${idx}`;

                childBlocks.push({
                  id: `img-${post.id}-${idx}`,
                  type: 'Image',
                  content: post.image || 'https://picsum.photos/400/250',
                  parentId: parentId,
                  styles: { borderRadius: '12px', margin: '0px 0px 16px 0px' },
                  bindings: contentMode === 'dynamic' ? { content: 'post.featured_image' } : {}
                });

                childBlocks.push({
                  id: `heading-${post.id}-${idx}`,
                  type: 'Heading',
                  content: post.title,
                  parentId: parentId,
                  styles: { fontSize: '20px', color: '#1e1e2e', margin: '0px 0px 8px 0px' },
                  bindings: contentMode === 'dynamic' ? { content: 'post.title' } : {}
                });

                childBlocks.push({
                  id: `excerpt-${post.id}-${idx}`,
                  type: 'Paragraph',
                  content: post.excerpt,
                  parentId: parentId,
                  styles: { fontSize: '14px', color: '#64748b', margin: '0px 0px 16px 0px' },
                  bindings: contentMode === 'dynamic' ? { content: 'post.excerpt' } : {}
                });

                childBlocks.push({
                  id: `author-${post.id}-${idx}`,
                  type: 'Paragraph',
                  content: `${post.author} • ${post.date}`,
                  parentId: parentId,
                  styles: { fontSize: '12px', color: '#94a3b8' },
                  bindings: contentMode === 'dynamic' ? { content: 'post.author' } : {}
                });
              });

              const finalLayout = [...mainBuilderBlocks, ...childBlocks];

              // Clear competing template keys to force loading from synced layout
              localStorage.removeItem("selected_template");
              localStorage.removeItem("ai_prompt");
              localStorage.removeItem("ai_options");

              localStorage.setItem("corehead_builder_layout", JSON.stringify(finalLayout));
              localStorage.setItem("corehead_builder_meta", JSON.stringify({
                name: "AI Playground Export",
                type: "Blog Archive",
                id: null
              }));

              window.location.href = '/admin/builder';
            }}
          >
            <Sparkles size={18} /> Sync to Main Builder
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="builder-content">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isCanvasEmpty={blogPosts.length === 0} />

        <main className="builder-main">

          {/* Toolbar */}
          <div className="builder-toolbar" style={blogPosts.length === 0 ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
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
              <select
                className="layout-select"
                value={settings.columns}
                onChange={e => setSettings(prev => ({ ...prev, columns: Number(e.target.value) }))}
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns (Grid)</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          </div>

          {/* Save / Load */}
          <div className="layout-actions">
            <button
              className="btn-secondary"
              onClick={handleSaveClick}
              disabled={blogPosts.length === 0}
              style={{
                opacity: blogPosts.length === 0 ? 0.5 : 1,
                cursor: blogPosts.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {saveStatus === 'saved' ? '✅ Saved!' : null}
              {saveStatus === 'error' ? '❌ Save Failed' : null}
              {saveStatus === null ? '💾 Save Layout' : null}
            </button>
            <button className="btn-secondary" onClick={handleOpenLayoutPicker}>
              📂 Load Layout
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'builder' && (
            <>
              {/* ── Compare Mode Banner ── */}
              {aiPosts.length > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
                  padding: '10px 16px',
                  background: compareMode ? 'rgba(79,70,229,0.06)' : '#fffbeb',
                  borderBottom: `2px solid ${compareMode ? 'rgba(79,70,229,0.2)' : '#fde68a'}`,
                  fontSize: '13px',
                }}>
                  <span style={{ fontWeight: '700', color: compareMode ? '#4f46e5' : '#92400e', marginRight: '4px' }}>
                    {compareMode ? '⚡ Compare Mode — Your Layout vs AI' : '🤖 AI layout is ready!'}
                  </span>
                  <button
                    onClick={() => setCompareMode(v => !v)}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none',
                      background: compareMode ? '#4f46e5' : '#f59e0b',
                      color: '#fff', fontWeight: '700', fontSize: '12px',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {compareMode ? 'Exit Compare' : 'Compare Side by Side'}
                  </button>
                  <button
                    onClick={() => { setBlogPosts(aiPosts); setAiPosts([]); setCompareMode(false); }}
                    style={{
                      padding: '6px 14px', borderRadius: '8px',
                      border: '2px solid #4f46e5', background: '#fff',
                      color: '#4f46e5', fontWeight: '700', fontSize: '12px',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    ✅ Use AI Layout
                  </button>
                  <button
                    onClick={() => { setAiPosts([]); setCompareMode(false); }}
                    style={{
                      padding: '6px 12px', borderRadius: '8px',
                      border: '2px solid #e0e0e0', background: '#fff',
                      color: '#888', fontWeight: '600', fontSize: '12px',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    ✖ Discard AI
                  </button>
                </div>
              )}

              {/* ── Split View (Compare) ── */}
              {compareMode && aiPosts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
                  <div style={{ borderRight: '3px solid #e2e8f0', overflowY: 'auto' }}>
                    <div style={{
                      padding: '8px 16px', background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '11px', fontWeight: '700', color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      📌 Your Layout
                    </div>
                    <BuilderCanvas
                      blogPosts={blogPosts}
                      contentMode={contentMode}
                      selectedCard={selectedCard}
                      setSelectedCard={setSelectedCard}
                      settings={settings}
                      onDeleteCard={handleDeleteCard}
                    />
                  </div>
                  <div style={{ overflowY: 'auto' }}>
                    <div style={{
                      padding: '8px 16px',
                      background: 'rgba(79,70,229,0.06)',
                      borderBottom: '1px solid rgba(79,70,229,0.15)',
                      fontSize: '11px', fontWeight: '700', color: '#4f46e5',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      ⚡ AI Generated Layout
                    </div>
                    <BuilderCanvas
                      blogPosts={aiPosts}
                      contentMode={contentMode}
                      selectedCard={null}
                      setSelectedCard={() => { }}
                      settings={settings}
                      onDeleteCard={() => { }}
                    />
                  </div>
                </div>
              ) : (
                <BuilderCanvas
                  blogPosts={blogPosts}
                  contentMode={contentMode}
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  settings={settings}
                  onDeleteCard={handleDeleteCard}
                />
              )}
            </>
          )}

          {activeTab === 'components' && (
            <ComponentsPanel onAddComponent={handleAddComponent} />
          )}

          {activeTab === 'cms' && (
            <div style={{ padding: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                🗄️ CMS Fields
              </h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
                Click a card below to select and edit it in the right panel.
              </p>
              {blogPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => { setSelectedCard(post); setActiveTab('builder'); }}
                  style={{
                    padding: '10px 14px', marginBottom: '8px',
                    border: `1px solid ${selectedCard?.id === post.id ? '#4f46e5' : '#e5e5e5'}`,
                    borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: selectedCard?.id === post.id ? '#eff6ff' : '#fff'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{post.title}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      {post.category} · {post.author}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#4f46e5' }}>Edit →</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
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
          onUpdateCard={handleUpdateCard}
        />
      </div>

      {/* Save Layout Modal */}
      <SaveLayoutModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveWithName}
        isSaving={isSaving}
      />

      {/* Load Layout Modal */}
      <LoadLayoutModal
        isOpen={showLayoutPicker}
        onClose={() => setShowLayoutPicker(false)}
        onLoad={handleLoadSelected}
        onDelete={handleDeleteLayout}
        layouts={savedLayouts}
        isLoading={loadingLayouts}
      />

      {/* Other Modals */}
      <AIGenerateModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onGenerated={handleAIGenerated}
      />
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

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => {
          setIsPaywallOpen(false);
          window.location.href = '/admin/builder';
        }}
        cooldownRemaining={paywallCooldown}
      />

    </div>
  );
}