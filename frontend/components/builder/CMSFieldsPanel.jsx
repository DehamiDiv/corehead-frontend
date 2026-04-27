'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Save } from 'lucide-react';

export default function CMSFieldsPanel({ cmsFields, selectedCard, contentMode, onUpdateCard }) {
  const [expandedSections, setExpandedSections] = useState({
    post: true, author: false, seo: false
  });
  const [editValues, setEditValues] = useState({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const aiBlockTypes = ['Heading', 'Paragraph', 'Image', 'Quote', 'Divider', 'Button', 'Collection List'];
  const isAIBlock = selectedCard?.type && aiBlockTypes.includes(selectedCard.type);

  // ✅ Load card values into fields when card is selected
  useEffect(() => {
    if (selectedCard) {
      const baseValues = {
        title:        selectedCard.title        || '',
        backgroundColor: selectedCard.styles?.backgroundColor || '',
        excerpt:      selectedCard.excerpt      || '',
        author:       selectedCard.author       || '',
        date:         selectedCard.date         || '',
        category:     selectedCard.category     || '',
        image:        selectedCard.image        || '',
        metaTitle:    selectedCard.metaTitle    || selectedCard.title   || '',
        metaDesc:     selectedCard.metaDesc     || selectedCard.excerpt || '',
        keywords:     selectedCard.keywords     || '',
        ogImage:      selectedCard.ogImage      || selectedCard.image   || '',
        authorBio:    selectedCard.authorBio    || '',
        authorAvatar: selectedCard.authorAvatar || '',
        socialLinks:  selectedCard.socialLinks  || '',
      };

      // Handle specific AI content types
      if (selectedCard.type === 'Button') {
        baseValues.buttonText = selectedCard.content?.text || '';
        baseValues.buttonUrl = selectedCard.content?.url || '';
      } else if (selectedCard.type === 'Collection List') {
        baseValues.colCategory = selectedCard.content?.category || '';
        baseValues.colLimit = selectedCard.content?.limit || 6;
      } else {
        baseValues.content = typeof selectedCard.content === 'string' ? selectedCard.content : '';
      }

      setEditValues(baseValues);
      setSaved(false);
    }
  }, [selectedCard?.id]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setError('');
  };

  // ✅ Apply Changes — updates card in canvas
  const handleSave = () => {
    if (!selectedCard || !onUpdateCard) return;

    // Frontend Validation
    if (!isAIBlock) {
      if (!editValues.title || editValues.title.trim() === '') {
        setError('Title cannot be empty.');
        return;
      }
      if (!editValues.category || editValues.category.trim() === '') {
        setError('Category is required.');
        return;
      }
    }

    const updateData = { ...editValues };

    if (isAIBlock) {
      // Re-nest styling
      updateData.styles = {
        ...selectedCard.styles,
        backgroundColor: editValues.backgroundColor
      };
      delete updateData.backgroundColor;

      // Pack object-based content for specific blocks
      if (selectedCard.type === 'Button') {
        updateData.content = { 
          text: editValues.buttonText, 
          url: editValues.buttonUrl 
        };
        delete updateData.buttonText;
        delete updateData.buttonUrl;
      } else if (selectedCard.type === 'Collection List') {
        updateData.content = { 
          category: editValues.colCategory, 
          limit: Number(editValues.colLimit) || 6
        };
        delete updateData.colCategory;
        delete updateData.colLimit;
      }
    }

    if (typeof onUpdateCard === 'function') {
      onUpdateCard(selectedCard.id, updateData);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      id: 'post',
      icon: '📄',
      label: 'Post Fields',
      fields: [
        { key: 'title',    label: 'Title',               type: 'text' },
        { key: 'excerpt',  label: 'Excerpt',             type: 'textarea' },
        { key: 'category', label: 'Category',            type: 'text' },
        { key: 'date',     label: 'Date',                type: 'date' },
        { key: 'image',    label: 'Featured Image URL',  type: 'text' },
      ]
    },
    {
      id: 'author',
      icon: '👤',
      label: 'Author Fields',
      fields: [
        { key: 'author',       label: 'Author Name',  type: 'text' },
        { key: 'authorBio',    label: 'Author Bio',   type: 'textarea' },
        { key: 'authorAvatar', label: 'Avatar URL',   type: 'text' },
        { key: 'socialLinks',  label: 'Social Links', type: 'text' },
      ]
    },
    {
      id: 'seo',
      icon: '🔍',
      label: 'SEO Fields',
      fields: [
        { key: 'metaTitle', label: 'Meta Title',       type: 'text' },
        { key: 'metaDesc',  label: 'Meta Description', type: 'textarea' },
        { key: 'keywords',  label: 'Keywords',         type: 'text' },
        { key: 'ogImage',   label: 'OG Image URL',     type: 'text' },
      ]
    }
  ];

  const inputStyle = {
    width: '100%',
    padding: '7px 10px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px',
    fontWeight: '700', color: '#4f46e5',
    marginBottom: '6px', textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <aside style={{
      width: '260px', minWidth: '260px',
      borderLeft: '1px solid #e2e8f0', background: '#ffffff',
      overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Panel Header ── */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <h3 style={{
          fontSize: '14px', fontWeight: '700', margin: '0 0 2px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          🗄️ CMS Fields
        </h3>
        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
          {selectedCard ? `Editing: ${selectedCard.type}` : 'Select a card to edit'}
        </p>
      </div>

      {selectedCard ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Mode Badge */}
          <div style={{ padding: '7px 16px', background: contentMode === 'dynamic' ? 'rgba(102,126,234,0.08)' : 'rgba(16,185,129,0.08)', borderBottom: '1px solid #e0e0e0' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: contentMode === 'dynamic' ? '#667eea' : '#10b981' }}>
              {contentMode === 'dynamic' ? '⚡ Dynamic Mode' : '📌 Static Mode'}
            </span>
          </div>

          {/* AI Block Editor */}
          {isAIBlock && (
             <div style={{ borderBottom: '1px solid #e2e8f0', padding: '12px 16px', background: '#f8fafc' }}>
                
                {/* Button Specific Fields */}
                {selectedCard.type === 'Button' ? (
                  <>
                    <label style={labelStyle}>Button Text</label>
                    <input
                      type="text"
                      value={editValues.buttonText || ''}
                      onChange={e => handleChange('buttonText', e.target.value)}
                      style={{ ...inputStyle, marginBottom: '12px' }}
                    />
                    <label style={labelStyle}>Button URL</label>
                    <input
                      type="text"
                      value={editValues.buttonUrl || ''}
                      onChange={e => handleChange('buttonUrl', e.target.value)}
                      style={{ ...inputStyle, marginBottom: '12px' }}
                    />
                  </>
                ) : selectedCard.type === 'Collection List' ? (
                  <>
                    <label style={labelStyle}>Filter Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Technology"
                      value={editValues.colCategory || ''}
                      onChange={e => handleChange('colCategory', e.target.value)}
                      style={{ ...inputStyle, marginBottom: '12px' }}
                    />
                    <label style={labelStyle}>Post Limit</label>
                    <input
                      type="number"
                      value={editValues.colLimit || 6}
                      onChange={e => handleChange('colLimit', e.target.value)}
                      style={{ ...inputStyle, marginBottom: '12px' }}
                    />
                  </>
                ) : selectedCard.type !== 'Divider' ? (
                  <>
                    <label style={labelStyle}>✨ {selectedCard.type} Content</label>
                    <textarea
                      value={editValues.content || ''}
                      onChange={e => handleChange('content', e.target.value)}
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5', marginBottom: '12px' }}
                    />
                  </>
                ) : null}

                <label style={labelStyle}>🎨 Background Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    value={editValues.backgroundColor || '#4f46e5'}
                    onChange={e => handleChange('backgroundColor', e.target.value)}
                    style={{ padding: 0, width: '30px', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    placeholder="#hex"
                    value={editValues.backgroundColor || ''}
                    onChange={e => handleChange('backgroundColor', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
             </div>
          )}

          {/* Standard Blog Card Sections */}
          {!isAIBlock && sections.map(section => {
            const isExpanded = expandedSections[section.id];
            return (
              <div key={section.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isExpanded ? 'linear-gradient(135deg, rgba(102,126,234,0.06) 0%, rgba(118,75,162,0.06) 100%)' : '#fff',
                    border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#333', fontFamily: 'inherit'
                  }}
                >
                  <span>{section.icon} {section.label}</span>
                  {isExpanded ? <ChevronDown size={14} color="#667eea" /> : <ChevronRight size={14} color="#aaa" />}
                </button>

                {isExpanded && (
                  <div style={{ padding: '10px 14px 14px', background: '#f9f9f9' }}>
                    {section.fields.map(field => (
                      <div key={field.key} style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#555', marginBottom: '5px', textTransform: 'uppercase' }}>
                          {field.label}
                        </label>
                        {contentMode === 'dynamic' ? (
                          <div style={{ padding: '7px 10px', background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.3)', borderRadius: '8px', fontSize: '12px', color: '#667eea', fontFamily: 'monospace' }}>
                            {'{{' + field.key + '}}'}
                          </div>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={editValues[field.key] || ''}
                            onChange={e => handleChange(field.key, e.target.value)}
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={editValues[field.key] || ''}
                            onChange={e => handleChange(field.key, e.target.value)}
                            style={inputStyle}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Apply Changes Button */}
          {contentMode === 'static' && (
            <div style={{ padding: '14px 16px' }}>
              {error && <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textAlign: 'center', background: '#fef2f2', padding: '6px', borderRadius: '6px' }}>⚠️ {error}</div>}
              <button
                onClick={handleSave}
                style={{
                  width: '100%', padding: '11px', background: saved ? '#10b981' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.3s'
                }}
              >
                <Save size={14} />
                {saved ? '✅ Applied!' : 'Apply Changes'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>📋</div>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>No card selected</p>
          <p style={{ fontSize: '12px', color: '#888' }}>Click any block on the canvas to edit its fields here</p>
        </div>
      )}
    </aside>
  );
}