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
      setEditValues({
        title:        selectedCard.title        || '',
        content:      typeof selectedCard.content === 'string' ? selectedCard.content : '',
        backgroundColor: selectedCard.styles?.backgroundColor || '', // Added for styling
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
      });
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
      if (editValues.title.length < 5) {
        setError('Title must be at least 5 characters long.');
        return;
      }
      if (!editValues.category || editValues.category.trim() === '') {
        setError('Category is required.');
        return;
      }
    } else {
      // For AI blocks, check content (except for Divider which has no content)
      if (selectedCard.type !== 'Divider') {
        if (!editValues.content || (typeof editValues.content === 'string' && editValues.content.trim() === '')) {
          setError('Content cannot be empty.');
          return;
        }
      }
    }

    const updateData = { ...editValues };
    if (isAIBlock) {
      // Nest styling inside styles object for AI blocks
      updateData.styles = {
        ...selectedCard.styles,
        backgroundColor: editValues.backgroundColor
      };
      delete updateData.backgroundColor;
    }

    onUpdateCard(selectedCard.id, updateData);
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

  // ── Shared input style ──
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

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      borderLeft: '1px solid #e2e8f0',
      background: '#ffffff',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Panel Header ── */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
      }}>
        <h3 style={{
          fontSize: '14px', fontWeight: '700', margin: '0 0 2px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          🗄️ CMS Fields
        </h3>
        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
          {selectedCard
            ? `Editing: ${selectedCard.title?.slice(0, 22)}...`
            : 'Select a card to edit'}
        </p>
      </div>

      {selectedCard ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Mode Badge */}
          <div style={{
            padding: '7px 16px',
            background: contentMode === 'dynamic'
              ? 'rgba(102,126,234,0.08)'
              : 'rgba(16,185,129,0.08)',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <span style={{
              fontSize: '11px', fontWeight: '600',
              color: contentMode === 'dynamic' ? '#667eea' : '#10b981',
            }}>
              {contentMode === 'dynamic' ? '⚡ Dynamic Mode' : '📌 Static Mode'}
            </span>
          </div>

          {/* AI Block Content Field (Dynamic) — Show only for core AI types */}
          {selectedCard.type && ['Heading', 'Paragraph', 'Image', 'Quote', 'Divider', 'Button', 'Collection List'].includes(selectedCard.type) && (
             <div style={{ borderBottom: '1px solid #e2e8f0', padding: '12px 16px', background: '#f8fafc' }}>
                <label style={{
                  display: 'block', fontSize: '11px',
                  fontWeight: '700', color: '#4f46e5',
                  marginBottom: '8px', textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ✨ {selectedCard.type} Content
                </label>
                <textarea
                  value={editValues.content || ''}
                  onChange={e => handleChange('content', e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    borderColor: '#cbd5e1',
                    resize: 'vertical',
                    lineHeight: '1.5',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />

                <label style={{
                  display: 'block', fontSize: '11px',
                  fontWeight: '700', color: '#4f46e5',
                  marginTop: '12px', marginBottom: '8px', textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  🎨 Background Color
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    value={editValues.backgroundColor || '#4f46e5'}
                    onChange={e => handleChange('backgroundColor', e.target.value)}
                    style={{
                      padding: 0, width: '30px', height: '30px', border: 'none', 
                      borderRadius: '4px', cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="#hex color"
                    value={editValues.backgroundColor || ''}
                    onChange={e => handleChange('backgroundColor', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
             </div>
          )}

          {/* Sections — Show only for standard cards, not AI blocks */}
          {!isAIBlock && sections.map(section => {
            const isExpanded = expandedSections[section.id];
            return (
              <div key={section.id} style={{ borderBottom: '1px solid #e0e0e0' }}>

                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%', padding: '10px 16px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isExpanded
                      ? 'linear-gradient(135deg, rgba(102,126,234,0.06) 0%, rgba(118,75,162,0.06) 100%)'
                      : '#fff',
                    border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600',
                    color: '#333', fontFamily: 'inherit',
                    transition: 'background 0.2s',
                  }}
                >
                  <span>{section.icon} {section.label}</span>
                  {isExpanded
                    ? <ChevronDown size={14} color="#667eea" />
                    : <ChevronRight size={14} color="#aaa" />
                  }
                </button>

                {/* Fields */}
                {isExpanded && (
                  <div style={{ padding: '10px 14px 14px', background: '#f9f9f9' }}>
                    {section.fields.map(field => (
                      <div key={field.key} style={{ marginBottom: '12px' }}>

                        <label style={{
                          display: 'block', fontSize: '11px',
                          fontWeight: '600', color: '#555',
                          marginBottom: '5px', textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {field.label}
                        </label>

                        {/* Dynamic mode — show binding tag */}
                        {contentMode === 'dynamic' ? (
                          <div style={{
                            padding: '7px 10px',
                            background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
                            border: '1px solid rgba(102,126,234,0.3)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#667eea',
                            fontFamily: 'monospace',
                            fontWeight: '600',
                          }}>
                            {'{{' + field.key + '}}'}
                          </div>

                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={editValues[field.key] || ''}
                            onChange={e => handleChange(field.key, e.target.value)}
                            rows={3}
                            style={{
                              ...inputStyle,
                              resize: 'vertical',
                              lineHeight: '1.5',
                            }}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                          />

                        ) : (
                          <input
                            type={field.type}
                            value={editValues[field.key] || ''}
                            onChange={e => handleChange(field.key, e.target.value)}
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                          />
                        )}

                        {/* Image preview */}
                        {field.key === 'image' && editValues.image && (
                          <img
                            src={editValues.image}
                            alt="preview"
                            style={{
                              width: '100%', height: '80px',
                              objectFit: 'cover', borderRadius: '8px',
                              marginTop: '6px',
                              border: '1px solid #e0e0e0'
                            }}
                            onError={e => e.target.style.display = 'none'}
                          />
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* ✅ Apply Changes Button */}
          {contentMode === 'static' && (
            <div style={{ padding: '14px 16px' }}>
              {error && (
                <div style={{ 
                  color: '#ef4444', fontSize: '12px', fontWeight: '600', 
                  marginBottom: '8px', textAlign: 'center', background: '#fef2f2', 
                  padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' 
                }}>
                  ⚠️ {error}
                </div>
              )}
              <button
                onClick={handleSave}
                style={{
                  width: '100%', padding: '11px',
                  background: saved
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff', border: 'none',
                  borderRadius: '10px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  transition: 'all 0.3s', fontFamily: 'inherit',
                  boxShadow: saved
                    ? '0 4px 12px rgba(16,185,129,0.3)'
                    : '0 4px 12px rgba(102,126,234,0.3)',
                }}
                onMouseEnter={e => {
                  if (!saved) e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Save size={14} />
                {saved ? '✅ Applied!' : 'Apply Changes'}
              </button>
            </div>
          )}

        </div>
      ) : (

        /* Empty State */
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '32px 20px', textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            border: '2px solid rgba(102,126,234,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', marginBottom: '14px',
          }}>
            📋
          </div>
          <p style={{
            fontSize: '13px', fontWeight: '700',
            color: '#333', margin: '0 0 6px',
          }}>
            No card selected
          </p>
          <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: 1.5 }}>
            Click any blog card on the canvas to edit its fields here
          </p>
        </div>
      )}

    </aside>
  );
}