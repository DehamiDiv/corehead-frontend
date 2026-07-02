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
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '16px',
      gap: '4px',
      borderRight: '1px solid rgba(255, 255, 255, 0.5)'
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
              ? '#2563eb'
              : 'transparent',
            color: activeTab === id ? '#fff' : '#475569',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (activeTab !== id) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.color = '#1e293b';
            }
          }}
          onMouseLeave={e => {
            if (activeTab !== id) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#475569';
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
