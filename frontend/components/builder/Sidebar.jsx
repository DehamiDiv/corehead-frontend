'use client';

import { Layout, Grid, Database, Settings, Eye } from 'lucide-react';

const tabs = [
  { id: 'builder',    icon: Layout,   label: 'Builder' },
  { id: 'components', icon: Grid,     label: 'Components' },
  { id: 'cms',        icon: Database, label: 'CMS' },
  { id: 'settings',   icon: Settings, label: 'Settings' },
  { id: 'preview',    icon: Eye,      label: 'Preview' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside style={{
      width: '64px',
      minWidth: '64px',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '16px',
      gap: '4px',
      borderRight: '1px solid #e2e8f0'
    }}>
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          title={label}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            background: activeTab === id
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
              : 'transparent',
            color: activeTab === id ? '#fff' : '#64748b',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (activeTab !== id) {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#1e293b';
            }
          }}
          onMouseLeave={e => {
            if (activeTab !== id) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }
          }}

        >
          <Icon size={18} />
          <span style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.3px' }}>
            {label}
          </span>
        </button>
      ))}
    </aside>
  );
}
