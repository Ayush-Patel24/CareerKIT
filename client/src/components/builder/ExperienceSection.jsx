import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function ExperienceSection({ experience = [], onChange }) {
  const toast = useToast();
  const [expandedId, setExpandedId] = useState(experience[0]?.id || null);
  const [improvingId, setImprovingId] = useState(null);
  const [bulletSuggestions, setBulletSuggestions] = useState({});

  const handleAdd = () => {
    const newEntry = {
      id: 'exp-' + Date.now().toString(36),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    onChange([...experience, newEntry]);
    setExpandedId(newEntry.id);
  };

  const handleUpdate = (id, field, value) => {
    onChange(
      experience.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const items = [...experience];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  const handleAiImproveBullets = async (exp) => {
    if (!exp.description || exp.description.trim().length < 5) {
      toast.warning('Please enter at least one bullet point or description to improve.');
      return;
    }

    setImprovingId(exp.id);
    try {
      const res = await api.improveBullet({
        bulletText: exp.description,
        role: exp.title,
        company: exp.company,
      });

      if (res.suggestions && res.suggestions.length > 0) {
        setBulletSuggestions((prev) => ({
          ...prev,
          [exp.id]: res.suggestions,
        }));
        toast.success('Generated action-driven STAR bullet suggestions!');
      } else {
        toast.info('No improvements generated. Try adding more context.');
      }
    } catch (err) {
      toast.error('AI improvement failed: ' + (err.message || 'Check backend server and Gemini API key'));
    } finally {
      setImprovingId(null);
    }
  };

  const handleApplyBulletSuggestion = (expId, suggestedText) => {
    handleUpdate(expId, 'description', suggestedText);
    setBulletSuggestions((prev) => {
      const next = { ...prev };
      delete next[expId];
      return next;
    });
    toast.success('Applied improved bullets!');
  };

  return (
    <div className="builder-form-section">
      <div className="section-header-flex">
        <label className="input-label">Work Experience ({experience.length})</label>
        <Button variant="outline" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
          Add Experience
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="empty-sub-state">
          <p>No work experience added yet. Add internships, full-time roles, or contract projects.</p>
          <Button variant="secondary" size="sm" onClick={handleAdd} leftIcon={<Plus size={14} />}>
            Add First Position
          </Button>
        </div>
      ) : (
        <div className="accordion-list">
          {experience.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const suggestions = bulletSuggestions[item.id];

            return (
              <div key={item.id} className="accordion-card">
                <div
                  className="accordion-header"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="accordion-title-wrap">
                    <span className="accordion-title">
                      {item.title || 'Untitled Role'}
                    </span>
                    {item.company && (
                      <span className="accordion-subtitle">at {item.company}</span>
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
                      disabled={index === experience.length - 1}
                      onClick={() => handleMove(index, 1)}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => handleDelete(item.id)}
                      title="Delete experience"
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
                        label="Job Title / Role"
                        placeholder="e.g. Senior Software Engineer"
                        value={item.title}
                        onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                        required
                      />
                      <Input
                        label="Company Name"
                        placeholder="e.g. Vanguard Tech Labs"
                        value={item.company}
                        onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid-3-col">
                      <Input
                        label="Location"
                        placeholder="e.g. San Francisco, CA / Remote"
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
                        label="End Date"
                        type="month"
                        value={item.endDate}
                        disabled={item.isCurrent}
                        onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                      />
                    </div>

                    <div className="checkbox-wrap">
                      <input
                        type="checkbox"
                        id={`current-${item.id}`}
                        checked={!!item.isCurrent}
                        onChange={(e) => handleUpdate(item.id, 'isCurrent', e.target.checked)}
                      />
                      <label htmlFor={`current-${item.id}`}>I currently work in this role</label>
                    </div>

                    <div className="bullet-editor-wrap">
                      <div className="bullet-header">
                        <label className="input-label">Key Responsibilities & Achievements</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAiImproveBullets(item)}
                          isLoading={improvingId === item.id}
                          leftIcon={<Sparkles size={13} />}
                        >
                          Polish Bullets with AI
                        </Button>
                      </div>
                      <Textarea
                        placeholder="• Led development of microservices in Node.js, reducing latency by 42%&#10;• Built real-time analytics pipeline processing 250k daily active users..."
                        value={item.description}
                        onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                        rows={5}
                        helperText="Separate each bullet point on a new line. Focus on quantifiable metrics and action verbs."
                      />

                      {/* AI Bullet Suggestions */}
                      {suggestions && (
                        <div className="ai-suggestions-tray animate-fade-in">
                          <div className="ai-tray-header">
                            <span className="ai-tray-title">
                              <Sparkles size={14} /> AI Improved Bullet Options (STAR Framework)
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setBulletSuggestions((prev) => {
                                  const n = { ...prev };
                                  delete n[item.id];
                                  return n;
                                })
                              }
                            >
                              Dismiss
                            </Button>
                          </div>
                          {suggestions.map((sug, i) => (
                            <div key={i} className="ai-suggestion-card">
                              <p className="ai-suggestion-body">{sug.text || sug}</p>
                              {sug.reason && (
                                <p className="ai-suggestion-reason">
                                  <strong>Why this works:</strong> {sug.reason}
                                </p>
                              )}
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApplyBulletSuggestion(item.id, sug.text || sug)}
                                leftIcon={<Check size={13} />}
                              >
                                Apply Suggestion
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
