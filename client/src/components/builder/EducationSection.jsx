import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';

export default function EducationSection({ education = [], onChange }) {
  const [expandedId, setExpandedId] = useState(education[0]?.id || null);

  const handleAdd = () => {
    const newEntry = {
      id: 'edu-' + Date.now().toString(36),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange([...education, newEntry]);
    setExpandedId(newEntry.id);
  };

  const handleUpdate = (id, field, value) => {
    onChange(education.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= education.length) return;
    const items = [...education];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="builder-form-section">
      <div className="section-header-flex">
        <label className="input-label">Education ({education.length})</label>
        <Button variant="outline" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="empty-sub-state">
          <p>No education details added yet. Add university, college, or bootcamp qualifications.</p>
          <Button variant="secondary" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
            Add Education
          </Button>
        </div>
      ) : (
        <div className="accordion-list">
          {education.map((item, index) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="accordion-card">
                <div
                  className="accordion-header"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="accordion-title-wrap">
                    <span className="accordion-title">
                      {item.institution || 'Untitled Institution'}
                    </span>
                    {(item.degree || item.fieldOfStudy) && (
                      <span className="accordion-subtitle">
                        — {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                      </span>
                    )}
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
                      disabled={index === education.length - 1}
                      onClick={() => handleMove(index, 1)}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => handleDelete(item.id)}
                      title="Delete education"
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
                    <Input
                      label="Institution / University Name"
                      placeholder="e.g. University of California, Berkeley"
                      value={item.institution}
                      onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)}
                      required
                    />

                    <div className="grid-2-col">
                      <Input
                        label="Degree"
                        placeholder="e.g. Bachelor of Science"
                        value={item.degree}
                        onChange={(e) => handleUpdate(item.id, 'degree', e.target.value)}
                      />
                      <Input
                        label="Field of Study / Major"
                        placeholder="e.g. Computer Science"
                        value={item.fieldOfStudy}
                        onChange={(e) => handleUpdate(item.id, 'fieldOfStudy', e.target.value)}
                      />
                    </div>

                    <div className="grid-3-col">
                      <Input
                        label="Location"
                        placeholder="e.g. Berkeley, CA"
                        value={item.location}
                        onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        type="month"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date (or Expected)"
                        type="month"
                        value={item.endDate}
                        onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                      />
                    </div>

                    <Input
                      label="GPA / Honors (Optional)"
                      placeholder="e.g. 3.8 / 4.0 (Dean's Honors List)"
                      value={item.gpa}
                      onChange={(e) => handleUpdate(item.id, 'gpa', e.target.value)}
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
