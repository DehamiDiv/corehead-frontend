'use client';

import { useState } from 'react';

const fontOptions = [
  { id: 'inter',    label: 'Inter',    style: 'Inter, sans-serif',         preview: 'Modern & Clean' },
  { id: 'georgia',  label: 'Georgia',  style: 'Georgia, serif',            preview: 'Classic Editorial' },
  { id: 'mono',     label: 'Mono',     style: 'monospace',                 preview: 'Code Style' },
  { id: 'playfair', label: 'Playfair', style: "'Playfair Display', serif", preview: 'Elegant & Bold' },
];

const colorThemes = [
  { id: 'default',  label: 'Default',  primary: '#4f46e5', bg: '#ffffff', text: '#1a1a1a' },
  { id: 'dark',     label: 'Dark',     primary: '#818cf8', bg: '#0f172a', text: '#f1f5f9' },
  { id: 'green',    label: 'Forest',   primary: '#16a34a', bg: '#f0fdf4', text: '#14532d' },
  { id: 'rose',     label: 'Rose',     primary: '#e11d48', bg: '#fff1f2', text: '#881337' },
  { id: 'amber',    label: 'Amber',    primary: '#d97706', bg: '#fffbeb', text: '#78350f' },
  { id: 'slate',    label: 'Slate',    primary: '#475569', bg: '#f8fafc', text: '#0f172a' },
];

const spacingOptions = [
  { id: 'compact',  label: 'Compact',  value: '8px' },
  { id: 'normal',   label: 'Normal',   value: '16px' },
  { id: 'spacious', label: 'Spacious', value: '32px' },
];

const radiusOptions = [
  { id: 'none',   label: 'Sharp',    value: '0px' },
  { id: 'small',  label: 'Small',    value: '4px' },
  { id: 'medium', label: 'Medium',   value: '8px' },
  { id: 'large',  label: 'Large',    value: '16px' },
  { id: 'full',   label: 'Rounded',  value: '999px' },
];

export default function SettingsPanel({ settings, onSettingsChange }) {
  return (
    <div style={{ padding: '16px', overflowY: 'auto', maxHeight: '100%' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
        ⚙️ Settings
      </h2>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
        Customize fonts, colors and spacing
      </p>

      {/* Font Picker */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#444' }}>
          🔤 Font Family
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {fontOptions.map(font => (
            <div
              key={font.id}
              onClick={() => onSettingsChange({ ...settings, font: font.id, fontStyle: font.style })}
              style={{
                padding: '10px 12px',
                border: `2px solid ${settings.font === font.id ? '#4f46e5' : '#e5e5e5'}`,
                borderRadius: '8px', cursor: 'pointer',
                background: settings.font === font.id ? '#f5f3ff' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontFamily: font.style, fontSize: '14px', fontWeight: '600' }}>
                {font.label}
              </div>
              <div style={{ fontFamily: font.style, fontSize: '11px', color: '#888' }}>
                {font.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Theme */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#444' }}>
          🎨 Color Theme
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {colorThemes.map(theme => (
            <div
              key={theme.id}
              onClick={() => onSettingsChange({ ...settings, theme: theme.id, colors: theme })}
              style={{
                padding: '10px 8px', textAlign: 'center',
                border: `2px solid ${settings.theme === theme.id ? theme.primary : '#e5e5e5'}`,
                borderRadius: '8px', cursor: 'pointer',
                background: theme.bg, transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: theme.primary, margin: '0 auto 6px'
              }} />
              <div style={{ fontSize: '11px', color: theme.text, fontWeight: '500' }}>
                {theme.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#444' }}>
          📐 Card Spacing
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {spacingOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => onSettingsChange({ ...settings, spacing: opt.id, spacingValue: opt.value })}
              style={{
                flex: 1, padding: '8px',
                border: `2px solid ${settings.spacing === opt.id ? '#4f46e5' : '#e5e5e5'}`,
                borderRadius: '8px', cursor: 'pointer', fontSize: '12px',
                background: settings.spacing === opt.id ? '#f5f3ff' : '#fff',
                fontWeight: settings.spacing === opt.id ? '600' : '400',
                color: settings.spacing === opt.id ? '#4f46e5' : '#444'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#444' }}>
          🔲 Card Corners
        </h3>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {radiusOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => onSettingsChange({ ...settings, radius: opt.id, radiusValue: opt.value })}
              style={{
                padding: '6px 12px',
                border: `2px solid ${settings.radius === opt.id ? '#4f46e5' : '#e5e5e5'}`,
                borderRadius: opt.value, cursor: 'pointer', fontSize: '12px',
                background: settings.radius === opt.id ? '#f5f3ff' : '#fff',
                fontWeight: settings.radius === opt.id ? '600' : '400',
                color: settings.radius === opt.id ? '#4f46e5' : '#444'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Columns */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#444' }}>
          ⚏ Grid Columns
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map(col => (
            <button
              key={col}
              onClick={() => onSettingsChange({ ...settings, columns: col })}
              style={{
                flex: 1, padding: '8px',
                border: `2px solid ${settings.columns === col ? '#4f46e5' : '#e5e5e5'}`,
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
                background: settings.columns === col ? '#f5f3ff' : '#fff',
                fontWeight: settings.columns === col ? '700' : '400',
                color: settings.columns === col ? '#4f46e5' : '#444'
              }}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Box */}
      <div style={{
        padding: '16px', borderRadius: settings.radiusValue || '8px',
        background: settings.colors?.bg || '#fff',
        border: `2px solid ${settings.colors?.primary || '#4f46e5'}`,
        marginBottom: '24px'
      }}>
        <p style={{
          fontFamily: settings.fontStyle || 'Inter, sans-serif',
          color: settings.colors?.text || '#1a1a1a',
          fontSize: '14px', fontWeight: '600', margin: '0 0 4px'
        }}>
          Preview: {settings.font || 'Inter'} font
        </p>
        <p style={{
          fontFamily: settings.fontStyle || 'Inter, sans-serif',
          color: settings.colors?.primary || '#4f46e5',
          fontSize: '12px', margin: 0
        }}>
          Theme: {settings.colors?.label || 'Default'} · Spacing: {settings.spacing || 'normal'}
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={() => {
            // Find the floating save button or trigger parent save
            const saveBtn = document.querySelector('.layout-actions button:first-child');
            if (saveBtn) saveBtn.click();
        }}
        style={{
          width: '100%', padding: '12px',
          background: '#4f46e5', color: '#fff',
          border: 'none', borderRadius: '10px',
          fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}
      >
        💾 Save All Settings
      </button>

    </div>
  );
}