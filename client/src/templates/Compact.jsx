import React from 'react';
import './Templates.css';
import './Compact.css';

export default function Compact({ data = {} }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    languages = [],
  } = data;

  const formatBullets = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[•\-*]\s*/, ''));
  };

  return (
    <div className="resume-paper compact-root">
      {/* Header */}
      <header className="compact-header">
        <div className="compact-header-main">
          <h1 className="compact-name">{personalInfo.fullName || 'Your Full Name'}</h1>
          {personalInfo.jobTitle && <span className="compact-headline"> | {personalInfo.jobTitle}</span>}
        </div>
        <div className="compact-contact-line">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && (
            <span>
              • <a href={personalInfo.website} target="_blank" rel="noreferrer">Portfolio</a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              • <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              • <a href={personalInfo.github} target="_blank" rel="noreferrer">GitHub</a>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="compact-section">
          <h2 className="compact-title">Summary</h2>
          <p className="compact-summary">{summary}</p>
        </section>
      )}

      {/* Skills (High priority placement in compact resumes) */}
      {skills.length > 0 && (
        <section className="compact-section">
          <h2 className="compact-title">Technical Skills</h2>
          <div className="compact-skills-grid">
            {skills.map((s, idx) => (
              <div key={idx} className="compact-skill-row">
                <span className="compact-skill-label">{s.category}:</span>{' '}
                <span className="compact-skill-text">{s.items}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="compact-section">
          <h2 className="compact-title">Experience</h2>
          <div className="compact-entries">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="compact-entry">
                <div className="compact-entry-header">
                  <div className="compact-entry-title-box">
                    <strong>{exp.title}</strong>
                    {exp.company && <span className="compact-muted"> — {exp.company}</span>}
                    {exp.location && <span className="compact-location"> ({exp.location})</span>}
                  </div>
                  <span className="compact-date">
                    {exp.startDate} {exp.startDate && (exp.isCurrent ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                  </span>
                </div>
                {exp.description && (
                  <ul className="compact-bullets">
                    {formatBullets(exp.description).map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="compact-section">
          <h2 className="compact-title">Projects</h2>
          <div className="compact-entries">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="compact-entry">
                <div className="compact-entry-header">
                  <div className="compact-entry-title-box">
                    <strong>{proj.title}</strong>
                    {proj.role && <span className="compact-muted"> ({proj.role})</span>}
                  </div>
                  {proj.technologies && <span className="compact-tech">{proj.technologies}</span>}
                </div>
                {proj.description && (
                  <ul className="compact-bullets">
                    {formatBullets(proj.description).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="compact-section">
          <h2 className="compact-title">Education</h2>
          <div className="compact-entries">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="compact-entry-header">
                <div>
                  <strong>{edu.institution}</strong> — {edu.degree}{' '}
                  {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}{' '}
                  {edu.gpa && <span className="compact-gpa">[{edu.gpa}]</span>}
                </div>
                <span className="compact-date">
                  {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages in compact row */}
      {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
        <section className="compact-section">
          <h2 className="compact-title">Certifications & Additional</h2>
          <div className="compact-additional-list">
            {certifications.length > 0 && (
              <div className="compact-add-line">
                <strong>Certifications:</strong>{' '}
                {certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`).join('; ')}
              </div>
            )}
            {achievements.length > 0 && (
              <div className="compact-add-line">
                <strong>Honors & Awards:</strong>{' '}
                {achievements.map((a) => `${a.title}${a.issuer ? ` (${a.issuer})` : ''}`).join('; ')}
              </div>
            )}
            {languages.length > 0 && (
              <div className="compact-add-line">
                <strong>Languages:</strong>{' '}
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
