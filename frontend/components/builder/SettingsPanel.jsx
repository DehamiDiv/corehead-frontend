'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

const fontOptions = [
  { id: 'inter',    label: 'Inter',    style: 'Inter, sans-serif',         preview: 'Modern & Clean' },
  { id: 'georgia',  label: 'Georgia',  style: 'Georgia, serif',            preview: 'Classic Editorial' },
  { id: 'mono',     label: 'Mono',     style: 'monospace',                 preview: 'Code Style' },
  { id: 'playfair', label: 'Playfair', style: "'Playfair Display', serif", preview: 'Elegant & Bold' },
];

const colorThemes = [
  { id: 'premium-indigo', label: 'Indigo Royale', primary: '#4f46e5', bg: '#ffffff', text: '#1e1e2e', gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' },
  { id: 'midnight',       label: 'Midnight',      primary: '#38bdf8', bg: '#0f172a', text: '#f1f5f9', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { id: 'sunset',         label: 'Sunset Ember',  primary: '#f43f5e', bg: '#fffafb', text: '#4c0519', gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)' },
  { id: 'oceanic',        label: 'Oceanic',       primary: '#06b6d4', bg: '#f0f9ff', text: '#083344', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
  { id: 'emerald',        label: 'Emerald Aura',  primary: '#10b981', bg: '#f0fdf4', text: '#064e3b', gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
  { id: 'slate',          label: 'Slate Minimal', primary: '#64748b', bg: '#f8fafc', text: '#0f172a', gradient: 'linear-gradient(135deg, #64748b 0%, #334155 100%)' },
];


const spacingOptions = [
  { id: 'compact',  label: 'Compact',  value: '8px' },
  { id: 'normal',   label: 'Normal',   value: '16px' },
  { id: 'spacious', label: 'Spacious', value: '32px' },
];

const radiusOptions = [
  { id: 'none',   label: 'Sharp',    value: '0px' },
  { id: 'small',  label: 'Small',    value: '4px' },
  { id: 'medium', label: 'Medium',   value: '12px' },
  { id: 'large',  label: 'Large',    value: '24px' },
  { id: 'full',   label: 'Rounded',  value: '999px' },
];

export default function SettingsPanel({ settings, onSettingsChange }) {
  const [applied, setApplied] = useState(false);
  const activePrimary = settings.colors?.primary || '#667eea';
  const activeGradient = settings.colors?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '100%', background: '#fff' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', fontWeight: '800', marginBottom: '6px',
          backgroundImage: activeGradient,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ⚙️ Builder Settings
        </h2>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '0' }}>
          Personalize your layout, typography, and colors
        </p>
      </div>

      {/* Font Family */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🔤 Typography
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {fontOptions.map(font => (
            <div
              key={font.id}
              onClick={() => onSettingsChange({ ...settings, font: font.id, fontStyle: font.style })}
              style={{
                padding: '12px',
                border: '2px solid',
                borderColor: settings.font === font.id ? activePrimary : '#f0f0f0',
                borderRadius: '12px', cursor: 'pointer',
                background: settings.font === font.id ? `${activePrimary}08` : '#fff',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: settings.font === font.id ? `0 4px 12px ${activePrimary}15` : 'none',
                transform: settings.font === font.id ? 'translateY(-1px)' : 'none'
              }}
            >
              <div style={{ fontFamily: font.style, fontSize: '14px', fontWeight: '700', color: settings.font === font.id ? activePrimary : '#1a1a1a' }}>
                {font.label}
              </div>
              <div style={{ fontFamily: font.style, fontSize: '11px', color: '#888', marginTop: '2px' }}>
                {font.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Themes */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🎨 Visual Theme
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {colorThemes.map(theme => (
            <div
              key={theme.id}
              onClick={() => onSettingsChange({ ...settings, theme: theme.id, colors: theme })}
              style={{
                padding: '12px 8px', textAlign: 'center',
                border: '2px solid',
                borderColor: settings.theme === theme.id ? theme.primary : '#f0f0f0',
                borderRadius: '12px', cursor: 'pointer',
                background: settings.theme === theme.id ? `${theme.primary}08` : theme.bg,
                transition: 'all 0.2s',
                transform: settings.theme === theme.id ? 'scale(1.02)' : 'none'
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: theme.gradient || theme.primary, margin: '0 auto 8px',
                boxShadow: `0 4px 8px ${theme.primary}33`
              }} />
              <div style={{ fontSize: '11px', color: theme.text, fontWeight: '700' }}>
                {theme.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing & Radius in a row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '28px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📐 Spacing
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {spacingOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSettingsChange({ ...settings, spacing: opt.id, spacingValue: opt.value })}
                style={{
                  flex: 1, padding: '10px',
                  border: '2px solid',
                  borderColor: settings.spacing === opt.id ? activePrimary : '#f0f0f0',
                  borderRadius: '10px', cursor: 'pointer', fontSize: '12px',
                  background: settings.spacing === opt.id ? `${activePrimary}08` : '#fff',
                  fontWeight: settings.spacing === opt.id ? '700' : '500',
                  color: settings.spacing === opt.id ? activePrimary : '#666',
                  transition: 'all 0.2s'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🔲 Corner Radius
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {radiusOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSettingsChange({ ...settings, radius: opt.id, radiusValue: opt.value })}
                style={{
                  padding: '8px 14px',
                  border: '2px solid',
                  borderColor: settings.radius === opt.id ? activePrimary : '#f0f0f0',
                  borderRadius: opt.value === '999px' ? '20px' : (parseInt(opt.value) > 10 ? '12px' : '8px'),
                  cursor: 'pointer', fontSize: '12px',
                  background: settings.radius === opt.id ? `${activePrimary}08` : '#fff',
                  fontWeight: settings.radius === opt.id ? '700' : '500',
                  color: settings.radius === opt.id ? activePrimary : '#666',
                  transition: 'all 0.2s'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Columns */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ⚏ Grid Columns
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map(col => (
            <button
              key={col}
              onClick={() => onSettingsChange({ ...settings, columns: col })}
              style={{
                flex: 1, padding: '10px',
                border: '2px solid',
                borderColor: settings.columns === col ? activePrimary : '#f0f0f0',
                borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
                background: settings.columns === col ? `${activePrimary}08` : '#fff',
                fontWeight: settings.columns === col ? '800' : '500',
                color: settings.columns === col ? activePrimary : '#666',
                transition: 'all 0.2s'
              }}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Box - Glassmorphism */}
      <div style={{
        padding: '20px', borderRadius: settings.radiusValue || '12px',
        background: settings.colors?.bg || '#fff',
        border: '2px solid',
        borderColor: activePrimary,
        marginBottom: '28px',
        boxShadow: `0 10px 30px ${activePrimary}15`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '4px 10px',
          background: activeGradient, color: '#fff', fontSize: '10px',
          fontWeight: '800', borderBottomLeftRadius: '10px', textTransform: 'uppercase'
        }}>
          Live Preview
        </div>
        <p style={{
          fontFamily: settings.fontStyle || 'Inter, sans-serif',
          color: settings.colors?.text || '#1a1a1a',
          fontSize: '15px', fontWeight: '800', margin: '0 0 6px'
        }}>
          {settings.font?.toUpperCase() || 'INTER'} TYPOGRAPHY
        </p>
        <p style={{
          fontFamily: settings.fontStyle || 'Inter, sans-serif',
          color: activePrimary,
          fontSize: '13px', fontWeight: '500', margin: 0, opacity: 0.8
        }}>
          Theme: {settings.colors?.label || 'Default'} · Radius: {settings.radius || 'medium'}
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleApply}
        style={{
          width: '100%', padding: '14px',
          background: applied ? '#10b981' : activeGradient, 
          color: '#fff',
          border: 'none', borderRadius: '12px',
          fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          boxShadow: `0 8px 20px ${applied ? '#10b98133' : activePrimary + '40'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'all 0.3s',
          transform: applied ? 'scale(0.98)' : 'translateY(0)'
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '5px', borderRadius: '8px', display: 'flex' }}>
          {applied ? '✓' : <Save size={18} />}
        </div>
        {applied ? 'Settings Applied & Saved Locally' : 'Apply Settings to Session'}
      </button>

    </div>
  );
}