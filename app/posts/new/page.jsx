'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import './page.css';

export default function NewPostPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Development',
    tags: [],
    status: 'draft',
    featuredImage: null,
    author: 'John Doe',
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['Development', 'Design', 'Marketing', 'Business', 'Technology', 'Lifestyle'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          featuredImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = (status) => {
    const postData = {
      ...formData,
      status: status
    };
    console.log('Saving post:', postData);
    alert(`Post saved as ${status}!`);
  };

  return (
    <div className="new-post-page">
      {/* Header */}
      <header className="post-header">
        <div className="header-left">
          <Link href="/posts">
            <button className="btn-back">
              <ArrowLeft size={18} />
              Back to Posts
            </button>
          </Link>
          <h1>Create New Post</h1>
        </div>
        
        <div className="header-actions">
          <button className="btn-secondary">
            <Eye size={18} />
            Preview
          </button>
          <button className="btn-secondary" onClick={() => handleSave('draft')}>
            <Save size={18} />
            Save Draft
          </button>
          <button className="btn-primary" onClick={() => handleSave('published')}>
            <Save size={18} />
            Publish
          </button>
        </div>
      </header>

      <div className="post-content">
        {/* Main Content Area */}
        <div className="main-section">
          {/* Title */}
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Enter post title..."
              className="title-input"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Slug */}
          <div className="form-group slug-group">
            <label>URL Slug</label>
            <div className="slug-preview">
              <span className="slug-base">corehead.app/blog/</span>
              <input
                type="text"
                name="slug"
                className="slug-input"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label>Excerpt</label>
            <textarea
              name="excerpt"
              placeholder="Write a brief summary of your post..."
              className="excerpt-input"
              rows="3"
              value={formData.excerpt}
              onChange={handleInputChange}
            />
            <span className="char-count">{formData.excerpt.length} characters</span>
          </div>

          {/* Content Editor */}
          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              placeholder="Write your post content here...

You can use Markdown formatting:
# Heading 1
## Heading 2
**bold text**
*italic text*
[link](url)
![image](url)"
              className="content-editor"
              rows="20"
              value={formData.content}
              onChange={handleInputChange}
            />
            <div className="editor-footer">
              <span className="word-count">
                {formData.content.split(/\s+/).filter(Boolean).length} words
              </span>
              <span className="format-hint">Markdown supported</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="form-group">
            <label>Featured Image</label>
            <div className="image-upload-area">
              {!imagePreview ? (
                <label className="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <ImageIcon size={40} />
                  <span className="upload-text">Click to upload image</span>
                  <span className="upload-hint">JPG, PNG, GIF up to 10MB</span>
                </label>
              ) : (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button className="remove-image" onClick={removeImage}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar-section">
          {/* Category */}
          <div className="sidebar-card">
            <h3>Category</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="sidebar-card">
            <h3>Tags</h3>
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={addTag} className="add-tag-btn">
                <Plus size={16} />
              </button>
            </div>
            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="sidebar-card">
            <h3>Author</h3>
            <select
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="author-select"
            >
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Mike Johnson</option>
              <option>Sarah Wilson</option>
            </select>
          </div>

          {/* SEO Settings */}
          <div className="sidebar-card">
            <h3>SEO Settings</h3>
            
            <div className="seo-field">
              <label>Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                placeholder="SEO title..."
                value={formData.metaTitle}
                onChange={handleInputChange}
              />
              <span className="field-hint">{formData.metaTitle.length}/60 characters</span>
            </div>

            <div className="seo-field">
              <label>Meta Description</label>
              <textarea
                name="metaDescription"
                placeholder="SEO description..."
                rows="3"
                value={formData.metaDescription}
                onChange={handleInputChange}
              />
              <span className="field-hint">{formData.metaDescription.length}/160 characters</span>
            </div>

            <div className="seo-field">
              <label>Keywords</label>
              <input
                type="text"
                name="keywords"
                placeholder="keyword1, keyword2, keyword3"
                value={formData.keywords}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Post Status */}
          <div className="sidebar-card status-card">
            <h3>Status</h3>
            <div className="status-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleInputChange}
                />
                <span>Draft</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={handleInputChange}
                />
                <span>Published</span>
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}