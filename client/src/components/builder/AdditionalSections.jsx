import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

export default function AdditionalSections({
  certifications = [],
  achievements = [],
  languages = [],
  onCertificationsChange,
  onAchievementsChange,
  onLanguagesChange,
}) {
  const [activeTab, setActiveTab] = useState('certifications');

  // Certifications handlers
  const addCert = () => {
    onCertificationsChange([
      ...certifications,
      { id: 'cert-' + Date.now().toString(36), name: '', issuer: '', issueDate: '' },
    ]);
  };

  const updateCert = (id, field, value) => {
    onCertificationsChange(
      certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const deleteCert = (id) => {
    onCertificationsChange(certifications.filter((c) => c.id !== id));
  };

  // Achievements handlers
  const addAch = () => {
    onAchievementsChange([
      ...achievements,
      { id: 'ach-' + Date.now().toString(36), title: '', issuer: '', date: '', description: '' },
    ]);
  };

  const updateAch = (id, field, value) => {
    onAchievementsChange(
      achievements.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const deleteAch = (id) => {
    onAchievementsChange(achievements.filter((a) => a.id !== id));
  };

  // Languages handlers
  const addLang = () => {
    onLanguagesChange([
      ...languages,
      { id: 'lang-' + Date.now().toString(36), language: '', proficiency: 'Fluent' },
    ]);
  };

  const updateLang = (id, field, value) => {
    onLanguagesChange(
      languages.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const deleteLang = (id) => {
    onLanguagesChange(languages.filter((l) => l.id !== id));
  };

  return (
    <div className="builder-form-section">
      <div className="subtabs-bar">
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('certifications')}
        >
          Certifications ({certifications.length})
        </button>
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements ({achievements.length})
        </button>
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          Languages ({languages.length})
        </button>
      </div>

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="tab-pane animate-fade-in">
          <div className="section-header-flex">
            <span className="text-sm text-secondary font-medium">Industry Certifications & Licenses</span>
            <Button variant="outline" size="sm" onClick={addCert} leftIcon={<Plus size={14} />}>
              Add Certificate
            </Button>
          </div>

          {certifications.length === 0 ? (
            <p className="text-sm text-muted mt-2">No certifications added yet.</p>
          ) : (
            <div className="compact-item-list">
              {certifications.map((item) => (
                <div key={item.id} className="compact-row-card">
                  <div className="grid-3-col">
                    <Input
                      label="Certification Name"
                      placeholder="e.g. AWS Solutions Architect"
                      value={item.name}
                      onChange={(e) => updateCert(item.id, 'name', e.target.value)}
                    />
                    <Input
                      label="Issuing Organization"
                      placeholder="e.g. Amazon Web Services"
                      value={item.issuer}
                      onChange={(e) => updateCert(item.id, 'issuer', e.target.value)}
                    />
                    <Input
                      label="Date Issued"
                      type="month"
                      value={item.issueDate}
                      onChange={(e) => updateCert(item.id, 'issueDate', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    onClick={() => deleteCert(item.id)}
                    title="Remove certification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="tab-pane animate-fade-in">
          <div className="section-header-flex">
            <span className="text-sm text-secondary font-medium">Awards, Competitions & Honors</span>
            <Button variant="outline" size="sm" onClick={addAch} leftIcon={<Plus size={14} />}>
              Add Award
            </Button>
          </div>

          {achievements.length === 0 ? (
            <p className="text-sm text-muted mt-2">No achievements or awards added yet.</p>
          ) : (
            <div className="compact-item-list">
              {achievements.map((item) => (
                <div key={item.id} className="compact-row-card">
                  <div className="grid-2-col">
                    <Input
                      label="Award / Title"
                      placeholder="e.g. Hackathon Grand Prize Winner"
                      value={item.title}
                      onChange={(e) => updateAch(item.id, 'title', e.target.value)}
                    />
                    <Input
                      label="Issuer / Organization"
                      placeholder="e.g. TechCrunch Disrupt"
                      value={item.issuer}
                      onChange={(e) => updateAch(item.id, 'issuer', e.target.value)}
                    />
                  </div>
                  <Input
                    label="Description"
                    placeholder="Brief description of the accomplishment..."
                    value={item.description}
                    onChange={(e) => updateAch(item.id, 'description', e.target.value)}
                  />
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    onClick={() => deleteAch(item.id)}
                    title="Remove award"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Languages Tab */}
      {activeTab === 'languages' && (
        <div className="tab-pane animate-fade-in">
          <div className="section-header-flex">
            <span className="text-sm text-secondary font-medium">Languages & Proficiency</span>
            <Button variant="outline" size="sm" onClick={addLang} leftIcon={<Plus size={14} />}>
              Add Language
            </Button>
          </div>

          {languages.length === 0 ? (
            <p className="text-sm text-muted mt-2">No languages added yet.</p>
          ) : (
            <div className="compact-item-list">
              {languages.map((item) => (
                <div key={item.id} className="compact-row-card-lang">
                  <Input
                    label="Language"
                    placeholder="e.g. English, Spanish, German"
                    value={item.language}
                    onChange={(e) => updateLang(item.id, 'language', e.target.value)}
                  />
                  <div className="input-group">
                    <label className="input-label">Proficiency Level</label>
                    <select
                      className="input-field"
                      value={item.proficiency}
                      onChange={(e) => updateLang(item.id, 'proficiency', e.target.value)}
                    >
                      <option value="Native / Bilingual">Native / Bilingual</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Professional Working">Professional Working</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Elementary">Elementary</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger mt-6"
                    onClick={() => deleteLang(item.id)}
                    title="Remove language"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
