'use client';

import { Layout, Layers, Database, Settings, Eye } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'builder', icon: Layout, label: 'Builder' },
    { id: 'components', icon: Layers, label: 'Components' },
    { id: 'cms', icon: Database, label: 'CMS Fields' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'preview', icon: Eye, label: 'Preview' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}