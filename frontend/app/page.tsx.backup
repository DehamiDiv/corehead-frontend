'use client';

import Link from 'next/link';
import { FileText, List, PlusCircle, Eye, Image, LayoutGrid, Settings, BarChart3, FolderOpen, Palette } from 'lucide-react';
import './dashboard.css';

export default function Dashboard() {
  const pages = [
    {
      title: 'Blog Builder',
      description: 'Visual page builder with CMS fields',
      icon: LayoutGrid,
      href: '/builder',
      color: 'purple',
      status: 'Active'
    },
    {
      title: 'All Posts',
      description: 'Manage and organize your blog posts',
      icon: List,
      href: '/posts',
      color: 'blue',
      status: 'Active'
    },
    {
      title: 'Create Post',
      description: 'Write and publish new blog content',
      icon: PlusCircle,
      href: '/posts/new',
      color: 'green',
      status: 'Active'
    },
    {
      title: 'Preview',
      description: 'Preview posts before publishing',
      icon: Eye,
      href: '/preview/1',
      color: 'orange',
      status: 'Active'
    },
    {
      title: 'Media Library',
      description: 'Upload and manage media files',
      icon: Image,
      href: '/media',
      color: 'pink',
      status: 'Active'
    },
    {
      title: 'Categories',
      description: 'Organize posts into categories',
      icon: FolderOpen,
      href: '/categories',
      color: 'cyan',
      status: 'Coming Soon'
    },
    {
      title: 'Templates',
      description: 'Save and reuse blog layouts',
      icon: Palette,
      href: '/templates',
      color: 'yellow',
      status: 'Coming Soon'
    },
    {
      title: 'Settings',
      description: 'Configure your blog settings',
      icon: Settings,
      href: '/settings',
      color: 'gray',
      status: 'Coming Soon'
    },
    {
      title: 'Analytics',
      description: 'View performance and statistics',
      icon: BarChart3,
      href: '/analytics',
      color: 'indigo',
      status: 'Coming Soon'
    }
  ];

  const stats = [
    { label: 'Total Posts', value: '24', change: '+12%' },
    { label: 'Published', value: '18', change: '+8%' },
    { label: 'Drafts', value: '6', change: '-2%' },
    { label: 'Media Files', value: '142', change: '+24%' }
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">CoreHead<span>.app</span></h1>
            <div className="header-subtitle">Blog Management System</div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">JD</div>
              <span className="user-name">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Welcome back! 👋</h2>
            <p>Manage your blog content, media, and settings from here.</p>
          </section>

          {/* Stats Cards */}
          <section className="stats-section">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change} from last month
                </div>
              </div>
            ))}
          </section>

          {/* Pages Grid */}
          <section className="pages-section">
            <h3 className="section-title">Quick Access</h3>
            <div className="pages-grid">
              {pages.map((page, index) => {
                const Icon = page.icon;
                const isActive = page.status === 'Active';
                
                return (
                  <Link 
                    key={index} 
                    href={isActive ? page.href : '#'}
                    className={`page-card ${page.color} ${!isActive ? 'disabled' : ''}`}
                  >
                    <div className="card-icon">
                      <Icon size={32} />
                    </div>
                    <div className="card-content">
                      <h4 className="card-title">{page.title}</h4>
                      <p className="card-description">{page.description}</p>
                    </div>
                    <div className={`card-status ${isActive ? 'active' : 'coming-soon'}`}>
                      {page.status}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="activity-section">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon purple">
                  <FileText size={18} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Created new post "Getting Started with React"</div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon green">
                  <Image size={18} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Uploaded 5 new images to media library</div>
                  <div className="activity-time">5 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon blue">
                  <Eye size={18} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">Published "Advanced CSS Techniques"</div>
                  <div className="activity-time">Yesterday</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}