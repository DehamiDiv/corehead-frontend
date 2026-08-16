'use client';

/**
 * BlockRenderer renders generic AI blocks (Heading, Paragraph, Image, etc.)
 * based on the schema provided by the backend aiService.
 */
export default function BlockRenderer({ block, isSelected, onClick, settings }) {
  const { type, content, styles = {} } = block;

  const activePrimary = settings?.colors?.primary || '#1d4ed8';
  const activeGradient = settings?.colors?.gradient || `linear-gradient(135deg, ${activePrimary} 0%, #1e3a8a 100%)`;
  const fontStyle = settings?.fontStyle || 'Inter, sans-serif';
  const borderRadius = settings?.radiusValue || '12px';

  // Base styles for the block container
  const containerStyle = {
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: isSelected ? `2px solid ${activePrimary}` : '2px solid transparent',
    borderRadius: borderRadius,
    padding: '10px',
    marginTop: '4px',
    marginBottom: '4px',
    backgroundColor: isSelected ? `${activePrimary}08` : 'transparent',
  };

  const renderContent = () => {
    switch (type) {

      case 'Heading': {
        const text = (typeof content === 'string' && content.trim()) || 'Heading Block';
        return (
          <div style={{
            backgroundImage: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
            borderLeft: `4px solid ${activePrimary}`,
            borderRadius: '8px',
            padding: '16px 20px',
            fontFamily: fontStyle,
            ...styles,
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: activePrimary, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
              HEADING
            </div>
            <h2 style={{ margin: 0, fontSize: styles.fontSize || '24px', fontWeight: '800', color: styles.color || '#1e1e2e', lineHeight: '1.3', fontFamily: fontStyle }}>
              {text}
            </h2>
          </div>
        );
      }

      case 'Paragraph': {
        const text = (typeof content === 'string' && content.trim()) || 'Paragraph text goes here. Click to edit this content.';
        return (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            fontFamily: fontStyle,
            ...styles,
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              PARAGRAPH
            </div>
            <p style={{ margin: 0, fontSize: styles.fontSize || '14px', color: styles.color || '#475569', lineHeight: '1.7', fontFamily: fontStyle }}>
              {text}
            </p>
          </div>
        );
      }

      case 'Image': {
        const imgSrc = typeof content === 'string' && content.trim() !== '' ? content : null;
        const seed = Math.abs((block.id || '').toString().split('').reduce((a, c) => a + c.charCodeAt(0), 42));
        const placeholderSrc = `https://picsum.photos/seed/ai-${seed}/800/400`;
        return (
          <div style={{ width: '100%', overflow: 'hidden', borderRadius: '10px', minHeight: '140px', background: '#f1f5f9', ...styles }}>
            <img
              src={imgSrc || placeholderSrc}
              alt="AI Generated"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholderSrc;
              }}
            />
          </div>
        );
      }

      case 'Quote': {
        const text = (typeof content === 'string' && content.trim()) || 'An inspiring quote goes here.';
        return (
          <div style={{
            background: `${activePrimary}08`,
            borderLeft: `4px solid ${activePrimary}`,
            borderRadius: '0 10px 10px 0',
            padding: '18px 24px',
            ...styles,
          }}>
            <div style={{ fontSize: '32px', color: activePrimary, lineHeight: 1, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>"</div>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '15px', color: '#374151', lineHeight: '1.7', fontFamily: fontStyle }}>
              {text}
            </p>
            <div style={{ fontSize: '32px', color: activePrimary, lineHeight: 1, marginTop: '4px', textAlign: 'right', fontFamily: 'Georgia, serif' }}>"</div>
          </div>
        );
      }

      case 'Divider':
        return (
          <div style={{ padding: '8px 0', ...styles }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundImage: `linear-gradient(to right, transparent, ${activePrimary}40, transparent)` }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activePrimary, opacity: 0.5 }} />
              <div style={{ flex: 1, height: '1px', backgroundImage: `linear-gradient(to left, transparent, ${activePrimary}40, transparent)` }} />
            </div>
          </div>
        );

      case 'Button': {
        const label = (typeof content === 'object' ? content?.text : content) || 'Click Here';
        return (
          <div style={{ padding: '8px 0', ...styles }}>
            <button style={{
              padding: '12px 28px',
              background: activeGradient,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: fontStyle,
              boxShadow: `0 4px 12px ${activePrimary}33`,
              letterSpacing: '0.3px',
            }}>
              {label}
            </button>
          </div>
        );
      }

      case 'Collection List':
        return (
          <div style={{
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
            ...styles,
          }}>
            🗂️ {(typeof content === 'object' ? content?.category : null) || 'All'} Posts
            (Limit: {(typeof content === 'object' ? content?.limit : null) || 6})
            <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>[Dynamic Collection Placeholder]</p>
          </div>
        );

      default:
        return (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '13px',
            color: '#64748b',
            fontFamily: fontStyle,
            ...styles,
          }}>
            {typeof content === 'string' ? content : JSON.stringify(content)}
          </div>
        );
    }
  };

  return (
    <div className="block-container" style={containerStyle} onClick={onClick}>
      {renderContent()}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '10px',
          background: activeGradient,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 10px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: `0 2px 8px ${activePrimary}44`,
        }}>
          {type}
        </div>
      )}
    </div>
  );
}
