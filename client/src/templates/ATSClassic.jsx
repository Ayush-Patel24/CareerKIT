import React from 'react';
import './Templates.css';
import './ATSClassic.css';

export default function ATSClassic({ data = {} }) {
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
    <div className="resume-paper ats-classic-root">
      {/* Header */}
      <header className="ats-header">
        <h1 className="ats-name">{personalInfo.fullName || 'Your Full Name'}</h1>
        {personalInfo.jobTitle && <p className="ats-headline">{personalInfo.jobTitle}</p>}

        <div className="ats-contact-row">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noreferrer">
              Portfolio
            </a>
          )}
          {personalInfo.linkedin && <span>•</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {personalInfo.github && <span>•</span>}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="ats-section">
          <h2 className="ats-section-title">Professional Summary</h2>
          <p className="ats-summary-text">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Work Experience</h2>
          <div className="ats-entries-list">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="ats-entry">
                <div className="ats-entry-header">
                  <div>
                    <strong className="ats-entry-title">{exp.title}</strong>
                    {exp.company && <span className="ats-entry-company"> — {exp.company}</span>}
                  </div>
                  <div className="ats-entry-meta">
                    {exp.startDate} {exp.startDate && (exp.isCurrent ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                    {exp.location && ` | ${exp.location}`}
                  </div>
                </div>
                {exp.description && (
                  <ul className="resume-bullets">
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

      {/* Education */}
      {education.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Education</h2>
          <div className="ats-entries-list">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="ats-entry">
                <div className="ats-entry-header">
                  <div>
                    <strong className="ats-entry-title">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </strong>
                    {edu.institution && <span className="ats-entry-company"> — {edu.institution}</span>}
                  </div>
                  <div className="ats-entry-meta">
                    {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                    {edu.location && ` | ${edu.location}`}
                  </div>
                </div>
                {edu.gpa && <p className="ats-entry-sub">{edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Skills & Technologies</h2>
          <div className="ats-skills-list">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="ats-skill-line">
                <strong className="ats-skill-cat">{skillGroup.category}:</strong>{' '}
                <span className="ats-skill-items">{skillGroup.items}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Key Projects</h2>
          <div className="ats-entries-list">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="ats-entry">
                <div className="ats-entry-header">
                  <div>
                    <strong className="ats-entry-title">{proj.title}</strong>
                    {proj.role && <span className="ats-entry-company"> ({proj.role})</span>}
                  </div>
                  <div className="ats-entry-meta">
                    {proj.technologies && <span>{proj.technologies}</span>}
                  </div>
                </div>
                {proj.description && (
                  <ul className="resume-bullets">
                    {formatBullets(proj.description).map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="ats-two-col-row">
          {certifications.length > 0 && (
            <section className="ats-section flex-1">
              <h2 className="ats-section-title">Certifications</h2>
              <ul className="resume-bullets">
                {certifications.map((c, idx) => (
                  <li key={c.id || idx}>
                    <strong>{c.name}</strong> {c.issuer && `— ${c.issuer}`} {c.issueDate && `(${c.issueDate})`}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {achievements.length > 0 && (
            <section className="ats-section flex-1">
              <h2 className="ats-section-title">Achievements</h2>
              <ul className="resume-bullets">
                {achievements.map((a, idx) => (
                  <li key={a.id || idx}>
                    <strong>{a.title}</strong> {a.issuer && `— ${a.issuer}`} {a.description && `: ${a.description}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title">Languages</h2>
          <p className="ats-languages-text">
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
          </p>
        </section>
      )}
    </div>
  );
}
