'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2, ArrowRight } from 'lucide-react';
import { aiApi } from '@/services/aiApi';

export default function AIChatPanel({ blogPosts, onUpdateLayout, onSwitchToBuilder }) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleModify = async (e) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await aiApi.modifyLayout({
        currentBlocks: blogPosts,
        instruction: instruction.trim()
      });

      if (result.success && result.blocks) {
        onUpdateLayout(result.blocks);
        setSuccessMsg('Refinement applied! Switching to Builder view...');
        setInstruction('');
        // Auto-switch to builder tab so user sees the updated layout
        if (onSwitchToBuilder) {
          setTimeout(() => onSwitchToBuilder(), 600);
        }
      } else {
        throw new Error('Failed to modify layout');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while modifying layout.');
    } finally {
      setLoading(false);
    }
  };

  const suggestionPills = [
    "Add a newsletter block at the end",
    "Remove the last block",
    "Add an announcement banner at the top",
    "Add a quote block section",
  ];

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        padding: '16px',
        borderRadius: '16px',
        color: '#fff',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(79,70,229,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} className="animate-pulse" />
          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>AI Layout Assistant</h3>
        </div>
        <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
          Instruct the AI to customize, add, delete, or rearrange elements of your layout.
        </p>
      </div>

      <form onSubmit={handleModify} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
            💬 Prompt AI to refine your layout
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., Add an announcement banner at the top, or delete the newsletter block"
            rows={4}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: loading ? '#f8fafc' : '#fff',
              color: '#334155',
            }}
            onFocus={e => e.target.style.borderColor = '#4f46e5'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12px', color: '#dc2626' }}>
            ❌ {error}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '12px', color: '#059669' }}>
            ✅ {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !instruction.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#cbd5e1' : '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading || !instruction.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing refinement...
            </>
          ) : (
            <>
              <Send size={16} />
              Refine Layout
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          💡 Try these suggestions
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {suggestionPills.map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => setInstruction(s)}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#4f46e5';
                e.currentTarget.style.background = '#f5f3ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = '#f8fafc';
              }}
            >
              <span>{s}</span>
              <ArrowRight size={12} style={{ opacity: 0.6 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
