import React from 'react';
import './Templates.css';
import './Professional.css';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/ui/BrandIcons';

export default function Professional({ data = {} }) {
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
    <div className="resume-paper prof-root">
      {/* Top Banner / Name */}
      <header className="prof-header">
        <div className="prof-title-group">
          <h1 className="prof-name">{personalInfo.fullName || 'Your Full Name'}</h1>
          {personalInfo.jobTitle && <p className="prof-headline">{personalInfo.jobTitle}</p>}
        </div>

        <div className="prof-contact-grid">
          {personalInfo.email && (
            <div className="prof-contact-item">
              <Mail size={12} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="prof-contact-item">
              <Phone size={12} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="prof-contact-item">
              <MapPin size={12} />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="prof-contact-item">
              <Globe size={12} />
              <a href={personalInfo.website} target="_blank" rel="noreferrer">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="prof-contact-item">
              <LinkedinIcon size={12} />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          )}
          {personalInfo.github && (
            <div className="prof-contact-item">
              <GithubIcon size={12} />
              <a href={personalInfo.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="prof-section">
          <div className="prof-sec-heading">
            <span className="prof-sec-indicator" />
            <h2>Executive Summary</h2>
          </div>
          <p className="prof-summary-text">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="prof-section">
          <div className="prof-sec-heading">
            <span className="prof-sec-indicator" />
            <h2>Work Experience</h2>
          </div>
          <div className="prof-entries">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="prof-entry">
                <div className="prof-entry-top">
                  <div>
                    <h3 className="prof-role">{exp.title}</h3>
                    <p className="prof-company">{exp.company} {exp.location && `• ${exp.location}`}</p>
                  </div>
                  <span className="prof-badge-date">
                    {exp.startDate} {exp.startDate && (exp.isCurrent ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                  </span>
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
        <section className="prof-section">
          <div className="prof-sec-heading">
            <span className="prof-sec-indicator" />
            <h2>Education</h2>
          </div>
          <div className="prof-entries">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="prof-entry">
                <div className="prof-entry-top">
                  <div>
                    <h3 className="prof-role">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                    <p className="prof-company">{edu.institution} {edu.location && `• ${edu.location}`}</p>
                  </div>
                  <span className="prof-badge-date">
                    {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                  </span>
                </div>
                {edu.gpa && <p className="prof-gpa">{edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="prof-section">
          <div className="prof-sec-heading">
            <span className="prof-sec-indicator" />
            <h2>Core Competencies</h2>
          </div>
          <div className="prof-skills-container">
            {skills.map((s, idx) => (
              <div key={idx} className="prof-skill-row">
                <span className="prof-skill-cat">{s.category}</span>
                <span className="prof-skill-val">{s.items}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="prof-section">
          <div className="prof-sec-heading">
            <span className="prof-sec-indicator" />
            <h2>Key Projects</h2>
          </div>
          <div className="prof-entries">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="prof-entry">
                <div className="prof-entry-top">
                  <div>
                    <h3 className="prof-role">{proj.title}</h3>
                    {proj.role && <p className="prof-company">Role: {proj.role}</p>}
                  </div>
                  {proj.technologies && <span className="prof-tech-tag">{proj.technologies}</span>}
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

      {/* Certifications & Languages */}
      {(certifications.length > 0 || languages.length > 0) && (
        <div className="prof-split-grid">
          {certifications.length > 0 && (
            <div className="prof-split-col">
              <div className="prof-sec-heading">
                <span className="prof-sec-indicator" />
                <h2>Certifications</h2>
              </div>
              <ul className="resume-bullets">
                {certifications.map((c, idx) => (
                  <li key={c.id || idx}>
                    <strong>{c.name}</strong> {c.issuer && `(${c.issuer})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div className="prof-split-col">
              <div className="prof-sec-heading">
                <span className="prof-sec-indicator" />
                <h2>Languages</h2>
              </div>
              <ul className="resume-bullets">
                {languages.map((l, idx) => (
                  <li key={l.id || idx}>
                    <strong>{l.language}</strong> — {l.proficiency}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
