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

  // Handle AI flows from separate pages
  useEffect(() => {
    const triggerAIFlow = async () => {
      const aiPrompt = localStorage.getItem('ai_prompt');
      const selectedTemplate = localStorage.getItem('selected_template');
      const aiOptions = localStorage.getItem('ai_options');

      if (aiPrompt || selectedTemplate) {
        try {
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

          // Clear after use
          localStorage.removeItem('ai_prompt');
          localStorage.removeItem('selected_template');
          localStorage.removeItem('ai_options');

        } catch (err) {
          console.error('AI Flow error:', err);
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

  // AI generated posts
  const handleAIGenerated = (newCards) => {
    setBlogPosts(newCards);
  };

  return (
    <div className="blog-builder">

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
          <button className="btn-primary" onClick={() => setAiOpen(true)}>
            <Sparkles size={18} /> Generate with AI
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
            <button className="btn-secondary" onClick={handleSaveClick}>
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
            <BuilderCanvas
              blogPosts={blogPosts}
              contentMode={contentMode}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              settings={settings}
              onDeleteCard={handleDeleteCard}
            />
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

    </div>
  );
}