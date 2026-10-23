import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../templates';
import { useResume } from '../context/ResumeContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Check, ArrowRight, Eye } from 'lucide-react';
import './TemplatesPage.css';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { currentResume, setTemplate } = useResume();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewingTemplateId, setPreviewingTemplateId] = useState(null);

  const categories = ['All', 'ATS-Optimized', 'Professional', 'Modern', 'Student / Graduate'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (templateId) => {
    setTemplate(templateId);
    navigate(`/builder?template=${templateId}`);
  };

  const currentPreviewTemplate = TEMPLATES.find((t) => t.id === previewingTemplateId);
  const PreviewComponent = currentPreviewTemplate ? currentPreviewTemplate.component : null;

  return (
    <div className="container page-content">
      {/* Header */}
      <div className="templates-header">
        <Badge variant="default" size="sm" className="mb-2">
          100% Free • No Paywalls
        </Badge>
        <h1 className="templates-title">Professional Resume Templates</h1>
        <p className="templates-subtitle">
          Engineered for Applicant Tracking Systems (ATS) and human recruiters. Pick a format that highlights your strengths.
        </p>

        {/* Filter categories */}
        <div className="template-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? 'filter-btn-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="templates-grid">
        {filteredTemplates.map((template) => {
          const isCurrentActive = currentResume.templateId === template.id;
          const MiniComponent = template.component;

          return (
            <div key={template.id} className="template-card">
              {/* Miniature visual rendering */}
              <div
                className="template-preview-frame"
                onClick={() => setPreviewingTemplateId(template.id)}
              >
                <div className="mini-paper-wrapper">
                  <MiniComponent data={currentResume.content} />
                </div>
                <div className="template-overlay-hover">
                  <span className="template-overlay-btn">
                    <Eye size={16} /> Click to Full View
                  </span>
                </div>
              </div>

              {/* Template details */}
              <div className="template-info">
                <div className="template-info-top">
                  <h3 className="template-card-name">{template.name}</h3>
                  <Badge variant="outline" size="sm">
                    {template.category}
                  </Badge>
                </div>
                <p className="template-card-desc">{template.description}</p>

                <ul className="template-features-list">
                  {template.features.map((f, i) => (
                    <li key={i}>
                      <Check size={13} className="feature-check-icon" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="template-card-actions">
                  <Button
                    variant={isCurrentActive ? 'secondary' : 'primary'}
                    size="md"
                    className="w-full"
                    onClick={() => handleSelectTemplate(template.id)}
                    rightIcon={<ArrowRight size={15} />}
                  >
                    {isCurrentActive ? 'Active in Builder' : 'Use This Template'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewingTemplateId && (
        <div
          className="modal-backdrop"
          onClick={() => setPreviewingTemplateId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="template-modal-box animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="template-modal-top">
              <div>
                <h3 className="text-lg font-semibold">{currentPreviewTemplate?.name}</h3>
                <p className="text-xs text-muted">{currentPreviewTemplate?.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleSelectTemplate(previewingTemplateId);
                    setPreviewingTemplateId(null);
                  }}
                  rightIcon={<ArrowRight size={14} />}
                >
                  Use Template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewingTemplateId(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="template-modal-scroll">
              {PreviewComponent && <PreviewComponent data={currentResume.content} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
