'use client';

import { useState } from 'react';
import { Upload, Search, Grid, List, Trash2, Download, MoreVertical, Image as ImageIcon, X, Check } from 'lucide-react';
import './page.css';

export default function MediaLibraryPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [uploadMode, setUploadMode] = useState(false);

  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      name: 'blog-header-react.jpg',
      type: 'image/jpeg',
      size: '245 KB',
      uploadDate: '2024-02-10',
      url: 'https://picsum.photos/400/300?random=1',
      dimensions: '1920x1080'
    },
    {
      id: 2,
      name: 'css-techniques.png',
      type: 'image/png',
      size: '512 KB',
      uploadDate: '2024-02-12',
      url: 'https://picsum.photos/400/300?random=2',
      dimensions: '1200x800'
    },
    {
      id: 3,
      name: 'javascript-es2024.jpg',
      type: 'image/jpeg',
      size: '189 KB',
      uploadDate: '2024-02-13',
      url: 'https://picsum.photos/400/300?random=3',
      dimensions: '1600x900'
    },
    {
      id: 4,
      name: 'ui-design-principles.png',
      type: 'image/png',
      size: '678 KB',
      uploadDate: '2024-02-14',
      url: 'https://picsum.photos/400/300?random=4',
      dimensions: '2000x1200'
    },
    {
      id: 5,
      name: 'api-architecture.jpg',
      type: 'image/jpeg',
      size: '334 KB',
      uploadDate: '2024-02-15',
      url: 'https://picsum.photos/400/300?random=5',
      dimensions: '1800x1000'
    },
    {
      id: 6,
      name: 'web-performance.png',
      type: 'image/png',
      size: '421 KB',
      uploadDate: '2024-02-16',
      url: 'https://picsum.photos/400/300?random=6',
      dimensions: '1400x900'
    }
  ]);

  const filteredMedia = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMedia = (mediaId) => {
    if (selectedMedia.includes(mediaId)) {
      setSelectedMedia(selectedMedia.filter(id => id !== mediaId));
    } else {
      setSelectedMedia([...selectedMedia, mediaId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMedia.length === filteredMedia.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(filteredMedia.map(m => m.id));
    }
  };

  const handleDelete = (mediaId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setMediaFiles(mediaFiles.filter(m => m.id !== mediaId));
      setSelectedMedia(selectedMedia.filter(id => id !== mediaId));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedMedia.length} selected files?`)) {
      setMediaFiles(mediaFiles.filter(m => !selectedMedia.includes(m.id)));
      setSelectedMedia([]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMedia = {
          id: Math.max(...mediaFiles.map(m => m.id)) + 1,
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(0) + ' KB',
          uploadDate: new Date().toISOString().split('T')[0],
          url: reader.result,
          dimensions: 'Calculating...'
        };
        setMediaFiles([newMedia, ...mediaFiles]);
      };
      reader.readAsDataURL(file);
    });
    setUploadMode(false);
  };

  return (
    <div className="media-library-page">
      {/* Header */}
      <header className="media-header">
        <div className="header-left">
          <h1 className="logo">CoreHead<span>.app</span></h1>
          <div className="page-title">
            <ImageIcon size={20} />
            <span>Media Library</span>
            <span className="media-count">{mediaFiles.length} files</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setUploadMode(true)}>
            <Upload size={18} />
            Upload Files
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="media-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-right">
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>

          {selectedMedia.length > 0 && (
            <button className="btn-danger" onClick={handleBulkDelete}>
              <Trash2 size={16} />
              Delete ({selectedMedia.length})
            </button>
          )}
        </div>
      </div>

      {/* Selection Bar */}
      {filteredMedia.length > 0 && (
        <div className="selection-bar">
          <label className="select-all">
            <input
              type="checkbox"
              checked={selectedMedia.length === filteredMedia.length && filteredMedia.length > 0}
              onChange={handleSelectAll}
            />
            <span>Select All ({filteredMedia.length})</span>
          </label>
        </div>
      )}

      {/* Media Grid/List */}
      <div className={`media-container ${viewMode}`}>
        {viewMode === 'grid' ? (
          <div className="media-grid">
            {filteredMedia.map(media => (
              <div 
                key={media.id} 
                className={`media-card ${selectedMedia.includes(media.id) ? 'selected' : ''}`}
              >
                <div className="media-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(media.id)}
                    onChange={() => handleSelectMedia(media.id)}
                  />
                </div>
                
                <div className="media-preview">
                  <img src={media.url} alt={media.name} />
                </div>

                <div className="media-info">
                  <span className="media-name" title={media.name}>
                    {media.name}
                  </span>
                  <span className="media-size">{media.size}</span>
                </div>

                <div className="media-actions">
                  <button className="action-btn" title="Download">
                    <Download size={16} />
                  </button>
                  <button className="action-btn danger" title="Delete" onClick={() => handleDelete(media.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="media-list">
            <table>
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedMedia.length === filteredMedia.length && filteredMedia.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Dimensions</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map(media => (
                  <tr key={media.id} className={selectedMedia.includes(media.id) ? 'selected' : ''}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedMedia.includes(media.id)}
                        onChange={() => handleSelectMedia(media.id)}
                      />
                    </td>
                    <td className="preview-col">
                      <img src={media.url} alt={media.name} />
                    </td>
                    <td className="name-col">{media.name}</td>
                    <td>{media.type}</td>
                    <td>{media.size}</td>
                    <td>{media.dimensions}</td>
                    <td>{new Date(media.uploadDate).toLocaleDateString()}</td>
                    <td className="actions-col">
                      <div className="action-buttons">
                        <button className="action-btn" title="Download">
                          <Download size={16} />
                        </button>
                        <button className="action-btn danger" title="Delete" onClick={() => handleDelete(media.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="empty-state">
            <ImageIcon size={64} />
            <p>No media files found</p>
            <span>Try a different search or upload new files</span>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadMode && (
        <div className="upload-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload Files</h2>
              <button className="close-btn" onClick={() => setUploadMode(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="upload-area">
              <label className="upload-box">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={48} />
                <span className="upload-text">Click to upload or drag and drop</span>
                <span className="upload-hint">PNG, JPG, GIF up to 10MB each</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}