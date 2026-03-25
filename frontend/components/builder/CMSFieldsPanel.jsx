'use client';

import { useState } from 'react';
import { FileText, User, Search, ChevronDown, ChevronRight } from 'lucide-react';
import './CMSFieldsPanel.css';

export default function CMSFieldsPanel({ cmsFields, selectedCard, contentMode }) {
  const [expandedSections, setExpandedSections] = useState({
    post: true,
    author: false,
    seo: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    { id: 'post', label: 'Post Fields', icon: FileText },
    { id: 'author', label: 'Author Fields', icon: User },
    { id: 'seo', label: 'SEO Fields', icon: Search }
  ];

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
          <div className="selected-info">
            <div className="info-icon">✓</div>
            <span>Card #{selectedCard} selected</span>
          </div>

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
                      {cmsFields[section.id].map((field, index) => (
                        <div key={index} className="field-item">
                          <label>{field}</label>
                          <div className="field-binding">
                            {contentMode === 'dynamic' ? (
                              <span className="binding-tag">{'{{' + field.toLowerCase().replace(' ', '_') + '}}'}</span>
                            ) : (
                              <input 
                                type="text" 
                                placeholder={`Enter ${field.toLowerCase()}`}
                                className="field-input"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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