import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

export default function SkillsSection({ skills = [], onChange }) {
  const handleAdd = () => {
    const newCategory = {
      category: 'New Skill Category',
      items: '',
    };
    onChange([...skills, newCategory]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDelete = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="builder-form-section">
      <div className="section-header-flex">
        <label className="input-label">Skills & Competencies ({skills.length} groups)</label>
        <Button variant="outline" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
          Add Skill Category
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="empty-sub-state">
          <p>No skills added yet. Add skill groups like Frontend, Backend, Tools, etc.</p>
          <Button variant="secondary" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
            Add Skill Group
          </Button>
        </div>
      ) : (
        <div className="skills-builder-list">
          {skills.map((skillGroup, index) => (
            <div key={index} className="skill-group-card">
              <div className="skill-group-top">
                <Input
                  label="Category Name"
                  placeholder="e.g. Languages, Cloud & DevOps, Frameworks"
                  value={skillGroup.category}
                  onChange={(e) => handleUpdate(index, 'category', e.target.value)}
                  className="mb-0"
                />
                <button
                  type="button"
                  className="icon-btn icon-btn-danger mt-6"
                  onClick={() => handleDelete(index)}
                  title="Remove group"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <Input
                label="Skills (Comma-separated)"
                placeholder="e.g. JavaScript, React, Node.js, PostgreSQL, Docker"
                value={skillGroup.items}
                onChange={(e) => handleUpdate(index, 'items', e.target.value)}
                helperText="Tip: Separate items with commas. ATS parsers match these exact keywords."
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
