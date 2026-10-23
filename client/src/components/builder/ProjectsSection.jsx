import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';

export default function ProjectsSection({ projects = [], onChange }) {
  const [expandedId, setExpandedId] = useState(projects[0]?.id || null);

  const handleAdd = () => {
    const newEntry = {
      id: 'proj-' + Date.now().toString(36),
      title: '',
      role: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      description: '',
    };
    onChange([...projects, newEntry]);
    setExpandedId(newEntry.id);
  };

  const handleUpdate = (id, field, value) => {
    onChange(projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id) => {
    onChange(projects.filter((item) => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const items = [...projects];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="builder-form-section">
      <div className="section-header-flex">
        <label className="input-label">Projects & Open Source ({projects.length})</label>
        <Button variant="outline" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-sub-state">
          <p>No projects added yet. Showcase portfolio projects, open source contributions, or apps.</p>
          <Button variant="secondary" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
            Add First Project
          </Button>
        </div>
      ) : (
        <div className="accordion-list">
          {projects.map((item, index) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="accordion-card">
                <div
                  className="accordion-header"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="accordion-title-wrap">
                    <span className="accordion-title">{item.title || 'Untitled Project'}</span>
                    {item.role && <span className="accordion-subtitle">({item.role})</span>}
                  </div>

                  <div className="accordion-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="icon-btn"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      disabled={index === projects.length - 1}
                      onClick={() => handleMove(index, 1)}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => handleDelete(item.id)}
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="accordion-body animate-fade-in">
                    <div className="grid-2-col">
                      <Input
                        label="Project Title"
                        placeholder="e.g. CloudMetrics — Observability Tool"
                        value={item.title}
                        onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                        required
                      />
                      <Input
                        label="Role / Contribution"
                        placeholder="e.g. Lead Developer, Solo Creator"
                        value={item.role}
                        onChange={(e) => handleUpdate(item.id, 'role', e.target.value)}
                      />
                    </div>

                    <Input
                      label="Technologies Used"
                      placeholder="e.g. React, Node.js, WebSockets, TimescaleDB"
                      value={item.technologies}
                      onChange={(e) => handleUpdate(item.id, 'technologies', e.target.value)}
                    />

                    <div className="grid-2-col">
                      <Input
                        label="Live Demo URL"
                        placeholder="e.g. https://myproject.demo.app"
                        value={item.liveUrl}
                        onChange={(e) => handleUpdate(item.id, 'liveUrl', e.target.value)}
                        leftIcon={<Globe size={14} />}
                      />
                      <Input
                        label="Source Code (GitHub)"
                        placeholder="e.g. https://github.com/myname/repo"
                        value={item.githubUrl}
                        onChange={(e) => handleUpdate(item.id, 'githubUrl', e.target.value)}
                        leftIcon={<GithubIcon size={14} />}
                      />
                    </div>

                    <Textarea
                      label="Project Description & Impact"
                      placeholder="Describe the problem solved, tech architecture, and quantifiable outcomes..."
                      value={item.description}
                      onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                      rows={4}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
