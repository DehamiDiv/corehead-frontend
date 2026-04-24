'use client';

const componentBlocks = [
  {
    id: 'hero',
    icon: '🖼️',
    label: 'Hero Section',
    description: 'Full width hero with image',
    template: {
      id: Date.now(),
      title: 'Hero Title',
      excerpt: 'Add your hero description here.',
      author: 'Author Name',
      date: new Date().toISOString().split('T')[0],
      image: 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 100),
      category: 'Hero',
      type: 'hero'
    }
  },
  {
    id: 'card',
    icon: '🃏',
    label: 'Blog Card',
    description: 'Standard blog post card',
    template: {
      id: Date.now(),
      title: 'New Blog Post',
      excerpt: 'Write your blog post excerpt here.',
      author: 'Author Name',
      date: new Date().toISOString().split('T')[0],
      image: 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 100),
      category: 'General',
      type: 'card'
    }
  },
  {
    id: 'banner',
    icon: '📢',
    label: 'Banner',
    description: 'Announcement or promo banner',
    template: {
      id: Date.now(),
      title: 'Announcement Banner',
      excerpt: 'This is an important announcement for your readers.',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      image: 'https://picsum.photos/800/200?random=' + Math.floor(Math.random() * 100),
      category: 'Banner',
      type: 'banner'
    }
  },
  {
    id: 'featured',
    icon: '⭐',
    label: 'Featured Post',
    description: 'Highlighted featured article',
    template: {
      id: Date.now(),
      title: 'Featured Article',
      excerpt: 'This is a featured post that stands out from the rest.',
      author: 'Editor',
      date: new Date().toISOString().split('T')[0],
      image: 'https://picsum.photos/600/350?random=' + Math.floor(Math.random() * 100),
      category: 'Featured',
      type: 'featured'
    }
  },
  {
    id: 'quote',
    icon: '💬',
    label: 'Quote Block',
    description: 'Pull quote or testimonial',
    template: {
      id: Date.now(),
      title: 'Quote Block',
      excerpt: '"This is an inspiring quote that will motivate your readers to take action."',
      author: 'Quote Author',
      date: new Date().toISOString().split('T')[0],
      image: 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 100),
      category: 'Quote',
      type: 'quote'
    }
  },
  {
    id: 'newsletter',
    icon: '📧',
    label: 'Newsletter',
    description: 'Email signup call to action',
    template: {
      id: Date.now(),
      title: 'Subscribe to Newsletter',
      excerpt: 'Get the latest posts delivered straight to your inbox. No spam, ever.',
      author: 'CoreHead',
      date: new Date().toISOString().split('T')[0],
      image: 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 100),
      category: 'Newsletter',
      type: 'newsletter'
    }
  }
];

export default function ComponentsPanel({ onAddComponent }) {
  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
        🧩 Components
      </h2>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        Click any block to add it to your canvas
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {componentBlocks.map(block => (
          <div
            key={block.id}
            onClick={() => onAddComponent({ ...block.template, id: Date.now() })}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '10px',
              padding: '14px',
              cursor: 'pointer',
              background: '#fff',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#4f46e5';
              e.currentTarget.style.background = '#f5f3ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{block.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
              {block.label}
            </div>
            <div style={{ fontSize: '11px', color: '#888' }}>
              {block.description}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px', padding: '12px',
        background: '#f9f9f9', borderRadius: '8px',
        border: '1px dashed #ddd'
      }}>
        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', margin: 0 }}>
          💡 Click any component above to instantly add it to your builder canvas
        </p>
      </div>
    </div>
  );
}