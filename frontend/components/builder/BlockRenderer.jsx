'use client';

/**
 * BlockRenderer renders generic AI blocks (Heading, Paragraph, Image, etc.)
 * based on the schema provided by the backend aiService.
 */
export default function BlockRenderer({ block, isSelected, onClick, settings }) {
  const { type, content, styles = {} } = block;
  
  const activePrimary = settings?.colors?.primary || '#4f46e5';
  const fontStyle = settings?.fontStyle || 'inherit';
  const borderRadius = settings?.radiusValue || '12px';

  // Base styles for the block container
  const containerStyle = {
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: isSelected ? `2px solid ${activePrimary}` : '2px solid transparent',
    borderRadius: borderRadius,
    padding: '8px',
    marginTop: '4px',
    marginBottom: '4px',
    marginLeft: '0',
    marginRight: '0',
    backgroundColor: isSelected ? `${activePrimary}08` : 'transparent',
    ...styles
  };

  const renderContent = () => {
    switch (type) {
      case 'Heading':
        return <h2 style={{ margin: 0, fontFamily: fontStyle, ...styles }}>{content}</h2>;
      
      case 'Paragraph':
        return <p style={{ margin: 0, fontFamily: fontStyle, lineHeight: '1.6', ...styles }}>{content}</p>;
      
      case 'Image':
        return (
          <div style={{ width: '100%', overflow: 'hidden', borderRadius: '8px', ...styles }}>
            <img 
              src={content} 
              alt="AI Generated" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>
        );
      
      case 'Quote':
        return (
          <blockquote style={{ 
            margin: 0, 
            paddingLeft: '20px', 
            borderLeft: `4px solid ${activePrimary}`, 
            fontStyle: 'italic',
            color: '#64748b',
            ...styles 
          }}>
            {content}
          </blockquote>
        );
      
      case 'Divider':
        return <hr style={{ border: 'none', borderBottom: '1px solid #e2e8f0', ...styles }} />;
      
      case 'Button':
        return (
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: activePrimary, 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            ...styles 
          }}>
            {content.text || 'Click Here'}
          </button>
        );

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
            ...styles
          }}>
            🗂️ {content.category || 'All'} Posts (Limit: {content.limit || 6})
            <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>[Dynamic Collection Placeholder]</p>
          </div>
        );
      
      default:
        return <div style={styles}>{typeof content === 'string' ? content : JSON.stringify(content)}</div>;
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
          backgroundColor: activePrimary,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '4px',
          textTransform: 'uppercase'
        }}>
          {type}
        </div>
      )}
    </div>
  );
}
