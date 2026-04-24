'use client';

import { useState, useEffect } from 'react';
import { FileText, User, Search, ChevronDown, ChevronRight } from 'lucide-react';
import './CMSFieldsPanel.css';

export default function CMSFieldsPanel({ cmsFields, selectedCard, contentMode, onUpdateCard }) {
  const [expandedSections, setExpandedSections] = useState({
    post: true,
    author: false,
    seo: false
  });

  const [editValues, setEditValues] = useState({
    title: '',
    excerpt: '',
    author: '',
    date: '',
    category: '',
    image: '',
  });

  // When a card is selected, fill in its values
  useEffect(() => {
    if (selectedCard) {
      setEditValues({
        title:    selectedCard.title    || '',
        excerpt:  selectedCard.excerpt  || '',
        author:   selectedCard.author   || '',
        date:     selectedCard.date     || '',
        category: selectedCard.category || '',
        image:    selectedCard.image    || '',
      });
    }
  }, [selectedCard]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApply = () => {
    if (selectedCard && onUpdateCard) {
      onUpdateCard(selectedCard.id, editValues);
    }
  };

  const sections = [
    { id: 'post',   label: 'Post Fields',   icon: FileText },
    { id: 'author', label: 'Author Fields', icon: User },
    { id: 'seo',    label: 'SEO Fields',    icon: Search }
  ];

  // Map section fields to editValues keys
  const fieldKeyMap = {
    'Title':         'title',
    'Excerpt':       'excerpt',
    'Content':       'excerpt',
    'Featured Image':'image',
    'Category':      'category',
    'Tags':          'category',
    'Name':          'author',
    'Bio':           'author',
    'Avatar':        'image',
    'Social Links':  'excerpt',
    'Meta Title':    'title',
    'Meta Description': 'excerpt',
    'Keywords':      'category',
    'OG Image':      'image',
  };

  return (
    <aside className="cms-panel">
      <div className="panel-header">
        <h3>CMS Fields</h3>
        {contentMode === 'dynamic' && (
          <span className="dynamic-badge">Dynamic Mode</span>
        )}
      </div>

      {selectedCard ? (
        <div className="panel-content">

          {/* Selected card info */}
          <div className="selected-info">
            <div className="info-icon">✓</div>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>
              {selectedCard.title?.slice(0, 30) || 'Card selected'}...
            </span>
          </div>

          {/* Field sections */}
          <div className="field-sections">
            {sections.map(section => {
              const Icon = section.icon;
              const isExpanded = expandedSections[section.id];

              return (
                <div key={section.id} className="field-section">
                  <button
                    className="section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="section-title">
                      <Icon size={16} />
                      <span>{section.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="section-content">
                      {cmsFields[section.id].map((field, index) => {
                        const key = fieldKeyMap[field];
                        return (
                          <div key={index} className="field-item">
                            <label>{field}</label>
                            <div className="field-binding">
                              {contentMode === 'dynamic' ? (
                                <span className="binding-tag">
                                  {'{{' + field.toLowerCase().replace(' ', '_') + '}}'}
                                </span>
                              ) : (
                                <input
                                  type="text"
                                  value={key ? editValues[key] : ''}
                                  onChange={e => key && setEditValues(prev => ({
                                    ...prev, [key]: e.target.value
                                  }))}
                                  placeholder={`Enter ${field.toLowerCase()}`}
                                  className="field-input"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Apply Changes Button */}
          {contentMode === 'static' && (
            <button
              onClick={handleApply}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              ✅ Apply Changes
            </button>
          )}

        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Select a card to edit its CMS fields</p>
          <span className="empty-hint">Click on any blog card in the canvas</span>
        </div>
      )}
    </aside>
  );
}