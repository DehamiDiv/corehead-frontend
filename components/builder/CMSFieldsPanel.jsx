'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Save } from 'lucide-react';

export default function CMSFieldsPanel({ cmsFields, selectedCard, contentMode, onUpdateCard }) {
  const [expandedSections, setExpandedSections] = useState({ post: true, author: false, seo: false });
  const [editValues, setEditValues] = useState({});
  const [saved, setSaved] = useState(false);

  // When selected card changes, load its values into edit fields
  useEffect(() => {
    if (selectedCard) {
      setEditValues({
        title:       selectedCard.title       || '',
        excerpt:     selectedCard.excerpt     || '',
        author:      selectedCard.author      || '',
        date:        selectedCard.date        || '',
        category:    selectedCard.category    || '',
        image:       selectedCard.image       || '',
        // SEO fields
        metaTitle:   selectedCard.metaTitle   || selectedCard.title || '',
        metaDesc:    selectedCard.metaDesc    || selectedCard.excerpt || '',
        keywords:    selectedCard.keywords    || '',
        ogImage:     selectedCard.ogImage     || selectedCard.image || '',
        // Author fields
        authorBio:   selectedCard.authorBio   || '',
        authorAvatar:selectedCard.authorAvatar|| '',
        socialLinks: selectedCard.socialLinks || '',
      });
      setSaved(false);
    }
  }, [selectedCard]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    if (!selectedCard || !onUpdateCard) return;
    onUpdateCard(selectedCard.id, editValues);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      id: 'post',
      icon: '📄',
      label: 'Post Fields',
      fields: [
        { key: 'title',    label: 'Title',          type: 'text' },
        { key: 'excerpt',  label: 'Excerpt',        type: 'textarea' },
        { key: 'category', label: 'Category',       type: 'text' },
        { key: 'date',     label: 'Date',           type: 'date' },
        { key: 'image',    label: 'Featured Image URL', type: 'text' },
      ]
    },
    {
      id: 'author',
      icon: '👤',
      label: 'Author Fields',
      fields: [
        { key: 'author',      label: 'Author Name',   type: 'text' },
        { key: 'authorBio',   label: 'Author Bio',    type: 'textarea' },
        { key: 'authorAvatar',label: 'Avatar URL',    type: 'text' },
        { key: 'socialLinks', label: 'Social Links',  type: 'text' },
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

  return (
    <aside style={{
      width: '260px', minWidth: '260px',
      borderLeft: '1px solid #e5e5e5',
      background: '#fafafa', overflowY: 'auto',
      display: 'flex', flexDirection: 'column'
    }}>

      {/* Panel Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #e5e5e5',
        background: '#fff'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
          🗄️ CMS Fields
        </h3>
        <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 0' }}>
          {selectedCard ? `Editing: ${selectedCard.title?.slice(0, 20)}...` : 'Select a card to edit'}
        </p>
      </div>

      {selectedCard ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Mode Badge */}
          <div style={{ padding: '8px 16px', background: contentMode === 'dynamic' ? '#eff6ff' : '#f0fdf4' }}>
            <span style={{
              fontSize: '11px', fontWeight: '600',
              color: contentMode === 'dynamic' ? '#3b82f6' : '#16a34a'
            }}>
              {contentMode === 'dynamic' ? '⚡ Dynamic Mode' : '📌 Static Mode'}
            </span>
          </div>

          {/* Sections */}
          {sections.map(section => {
            const isExpanded = expandedSections[section.id];
            return (
              <div key={section.id} style={{ borderBottom: '1px solid #e5e5e5' }}>

                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%', padding: '10px 16px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff', border: 'none',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                  }}
                >
                  <span>{section.icon} {section.label}</span>
                  {isExpanded
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />
                  }
                </button>

                {/* Section Fields */}
                {isExpanded && (
                  <div style={{ padding: '8px 16px 12px', background: '#fafafa' }}>
                    {section.fields.map(field => (
                      <div key={field.key} style={{ marginBottom: '10px' }}>
                        <label style={{
                          display: 'block', fontSize: '11px',
                          fontWeight: '600', color: '#555', marginBottom: '4px'
                        }}>
                          {field.label}
                        </label>

                        {contentMode === 'dynamic' ? (
                          // Dynamic mode — show binding tag
                          <div style={{
                            padding: '6px 10px', background: '#eff6ff',
                            border: '1px solid #bfdbfe', borderRadius: '6px',
                            fontSize: '12px', color: '#3b82f6', fontFamily: 'monospace'
                          }}>
                            {'{{' + field.key + '}}'}
                          </div>
                        ) : field.type === 'textarea' ? (
                          // Static textarea
                          <textarea
  value={editValues[field.key] || ''}
  onChange={e => handleChange(field.key, e.target.value)}
  rows={3}
  style={{
    width: '100%', padding: '6px 8px',
    border: '1px solid #e5e5e5', borderRadius: '6px',
    fontSize: '12px', resize: 'vertical',
    fontFamily: 'inherit', boxSizing: 'border-box',
    color: '#1a1a1a',        // ✅ ADD THIS
    background: '#ffffff',   // ✅ ADD THIS
    outline: 'none'
  }}
  onFocus={e => e.target.style.borderColor = '#4f46e5'}
  onBlur={e => e.target.style.borderColor = '#e5e5e5'}
/>
                        ) : (
                          // Static text/date input
                          <input
  type={field.type}
  value={editValues[field.key] || ''}
  onChange={e => handleChange(field.key, e.target.value)}
  style={{
    width: '100%', padding: '6px 8px',
    border: '1px solid #e5e5e5', borderRadius: '6px',
    fontSize: '12px', boxSizing: 'border-box',
    color: '#1a1a1a',        // ✅ ADD THIS
    background: '#ffffff',   // ✅ ADD THIS
    outline: 'none'
  }}
  onFocus={e => e.target.style.borderColor = '#4f46e5'}
  onBlur={e => e.target.style.borderColor = '#e5e5e5'}
/>
                        )}

                        {/* Image preview */}
                        {field.key === 'image' && editValues.image && (
                          <img
                            src={editValues.image}
                            alt="preview"
                            style={{
                              width: '100%', height: '80px',
                              objectFit: 'cover', borderRadius: '6px',
                              marginTop: '6px'
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

          {/* Save Button */}
          {contentMode === 'static' && (
            <div style={{ padding: '12px 16px' }}>
              <button
                onClick={handleSave}
                style={{
                  width: '100%', padding: '10px',
                  background: saved ? '#16a34a' : '#4f46e5',
                  color: '#fff', border: 'none',
                  borderRadius: '8px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  transition: 'background 0.2s'
                }}
              >
                <Save size={14} />
                {saved ? '✅ Saved!' : 'Apply Changes'}
              </button>
            </div>
          )}

        </div>
      ) : (
        // Empty state
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#444', margin: '0 0 6px' }}>
            No card selected
          </p>
          <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
            Click on any blog card in the canvas to edit its fields
          </p>
        </div>
      )}

    </aside>
  );
}